"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { dateToString, getStatusColor } from "../utils";

interface SummaryListType {
  title: string;
  rows: {
    title: string;
    content: string;
    contentClassName?: string;
  }[];
}

function SummaryList({ summaryList }: { summaryList: SummaryListType }) {
  return (
    <div className="mt-2 flex w-1/3 flex-col">
      <div className="mb-3 text-xl font-medium">{summaryList.title}</div>
      {summaryList.rows.map((row) => (
        <div className="flex flex-row gap-2" key={row.title}>
          <div className="text-gray-500">{row.title}:</div>
          <div className={cn("font-semibold", row.contentClassName)}>
            {row.content}
          </div>
        </div>
      ))}
    </div>
  );
}

function TagStatuses({
  tagDetail,
  languageData,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
}) {
  const exportValidation = tagDetail.exportValidation;
  const billing = tagDetail.billing;
  const refund = tagDetail.refund;
  const exportValidationList: SummaryListType = {
    title: languageData.ExportValidation,
    rows: [
      {
        title: languageData.Status,
        content: exportValidation?.status || "",
        contentClassName: getStatusColor(exportValidation?.status || ""),
      },
      {
        title: languageData.Date,
        content: dateToString(exportValidation?.date || "", "tr"),
      },
      {
        title: languageData.Stamp,
        content: exportValidation?.stampType || "",
      },
    ],
  };
  const billingList: SummaryListType = {
    title: languageData.Billing,
    rows: [
      {
        title: languageData.Status,
        content: billing?.status?.toString() || "",
        contentClassName: getStatusColor(billing?.status?.toString() || ""),
      },
      {
        title: languageData.Date,
        content: dateToString(billing?.billingDate || "", "tr"),
      },
      {
        title: languageData.BillingNo,
        content: billing?.billingNumber || "",
      },
    ],
  };
  const refundList: SummaryListType = {
    title: languageData.Refund,
    rows: [
      {
        title: languageData.Status,
        content: refund?.status?.toString() || "",
        contentClassName: getStatusColor(refund?.status?.toString() || ""),
      },
      {
        title: languageData.Date,
        content: dateToString(refund?.paidDate || "", "tr"),
      },
      {
        title: languageData.RefundMethod,
        content: refund?.refundMethod || "",
      },
      {
        title: languageData.Location,
        content: refund?.refundLocation || "",
      },
    ],
  };
  return (
    <Card className="flex-1 rounded-none">
      <CardHeader className="py-4">
        <div className="flex flex-row gap-4">
          <SummaryList summaryList={exportValidationList} />
          <SummaryList summaryList={billingList} />
          <SummaryList summaryList={refundList} />
        </div>
      </CardHeader>
    </Card>
  );
}

export default TagStatuses;
