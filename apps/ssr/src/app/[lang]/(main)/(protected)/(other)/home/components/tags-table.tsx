"use client";

import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {Card} from "@repo/ayasofyazilim-ui/atoms/card";
import {ChevronRight, Tag} from "lucide-react";
import Link from "next/link";
import {toast} from "@/components/ui/sonner";
import {getBaseLink} from "@/utils";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";
import {TagsDesktopTable} from "./tags-table/desktop-table";
import {TagsMobileCards} from "./tags-table/mobile-cards";
import {DISPLAY_LIMIT, type TagsTableProps} from "./tags-table/types";

// Error component
function TagsError({message, languageData}: {message: string; languageData: SSRServiceResource}) {
  return (
    <Card className="border border-red-200 bg-red-50">
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Tag className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-red-900">
            {languageData["Home.Tags"]} {languageData.Error}
          </h3>
          <p className="text-red-700">
            {languageData["Home.ErrorLoadingTags"]}: {message}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Empty state component
function TagsEmptyState({languageData}: {languageData: SSRServiceResource}) {
  return (
    <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 to-gray-300">
            <Tag className="h-10 w-10 text-gray-500" />
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900">{languageData["Home.NoTags"]}</h3>
          <p className="mb-6 text-gray-600">{languageData["Home.NoTagsDesc"]}</p>
          <Button className="bg-red-600 hover:bg-red-700">
            <Tag className="mr-2 h-4 w-4" />
            {languageData["Home.CreateFirstTag"]}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Header component
function TagsHeader({
  languageData,
  totalCount,
  showAll,
}: {
  languageData: SSRServiceResource;
  totalCount: number;
  showAll: boolean;
}) {
  return (
    <div className="mb-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center md:mb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
          <Tag className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{languageData["Home.Tags"]}</h2>
          <p className="text-sm text-gray-600">
            {totalCount} {languageData["Home.TagsDesc"]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!showAll && (
          <Link href={getBaseLink("tags")}>
            <Button className="bg-red-600 hover:bg-red-700">
              {languageData["Home.ViewAllTags"]}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function TagsTable({languageData, tagsResponse, showAll = false}: TagsTableProps) {
  // Early returns for error and empty states
  if (tagsResponse.type === "api-error") {
    return <TagsError languageData={languageData} message={tagsResponse.message} />;
  }

  const tagsData = tagsResponse.data;
  const hasData = tagsData.items && tagsData.items.length > 0;

  if (!hasData) {
    return <TagsEmptyState languageData={languageData} />;
  }

  const displayItems = showAll ? tagsData.items : tagsData.items?.slice(0, DISPLAY_LIMIT);
  const totalCount = tagsData.totalCount || tagsData.items?.length || 0;

  const handleTagClick = (tagId: string) => {
    toast.info(`${tagId} clicked`);
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-lg">
      <div className="p-2 md:p-6">
        <TagsHeader languageData={languageData} showAll={showAll} totalCount={totalCount} />

        <TagsDesktopTable displayItems={displayItems || []} languageData={languageData} onTagClick={handleTagClick} />

        <TagsMobileCards displayItems={displayItems || []} languageData={languageData} onTagClick={handleTagClick} />
      </div>
    </Card>
  );
}
