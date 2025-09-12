"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ayasofyazilim-ui/atoms/pagination";
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import type {TagListResponseDto_TagListItemDto} from "@repo/saas/TagService";
import type {ServerResponse} from "@repo/utils/api";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";
import TagsTable from "../home/components/tags-table";

interface TagsPageClientProps {
  languageData: SSRServiceResource;
  tagsResponse: ServerResponse<TagListResponseDto_TagListItemDto>;
}

export default function TagClient({languageData, tagsResponse}: TagsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage =
    Math.floor((Number(searchParams.get("skipCount")) || 0) / (Number(searchParams.get("maxResultCount")) || 10)) + 1;
  const pageSize = Number(searchParams.get("maxResultCount")) || 10;
  const totalCount = tagsResponse.type === "success" ? tagsResponse.data.totalCount || 0 : 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const updateSearchParams = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === 0) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  };

  const t = (key: string, def?: string) => {
    return (languageData as Record<string, string | undefined>)[key] ?? def ?? key;
  };

  const handlePageChange = (page: number) => {
    const skipCount = (page - 1) * pageSize;
    updateSearchParams({
      skipCount: skipCount === 0 ? undefined : skipCount,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    updateSearchParams({
      maxResultCount: newPageSize === 10 ? undefined : newPageSize,
      skipCount: 0,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-2 py-8">
      {/* Page Header */}
      <div className="relative mb-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="mb-4 text-4xl font-bold leading-tight lg:text-5xl">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              {languageData["Home.Tags"]}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">{languageData["Home.TagsDesc"]}</p>
        </div>
      </div>

      {/* Tags Table */}
      <div className="mb-8">
        <TagsTable languageData={languageData} showAll tagsResponse={tagsResponse} />
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 px-2 sm:flex-row">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{t("Table.PageSize", "Per page:")}</span>
            <select
              className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              onChange={(e) => {
                handlePageSizeChange(Number(e.target.value));
              }}
              value={pageSize}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Pagination Controls */}
          <Pagination className="mx-2 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                let pageNumber: number;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      className="cursor-pointer"
                      href="#"
                      isActive={currentPage === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Total Count */}
          <div className="text-sm text-gray-700">
            {replacePlaceholders(t("Table.TotalCount", "Total {0} records"), [
              {holder: "{0}", replacement: String(totalCount)},
            ])}
          </div>
        </div>
      )}
    </div>
  );
}
