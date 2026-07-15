import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2 } from "lucide-react";

// Form validation schema using Zod
const sourceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  type: z.enum(["website", "youtube", "facebook"]),
  url: z.string().url("Please enter a valid URL (e.g., https://example.com/feed)"),
  category: z.string().min(2, "Category must be at least 2 characters long")
}).superRefine((data, ctx) => {
  if (data.type === "facebook" && !data.url.toLowerCase().includes("facebook.com")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter a valid Facebook Page URL (e.g. https://www.facebook.com/programmingHero)",
      path: ["url"]
    });
  }
});

/**
 * Reusable dialog modal for Adding or Editing content sources.
 */
export default function SourceDialog({
  isOpen,
  onClose,
  onSubmit,
  source = null,
  isLoading = false
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(sourceSchema),
    defaultValues: { name: "", type: "website", url: "", category: "" }
  });

  const selectedType = watch("type", "website");

  // Reset form values when source changes (e.g., when opening for editing vs adding)
  useEffect(() => {
    if (source) {
      reset({
        name: source.name,
        type: source.type,
        url: source.url,
        category: source.category
      });
    } else {
      reset({ name: "", type: "website", url: "", category: "" });
    }
  }, [source, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Card */}
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white font-heading">
            {source ? "Edit Content Source" : "Add Content Source"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
              Source Name
            </label>
            <input
              type="text"
              placeholder="e.g., Vercel Blog"
              disabled={isLoading}
              className={`w-full h-10 px-3 rounded-xl bg-zinc-950 border text-sm text-zinc-100 placeholder-zinc-800 focus:outline-none focus:border-indigo-500 transition-colors ${
                errors.name ? "border-rose-500" : "border-zinc-800"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-rose-500 text-[10px] mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Type Select */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
              Source Type
            </label>
            <select
              disabled={isLoading}
              className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
              {...register("type")}
            >
              <option value="website">Website / RSS Feed</option>
              <option value="youtube">YouTube Channel</option>
              <option value="facebook">Facebook Page</option>
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
              Target URL
            </label>
            <input
              type="text"
              placeholder={
                selectedType === "facebook"
                  ? "https://www.facebook.com/programmingHero"
                  : selectedType === "youtube"
                    ? "e.g., https://youtube.com/@programmingHero"
                    : "e.g., https://vercel.com/blog/feed"
              }
              disabled={isLoading}
              className={`w-full h-10 px-3 rounded-xl bg-zinc-950 border text-sm text-zinc-100 placeholder-zinc-800 focus:outline-none focus:border-indigo-500 transition-colors ${
                errors.url ? "border-rose-500" : "border-zinc-800"
              }`}
              {...register("url")}
            />
            {errors.url && <p className="text-rose-500 text-[10px] mt-1.5">{errors.url.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Technology"
              disabled={isLoading}
              className={`w-full h-10 px-3 rounded-xl bg-zinc-950 border text-sm text-zinc-100 placeholder-zinc-800 focus:outline-none focus:border-indigo-500 transition-colors ${
                errors.category ? "border-rose-500" : "border-zinc-800"
              }`}
              {...register("category")}
            />
            {errors.category && (
              <p className="text-rose-500 text-[10px] mt-1.5">{errors.category.message}</p>
            )}
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/10 transition-colors cursor-pointer"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {source ? "Save Changes" : "Add Source"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
