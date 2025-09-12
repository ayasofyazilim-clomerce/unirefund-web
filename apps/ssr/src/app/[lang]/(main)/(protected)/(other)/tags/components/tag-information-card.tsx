import {Tag} from "lucide-react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {StatusBadge} from "./status-badge";

interface TagInformationCardProps {
  tagNumber?: string | null;
  issueDate?: string | null;
  status?: string | null;
  locale: string;
  languageData: SSRServiceResource;
}

function formatReadableDate(dateString?: string | null, lang = "en") {
  if (!dateString) return "—";
  try {
    const locale = /^tr\b/i.test(lang) ? "tr-TR" : "en-US";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}, ${date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return dateString;
  }
}

export function TagInformationCard({tagNumber, issueDate, status, locale, languageData}: TagInformationCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3 border-b pb-2">
        <Tag className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">{languageData["TagInformation.Title"]}</h3>
      </div>
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-medium text-gray-500">{languageData["TagInformation.TagNumber"]}</div>
              <div className="text-md font-semibold text-gray-800">{tagNumber ?? "—"}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-medium text-gray-500">{languageData["TagInformation.IssueDate"]}</div>
              <div className="text-md font-semibold text-gray-800">{formatReadableDate(issueDate, locale)}</div>
            </div>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
