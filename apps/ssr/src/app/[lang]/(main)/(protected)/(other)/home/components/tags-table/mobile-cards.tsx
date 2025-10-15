import {Card} from "@repo/ayasofyazilim-ui/atoms/card";
import {formatCurrency} from "@repo/ui/utils";
import {ChevronRight, Store, Tag, User} from "lucide-react";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";
import {StatusBadge} from "./status-badge";
import {formatDate, type TagItem, type TagRowData} from "./types";

// Mobile cards component
export function TagsMobileCards({
  displayItems,
  onTagClick,
  languageData,
}: {
  displayItems: TagItem[];
  onTagClick: (tagId: string) => void;
  languageData: SSRServiceResource;
}) {
  return (
    <div className="space-y-3 lg:hidden">
      {displayItems.map((tag) => (
        <TagMobileCard key={tag.id} languageData={languageData} onTagClick={onTagClick} tag={tag} />
      ))}
    </div>
  );
}

// Mobile card component
function TagMobileCard({
  tag,
  onTagClick,
  languageData,
}: {
  tag: TagItem;
  onTagClick: (tagId: string) => void;
  languageData: SSRServiceResource;
}) {
  const currency = tag.currency || "USD";

  const tagRowData: TagRowData = {
    salesAmount: {amount: tag.salesAmount || 0, currency},
    vatAmount: {amount: tag.vatAmount || 0, currency},
    grossRefund: {amount: tag.grossRefund || 0, currency},
  };

  return (
    <Card
      className="group w-full cursor-pointer border border-gray-200 p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-lg"
      onClick={() => {
        if (tag.id) {
          onTagClick(tag.id);
        }
      }}>
      {/* Header with Tag Number and Status */}
      <div className="mb-3 flex flex-col items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center space-x-2">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-sm font-bold text-white shadow-md transition-shadow group-hover:shadow-lg">
            <Tag className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-blue-700">
              {tag.tagNumber}
            </div>
            <div className="text-xs text-gray-500">{tag.issueDate ? formatDate(tag.issueDate) : "-"}</div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={tag.status} />
        </div>
      </div>

      {/* User and Merchant Info */}
      <TagInfoSections languageData={languageData} tag={tag} />

      {/* Amount Information Grid */}
      <FinancialDetails languageData={languageData} tagRowData={tagRowData} />

      {/* Click indicator */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center text-xs text-gray-500 transition-colors group-hover:text-blue-600">
          <span>{languageData["Home.TapToViewDetails"]}</span>
          <ChevronRight className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Card>
  );
}

// Tag info sections component
function TagInfoSections({tag, languageData}: {tag: TagItem; languageData: SSRServiceResource}) {
  return (
    <div className="mb-3 space-y-3">
      <div className="rounded-lg bg-gray-50 p-3">
        <div className="mb-2 flex items-center">
          <User className="mr-2 h-4 w-4 flex-shrink-0 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">{languageData["Home.Traveller"]}</span>
        </div>
        <div className="ml-6">
          <div className="truncate text-sm font-medium text-gray-900">
            {tag.travellerFullName || languageData["N/A"]}
          </div>
          {tag.travellerDocumentNumber ? (
            <div className="truncate text-xs text-gray-500">{tag.travellerDocumentNumber}</div>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-3">
        <div className="mb-2 flex items-center">
          <Store className="mr-2 h-4 w-4 flex-shrink-0 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">{languageData["Home.Merchant"]}</span>
        </div>
        <div className="ml-6">
          <div className="truncate text-sm font-medium text-gray-900">{tag.merchantTitle || languageData["N/A"]}</div>
        </div>
      </div>
    </div>
  );
}

// Financial details component
function FinancialDetails({tagRowData, languageData}: {tagRowData: TagRowData; languageData: SSRServiceResource}) {
  const financialItems = [
    {
      label: languageData["Home.SalesAmount"],
      amount: tagRowData.salesAmount,
      bgColor: "bg-blue-50",
      labelColor: "text-blue-600",
      valueColor: "text-blue-800",
    },
    {
      label: languageData["Home.VATAmount"],
      amount: tagRowData.vatAmount,
      bgColor: "bg-orange-50",
      labelColor: "text-orange-600",
      valueColor: "text-orange-800",
    },
    {
      label: languageData["Home.GrossRefund"],
      amount: tagRowData.grossRefund,
      bgColor: "bg-emerald-50",
      labelColor: "text-emerald-600",
      valueColor: "text-emerald-800",
    },
  ];

  return (
    <div className="border-t border-gray-200 pt-3">
      <div className="mb-2 text-xs font-semibold text-gray-700">{languageData["Home.FinancialDetails"]}</div>
      <div className="grid grid-cols-1 gap-2">
        {financialItems.map(({label, amount, bgColor, labelColor, valueColor}) => (
          <div className={`rounded-lg ${bgColor} p-2 text-center`} key={label}>
            <div className={`mb-1 text-xs font-medium ${labelColor}`}>{label}</div>
            {amount ? (
              <div className={`truncate text-sm font-bold ${valueColor}`}>
                {formatCurrency("tr-TR", amount.currency, amount.amount)}
              </div>
            ) : (
              <div className="text-sm font-bold text-gray-400">{languageData["N/A"]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
