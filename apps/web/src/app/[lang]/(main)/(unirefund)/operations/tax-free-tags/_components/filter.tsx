"use client";

import {
  $UniRefund_ContractService_Enums_RefundMethod,
  $UniRefund_TagService_Tags_TagStatusType,
} from "@repo/saas/TagService";
import type {FilterComponentSearchItem} from "@repo/ayasofyazilim-ui/molecules/filter-component";
import FilterComponent from "@repo/ayasofyazilim-ui/molecules/filter-component";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {searchMerchants} from "@repo/actions/unirefund/CrmService/search";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {getDateRanges} from "src/utils/utils-date";

export default function Filter({
  languageData,
  className,
  defaultOpen,
  isCollapsible,
}: {
  languageData: TagServiceResource;
  className?: string;
  defaultOpen?: boolean;
  isCollapsible?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [statuses, setStatuses] = useState<string[]>(searchParams.get("statuses")?.split(",") || []);
  const merchantIdsParsed = JSON.parse(searchParams.get("merchantIds") || "[]") as FilterComponentSearchItem[];
  const [merchantIds, setMerchantIds] = useState<FilterComponentSearchItem[]>(
    merchantIdsParsed.map((i) => ({id: i.id, name: i.name})),
  );
  const [refundTypes, setRefundTypes] = useState<string[]>(searchParams.get("refundTypes")?.split(",") || []);
  const [issuedDate, setIssuedDate] = useState<string>(searchParams.get("issuedDate") || "");
  const [exportDate, setExportDate] = useState<string>(searchParams.get("exportDate") || "");
  const [paidDate, setPaidDate] = useState<string>(searchParams.get("paidDate") || "");

  const {rangeItems} = getDateRanges();

  function onSubmit() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("statuses", statuses.join(",") || "");
    params.set("merchantIds", merchantIds.length > 0 ? JSON.stringify(merchantIds) : "");
    params.set("refundTypes", refundTypes.join(",") || "");
    params.set("refundTypes", refundTypes.join(",") || "");
    params.set("issuedDate", issuedDate);
    params.set("exportDate", exportDate);
    params.set("paidDate", paidDate);

    const newParams = new URLSearchParams();
    params.forEach((value, key) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  }

  const filterData = {
    dateSelect: [
      {
        id: "issued_date",
        title: languageData.IssueDate,
        placeholder: languageData["IssueDate.Placeholder"],
        onChange: setIssuedDate,
        value: issuedDate,
        options: rangeItems.map((item) => ({
          label: languageData[`Range.${item}` as keyof TagServiceResource],
          value: item,
        })),
      },
      {
        id: "export_date",
        title: languageData.ExportDate,
        placeholder: languageData["ExportDate.Placeholder"],
        onChange: setExportDate,
        value: exportDate,
        options: rangeItems.map((item) => ({
          label: languageData[`Range.${item}` as keyof TagServiceResource],
          value: item,
        })),
      },
      {
        id: "paid_date",
        title: languageData.PaidDate,
        placeholder: languageData["PaidDate.Placeholder"],
        onChange: setPaidDate,
        value: paidDate,
        options: rangeItems.map((item) => ({
          label: languageData[`Range.${item}` as keyof TagServiceResource],
          value: item,
        })),
      },
    ],
    multiSelect: [
      {
        id: "statuses",
        title: languageData.Status,
        value: statuses,
        placeholder: languageData["TagStatus.Placeholder"],
        options: $UniRefund_TagService_Tags_TagStatusType.enum.map((status) => ({
          value: status,
          label: languageData[`TagStatus.${status}` as keyof TagServiceResource],
        })),
        onChange: setStatuses,
      },
      {
        id: "refund_types",
        title: languageData.RefundMethod,
        value: refundTypes,
        placeholder: languageData["RefundMethod.Placeholder"],
        options: $UniRefund_ContractService_Enums_RefundMethod.enum.map((status) => ({
          value: status,
          label: languageData[`RefundMethod.${status}` as keyof TagServiceResource],
        })),
        onChange: setRefundTypes,
      },
    ],
    asyncSelect: [
      {
        id: "merchants",
        title: languageData.MerchantTitle,
        fetchAction: searchMerchants,
        onChange: setMerchantIds,
        value: merchantIds,
      },
    ],
  };

  return (
    <FilterComponent
      applyFilterText={languageData.Apply}
      asyncSelect={filterData.asyncSelect}
      cardClassName="mx-none w-full"
      className={className}
      dateSelect={filterData.dateSelect}
      defaultOpen={defaultOpen}
      filtersText={languageData.Filters}
      isCollapsible={isCollapsible}
      multiSelect={filterData.multiSelect}
      onSubmit={onSubmit}
    />
  );
}
