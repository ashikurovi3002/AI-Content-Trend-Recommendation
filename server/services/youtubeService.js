import axios from "axios";
import ContentItem from "../models/ContentItem.js";
import Job from "../models/Job.js";
import { normalizeUrl } from "../utils/urlNormalizer.js";

// Axios client for Google APIs
const googleClient = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  timeout: 10000
});

/**
 * Service to interface with YouTube Data API v3 for channel feeds.
 */
class YoutubeService {
  /**
   * Parse channel input string and extract query parameter flags for the API channels endpoint.
   * @param {string} input - Channel URL, handle, or ID
   * @returns {object} Query parameters (e.g., { id: 'UC...' } or { forHandle: '@...' })
   */
  parseChannelInput(input) {
    const trimmed = input.trim();

    // Check if direct 24-character channel ID (UC...)
    if (/^UC[a-zA-Z0-9_-]{22}$/.test(trimmed)) {
      return { id: trimmed };
    }

    // Check if direct handle (starting with @)
    if (trimmed.startsWith("@")) {
      return { forHandle: trimmed };
    }

    try {
      const url = new URL(trimmed);
      const pathname = url.pathname;

      // Match path UC channel ID: /channel/UC...
      const channelIdMatch = pathname.match(/\/channel\/(UC[a-zA-Z0-9_-]{22})/);
      if (channelIdMatch) {
        return { id: channelIdMatch[1] };
      }

      // Match path handle: /@handle
      const handleMatch = pathname.match(/\/(@[a-zA-Z0-9_-]+)/);
      if (handleMatch) {
        return { forHandle: handleMatch[1] };
      }

      // Match legacy user paths: /user/name or /c/name
      const legacyMatch = pathname.match(/\/(user|c)\/([a-zA-Z0-9_-]+)/);
      if (legacyMatch) {
        return { forUsername: legacyMatch[2] };
      }

      // Fallback: extract path tail if it's alphanumeric
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (/^[a-zA-Z0-9_-]+$/.test(lastPart)) {
          return { forHandle: lastPart.startsWith("@") ? lastPart : `@${lastPart}` };
        }
      }
    } catch {
      // Fallback: treat string as handle if no url pattern parsed
      return { forHandle: trimmed.startsWith("@") ? trimmed : `@${trimmed}` };
    }

    throw new Error(`Could not parse YouTube channel source URL: ${input}`);
  }

  /**
   * Resolve Channel ID and its uploads playlist ID from YouTube API.
   * @param {string} channelInput - Raw channel identifier
   * @returns {Promise<object>} Channel details (id, title, uploadsPlaylistId)
   */
  async resolveChannelDetails(channelInput) {
    const apiKey = process.env.YOUTUBE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("YOUTUBE_API_KEY is not configured inside environment variables");
    }

    const params = this.parseChannelInput(channelInput);

    const response = await googleClient.get("/channels", {
      params: {
        part: "id,snippet,contentDetails",
        key: apiKey,
        ...params
      }
    });

    const items = response.data?.items;
    if (!items || items.length === 0) {
      throw new Error(`YouTube Channel details not found for: ${channelInput}`);
    }

    const channel = items[0];
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error(`Related uploads playlist not found for YouTube channel: ${channelInput}`);
    }

    return {
      id: channel.id,
      title: channel.snippet?.title || "YouTube Channel",
      uploadsPlaylistId
    };
  }

  /**
   * Main crawl orchestrator wrapping execution in a Job transaction.
   * @param {string} sourceId - MongoDB Source reference ID
   * @param {string} channelUrl - Monitored target URL/handle/ID
   * @returns {Promise<Array>} List of saved ContentItems
   */
  async crawlChannel(sourceId, channelUrl) {
    console.log(`📡 Starting YouTube crawl workflow for: ${channelUrl}`);

    // Create new running Job entry (per checklist requirements)
    const job = new Job({
      sourceId,
      status: "running",
      startedAt: new Date()
    });
    await job.save();

    try {
      // 1. Resolve Channel details
      const channelInfo = await this.resolveChannelDetails(channelUrl);

      // 2. Fetch latest videos in uploads playlist
      const videos = await this.fetchLatestVideos(channelInfo.uploadsPlaylistId);

      const savedItems = [];
      for (const video of videos) {
        const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

        // URL Normalization before duplicate check
        const normalizedUrl = normalizeUrl(videoUrl);
        const exists = await ContentItem.findOne({ externalId: normalizedUrl });
        if (exists) {
          console.log(`⏭️ Skipping duplicate YouTube video: ${normalizedUrl}`);
          continue;
        }

        // Store video inside content_items (with duration mapped in rawText metadata)
        const contentItem = new ContentItem({
          sourceId,
          externalId: normalizedUrl,
          title: video.title,
          description: video.description || "",
          url: normalizedUrl,
          thumbnail: video.thumbnail || "",
          author: channelInfo.title,
          publishedAt: new Date(video.publishedAt),
          rawText: `[YouTube Video Duration: ${video.duration}]\n\n${video.description || ""}`,
          processedStatus: "pending"
        });

        await contentItem.save();
        savedItems.push(contentItem);
      }

      // Mark Job completed
      job.status = "completed";
      job.finishedAt = new Date();
      await job.save();

      console.log(`✅ YouTube crawl completed. Ingested ${savedItems.length} videos.`);
      return savedItems;
    } catch (error) {
      console.error(`❌ YouTube Ingestion failed for source ${channelUrl}: ${error.message}`);

      // Log crawler failure inside jobs collection
      job.status = "failed";
      job.error = error.message;
      job.finishedAt = new Date();
      await job.save();

      throw error;
    }
  }

  /**
   * Fetch latest uploads items and populate their durations.
   * @param {string} uploadsPlaylistId - Uploads playlist ID
   * @returns {Promise<Array>} Array of video details
   */
  async fetchLatestVideos(uploadsPlaylistId) {
    const apiKey = process.env.YOUTUBE_API_KEY || process.env.GEMINI_API_KEY;

    // 1. Fetch items from uploads playlist
    const response = await googleClient.get("/playlistItems", {
      params: {
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: 3,
        key: apiKey
      }
    });

    const items = response.data?.items || [];
    if (items.length === 0) {
      return [];
    }

    const videoList = items.map((item) => ({
      id: item.snippet?.resourceId?.videoId,
      title: item.snippet?.title || "Untitled Video",
      description: item.snippet?.description || "",
      publishedAt: item.snippet?.publishedAt || new Date(),
      thumbnail:
        item.snippet?.thumbnails?.maxres?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.default?.url ||
        ""
    }));

    // Filter out items missing videoId
    const validVideos = videoList.filter((v) => !!v.id);
    const videoIds = validVideos.map((v) => v.id).join(",");

    // 2. Fetch video details to retrieve Duration parameters
    const detailsResponse = await googleClient.get("/videos", {
      params: {
        part: "contentDetails",
        id: videoIds,
        key: apiKey
      }
    });

    const detailsItems = detailsResponse.data?.items || [];
    const durationMap = {};
    for (const detail of detailsItems) {
      durationMap[detail.id] = detail.contentDetails?.duration || "PT0S";
    }

    // Merge duration into final lists
    return validVideos.map((video) => ({
      ...video,
      duration: durationMap[video.id] || "PT0S"
    }));
  }
}

export default new YoutubeService();
