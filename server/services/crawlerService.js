import Parser from "rss-parser";
import * as cheerio from "cheerio";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import ContentItem from "../models/ContentItem.js";
import Job from "../models/Job.js";
import Source from "../models/Source.js";
import { normalizeUrl } from "../utils/urlNormalizer.js";

const rssParser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 TrendPilot/1.0"
  }
});

// Axios client with timeout and standard User-Agent (per checklist item 3)
const httpClient = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 TrendPilot/1.0",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
  }
});

/**
 * Service to orchestrate crawling pipelines.
 */
class CrawlerService {
  /**
   * Main crawl orchestrator wrapping execution in a Job transaction.
   * @param {string} sourceId - MongoDB Source reference ID
   * @param {string} sourceUrl - Monitored target URL
   * @returns {Promise<Array>} List of saved ContentItems
   */
  async crawlSource(sourceId, sourceUrl) {
    console.log(`📡 Starting crawling workflow for: ${sourceUrl}`);

    const source = await Source.findById(sourceId);
    if (!source) throw new Error(`Source not found: ${sourceId}`);
    const userId = source.userId;

    // Create new running Job entry (per checklist item 5)
    const job = new Job({
      sourceId,
      userId,
      status: "running",
      startedAt: new Date()
    });
    await job.save();

    let items = [];

    try {
      // 1. Try RSS Feed
      try {
        console.log("👉 Attempting RSS Ingestion...");
        items = await this.fetchRSS(sourceId, sourceUrl, userId);
        if (items && items.length > 0) {
          console.log(`✅ RSS Ingestion successful. Ingested ${items.length} articles.`);

          job.status = "completed";
          job.finishedAt = new Date();
          await job.save();
          return items;
        }
      } catch (rssError) {
        console.warn(`⚠️ RSS feed parsing failed: ${rssError.message}. Switching to sitemap...`);
      }

      // 2. Try Sitemap Ingestion
      try {
        console.log("👉 Attempting Sitemap Ingestion...");
        items = await this.fetchSitemap(sourceId, sourceUrl, userId);
        if (items && items.length > 0) {
          console.log(`✅ Sitemap Ingestion successful. Ingested ${items.length} articles.`);

          job.status = "completed";
          job.finishedAt = new Date();
          await job.save();
          return items;
        }
      } catch (sitemapError) {
        console.warn(
          `⚠️ Sitemap parsing failed: ${sitemapError.message}. Switching to HTML Fallback...`
        );
      }

      // 3. Fallback to HTML Scraping
      console.log("👉 Attempting HTML Fallback Scraper Ingestion...");
      items = await this.fetchHTMLFallback(sourceId, sourceUrl, userId);
      console.log(`✅ HTML Fallback successful. Ingested ${items.length} articles.`);

      job.status = "completed";
      job.finishedAt = new Date();
      await job.save();
      return items;
    } catch (error) {
      console.error(`❌ Ingestion failed for source ${sourceUrl}: ${error.message}`);

      // Log crawler failure inside jobs collection (per checklist item 5)
      job.status = "failed";
      job.error = error.message;
      job.finishedAt = new Date();
      await job.save();

      throw error;
    }
  }

  /**
   * Fetch and parse RSS feed.
   */
  async fetchRSS(sourceId, url, userId) {
    const feed = await rssParser.parseURL(url);
    const savedItems = [];

    for (const entry of feed.items) {
      const articleUrl = entry.link || entry.guid;
      if (!articleUrl) continue;

      // URL Normalization before duplicate checking (per checklist item 2)
      const normalizedUrl = normalizeUrl(articleUrl);
      const exists = await ContentItem.findOne({ externalId: normalizedUrl });
      if (exists) {
        console.log(`⏭️ Skipping duplicate RSS article: ${normalizedUrl}`);
        continue;
      }

      try {
        // Scrape article body for text and thumbnail
        const scraped = await this.scrapeArticlePage(articleUrl);

        const contentItem = new ContentItem({
          sourceId,
          userId,
          externalId: normalizedUrl,
          title: entry.title || scraped.title || "Untitled Article",
          description: entry.contentSnippet || entry.summary || scraped.description || "",
          url: scraped.url || normalizedUrl, // Use canonical URL if returned by scraper
          thumbnail: scraped.thumbnail || "",
          author: entry.creator || entry.author || scraped.author || "",
          publishedAt: entry.pubDate ? new Date(entry.pubDate) : scraped.publishedAt || new Date(),
          rawText: scraped.rawText,
          processedStatus: "pending"
        });

        await contentItem.save();
        savedItems.push(contentItem);
      } catch (err) {
        console.error(`⚠️ Failed to parse individual RSS item [${articleUrl}]: ${err.message}`);
      }
    }

    return savedItems;
  }

  /**
   * Fetch and parse Sitemap XML using fast-xml-parser (per checklist item 1).
   */
  async fetchSitemap(sourceId, url, userId, depth = 0) {
    let sitemapUrl = url;
    if (!sitemapUrl.endsWith(".xml") && depth === 0) {
      sitemapUrl = sitemapUrl.endsWith("/")
        ? `${sitemapUrl}sitemap.xml`
        : `${sitemapUrl}/sitemap.xml`;
    }

    const response = await httpClient.get(sitemapUrl);
    const xml = response.data;

    // Parse using fast-xml-parser
    const xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });

    const jsonObj = xmlParser.parse(xml);
    const locs = [];

    const extractLocs = (container) => {
      if (!container) return;
      const items = Array.isArray(container) ? container : [container];
      for (const item of items) {
        if (item && item.loc) {
          locs.push(item.loc.trim());
        }
      }
    };

    if (jsonObj.urlset && jsonObj.urlset.url) {
      extractLocs(jsonObj.urlset.url);
    } else if (jsonObj.sitemapindex && jsonObj.sitemapindex.sitemap) {
      extractLocs(jsonObj.sitemapindex.sitemap);
    } else {
      throw new Error("No URL mappings found in XML sitemap");
    }

    const savedItems = [];

    for (const targetUrl of locs) {
      // If sitemap index points to another sitemap, recursively fetch it once
      if (targetUrl.endsWith(".xml") && depth < 1) {
        try {
          const subItems = await this.fetchSitemap(sourceId, targetUrl, userId, depth + 1);
          savedItems.push(...subItems);
        } catch {
          // ignore failures in child sitemaps
        }
        continue;
      }

      // Ignore common non-blog endpoints
      if (
        targetUrl.endsWith(".jpg") ||
        targetUrl.endsWith(".png") ||
        targetUrl.includes("/category/") ||
        targetUrl.includes("/tag/") ||
        targetUrl.includes("/page/")
      ) {
        continue;
      }

      // URL Normalization before duplicate check
      const normalizedUrl = normalizeUrl(targetUrl);
      const exists = await ContentItem.findOne({ externalId: normalizedUrl });
      if (exists) continue;

      try {
        const scraped = await this.scrapeArticlePage(targetUrl);
        const contentItem = new ContentItem({
          sourceId,
          userId,
          externalId: normalizedUrl,
          title: scraped.title,
          description: scraped.description,
          url: scraped.url || normalizedUrl,
          thumbnail: scraped.thumbnail,
          author: scraped.author,
          publishedAt: scraped.publishedAt,
          rawText: scraped.rawText,
          processedStatus: "pending"
        });

        await contentItem.save();
        savedItems.push(contentItem);

        if (savedItems.length >= 10) break;
      } catch (err) {
        console.error(`⚠️ Failed to parse individual Sitemap url [${targetUrl}]: ${err.message}`);
      }
    }

    return savedItems;
  }

  /**
   * HTML Fallback scraper.
   */
  async fetchHTMLFallback(sourceId, url, userId) {
    const response = await httpClient.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const links = [];

    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, url).href;
        if (
          absoluteUrl.startsWith(url) &&
          absoluteUrl !== url &&
          (absoluteUrl.includes("/blog/") ||
            absoluteUrl.includes("/news/") ||
            absoluteUrl.includes("/article/") ||
            absoluteUrl.includes("/p/"))
        ) {
          if (!links.includes(absoluteUrl)) {
            links.push(absoluteUrl);
          }
        }
      } catch {
        // continue
      }
    });

    if (links.length === 0) {
      links.push(url);
    }

    const savedItems = [];
    for (const targetUrl of links) {
      const normalizedUrl = normalizeUrl(targetUrl);
      const exists = await ContentItem.findOne({ externalId: normalizedUrl });
      if (exists) continue;

      try {
        const scraped = await this.scrapeArticlePage(targetUrl);
        const contentItem = new ContentItem({
          sourceId,
          userId,
          externalId: normalizedUrl,
          title: scraped.title,
          description: scraped.description,
          url: scraped.url || normalizedUrl,
          thumbnail: scraped.thumbnail,
          author: scraped.author,
          publishedAt: scraped.publishedAt,
          rawText: scraped.rawText,
          processedStatus: "pending"
        });

        await contentItem.save();
        savedItems.push(contentItem);

        if (savedItems.length >= 5) break;
      } catch (err) {
        console.error(`⚠️ Failed to parse HTML fallback item [${targetUrl}]: ${err.message}`);
      }
    }

    return savedItems;
  }

  /**
   * Scrape metadata/text body from a single blog/article page with improved metadata support.
   * @param {string} url - Target article URL
   * @returns {Promise<object>} Extracted article fields
   */
  async scrapeArticlePage(url) {
    const response = await httpClient.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // 1. Improved Metadata Extraction (per checklist item 4)
    // Title mapping
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      "Untitled Article";

    // Description mapping
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    // og:image / thumbnail mapping
    const thumbnail =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('link[rel="image_src"]').attr("href") ||
      $('meta[itemprop="image"]').attr("content") ||
      $("article img, main img").first().attr("src") ||
      "";

    // Canonical URL mapping
    const canonicalUrl =
      $('link[rel="canonical"]').attr("href") ||
      $('meta[property="og:url"]').attr("content") ||
      url;

    // Author mapping
    const author =
      $('meta[name="author"]').attr("content") ||
      $('meta[property="og:article:author"]').attr("content") ||
      $('meta[name="twitter:creator"]').attr("content") ||
      $("[itemprop='author']").text().trim() ||
      $(".author, .byline, .entry-author").first().text().trim() ||
      "";

    // Publish date mapping
    const publishedDateRaw =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="publish-date"]').attr("content") ||
      $('meta[itemprop="datePublished"]').attr("content") ||
      $("time").attr("datetime") ||
      $(".post-date, .date, .published").first().text().trim() ||
      "";

    let publishedAt = new Date();
    if (publishedDateRaw) {
      const parsedDate = new Date(publishedDateRaw);
      if (!isNaN(parsedDate.getTime())) {
        publishedAt = parsedDate;
      }
    }

    // 2. Extract article raw text content (clean scripts, styling, navigation element bodies)
    $("script, style, head, nav, footer, header, iframe, noscript").remove();

    let articleText = "";
    const articleContainer = $("article, main, [role='main'], .post-content, .entry-content");

    if (articleContainer.length > 0) {
      articleText = articleContainer.text();
    } else {
      const paragraphs = [];
      $("p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 30) {
          paragraphs.push(text);
        }
      });
      articleText = paragraphs.join("\n\n");
    }

    const cleanedText = articleText.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

    return {
      title,
      description,
      thumbnail,
      url: normalizeUrl(canonicalUrl),
      author,
      publishedAt,
      rawText: cleanedText || description
    };
  }
}

export default new CrawlerService();
