import type {SSRServiceResource} from "./types";

interface PageHeaderProps {
  tagNumber?: string | null;
  languageData: SSRServiceResource;
}

export function PageHeader({tagNumber, languageData}: PageHeaderProps) {
  // Helper to replace {0} with tagNumber
  const subtitle = (languageData["TagDetails.Subtitle"] || "View and manage details for tag {0}").replace(
    "{0}",
    `#${tagNumber ?? "—"}`,
  );
  return (
    <div className="mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{languageData["TagDetails.Title"] || "Tag Details"}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
