"use client";

import {Calendar, CornerUpLeft, DollarSign, FileText, Store, Tag, User} from "lucide-react";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";
import {StatusBadge} from "./status-badge";
import {formatCurrency, formatDate, getAmountByType, type AmountInfo, type TagRowData, type TagItem} from "./types";

// Desktop table component
export function TagsDesktopTable({
  displayItems,
  languageData,
  onTagClick,
}: {
  displayItems: TagItem[];
  languageData: SSRServiceResource;
  onTagClick: (tagId: string) => void;
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-gray-200 lg:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader languageData={languageData} />
          <tbody className="divide-y divide-gray-200 bg-white">
            {displayItems.map((tag) => (
              <TagTableRow key={tag.id} languageData={languageData} onTagClick={onTagClick} tag={tag} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Table header component
function TableHeader({languageData}: {languageData: SSRServiceResource}) {
  const headers = [
    {icon: Tag, label: languageData["Home.TagDetails"]},
    {icon: User, label: languageData["Home.TravellerName"]},
    {icon: Store, label: languageData["Home.MerchantName"]},
    {icon: DollarSign, label: languageData["Home.SalesAmount"]},
    {icon: FileText, label: languageData["Home.VATAmount"]},
    {icon: CornerUpLeft, label: languageData["Home.GrossRefund"]},
    {icon: Calendar, label: languageData["Home.TagStatus"]},
  ];

  return (
    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
      <tr>
        {headers.map(({icon: Icon, label}) => (
          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" key={label}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-500" />
              <span>{label}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

// Tag table row component
function TagTableRow({
  tag,
  onTagClick,
  languageData,
}: {
  tag: TagItem;
  onTagClick: (tagId: string) => void;
  languageData: SSRServiceResource;
}) {
  const tagRowData: TagRowData = {
    salesAmount: getAmountByType(tag.totals, "SalesAmount"),
    vatAmount: getAmountByType(tag.totals, "VatAmount"),
    grossRefund: getAmountByType(tag.totals, "GrossRefund"),
  };

  return (
    <tr
      className="group cursor-pointer transition-all duration-200 hover:bg-red-200/10 hover:shadow-md"
      onClick={() => {
        if (tag.id) {
          onTagClick(tag.id);
        }
      }}>
      <td className="px-6 py-5">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-700">
              {tag.tagNumber}
            </div>
            <div className="text-xs text-gray-500">{tag.issueDate ? formatDate(tag.issueDate) : "-"}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{tag.travellerFullName || languageData["N/A"]}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{tag.merchantTitle}</div>
          </div>
        </div>
      </td>
      <AmountCell amount={tagRowData.salesAmount} languageData={languageData} />
      <AmountCell amount={tagRowData.vatAmount} colorClass="text-orange-600" languageData={languageData} />
      <AmountCell amount={tagRowData.grossRefund} colorClass="text-emerald-600" languageData={languageData} />
      <td className="px-6 py-5">
        <StatusBadge status={tag.status} />
      </td>
    </tr>
  );
}

// Amount cell component
function AmountCell({
  amount,
  colorClass = "text-gray-900",
  languageData,
}: {
  amount: AmountInfo | null;
  colorClass?: string;
  languageData: SSRServiceResource;
}) {
  return (
    <td className="px-6 py-5">
      {amount ? (
        <div className={`text-sm font-semibold ${colorClass}`}>{formatCurrency(amount.amount, amount.currency)}</div>
      ) : (
        <div className="text-sm text-gray-400">{languageData["N/A"]}</div>
      )}
    </td>
  );
}
