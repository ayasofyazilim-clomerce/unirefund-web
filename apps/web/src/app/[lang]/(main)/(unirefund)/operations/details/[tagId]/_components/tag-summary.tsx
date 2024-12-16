"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import { FileIcon } from "lucide-react";
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

function TagSummary({
  tagDetail,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
}) {
  const exportValidation = tagDetail.exportValidation;
  const billing = tagDetail.billing;
  const refund = tagDetail.refund;
  const exportValidationList: SummaryListType = {
    title: "Export validation",
    rows: [
      {
        title: "Status",
        content: exportValidation?.status || "",
        contentClassName: getStatusColor(exportValidation?.status || ""),
      },
      {
        title: "Date",
        content: dateToString(exportValidation?.date || "", "tr"),
      },
      {
        title: "Stamp",
        content: exportValidation?.stampType || "",
      },
    ],
  };
  const billingList: SummaryListType = {
    title: "Billing",
    rows: [
      {
        title: "Status",
        content: billing?.status?.toString() || "",
        contentClassName: getStatusColor(billing?.status?.toString() || ""),
      },
      {
        title: "Date",
        content: dateToString(billing?.billingDate || "", "tr"),
      },
      {
        title: "Billing No",
        content: billing?.billingNumber || "",
      },
    ],
  };
  const refundList: SummaryListType = {
    title: "Refund",
    rows: [
      {
        title: "Status",
        content: refund?.status?.toString() || "",
        contentClassName: getStatusColor(refund?.status?.toString() || ""),
      },
      {
        title: "Date",
        content: dateToString(refund?.paidDate || "", "tr"),
      },
      {
        title: "Refund Method",
        content: refund?.refundMethod || "",
      },
      {
        title: "Location",
        content: refund?.refundLocation || "",
      },
    ],
  };
  return (
    <>
      <Card className="flex-1 rounded-none">
        <CardHeader className="py-6">
          <CardTitle className="mb-4 flex items-center gap-2 text-2xl">
            <FileIcon />
            Tag Summary
          </CardTitle>

          <div className="justif y-between flex flex-row gap-5">
            <div className="mt-2 flex w-1/3 flex-col">
              <div className="text-sm text-gray-500 ">Tax Free Tag ID</div>
              <div className="font-semibold">{tagDetail.tagNumber}</div>
            </div>
            <div className="mt-2 flex w-1/3 flex-col">
              <div className="text-sm text-gray-500 ">Status</div>
              <div
                className={`${getStatusColor(tagDetail.status || "")} font-semibold`}
              >
                {tagDetail.status}
              </div>
            </div>
            <div className="mt-2 flex w-1/3 flex-col">
              <div className="text-sm text-gray-500 ">Issue Date</div>
              <div className="font-semibold">
                {dateToString(tagDetail.issueDate || "", "tr")}
              </div>
              <div className="font- text-sm text-gray-500">
                Exp: {dateToString(tagDetail.expireDate || "", "tr")}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex-1 rounded-none">
        <CardHeader className="py-6">
          <div className="flex flex-row gap-4">
            <SummaryList summaryList={exportValidationList} />
            <SummaryList summaryList={billingList} />
            <SummaryList summaryList={refundList} />
          </div>
        </CardHeader>
      </Card>
    </>
  );
}

export default TagSummary;
