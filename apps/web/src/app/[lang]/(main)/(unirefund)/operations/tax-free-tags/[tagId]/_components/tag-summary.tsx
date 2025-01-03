"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import { FileIcon } from "lucide-react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { dateToString, getStatusColor } from "../utils";

function TagSummary({
  tagDetail,
  languageData,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
}) {
  return (
    <Card className="flex-1 rounded-none">
      <CardHeader className="py-4">
        <CardTitle className="mb-4 flex items-center gap-2 text-2xl">
          <FileIcon />
          {languageData.TagSummary}
        </CardTitle>

        <div className="justif y-between flex flex-row gap-5">
          <div className="mt-2 flex w-1/3 flex-col">
            <div className="text-sm text-gray-500 ">
              {languageData.TaxFreeTagID}
            </div>
            <div className="font-semibold">{tagDetail.tagNumber}</div>
          </div>
          <div className="mt-2 flex w-1/3 flex-col">
            <div className="text-sm text-gray-500 ">{languageData.Status}</div>
            <div
              className={`${getStatusColor(tagDetail.status)} font-semibold`}
            >
              {tagDetail.status}
            </div>
          </div>
          <div className="mt-2 flex w-1/3 flex-col">
            <div className="text-sm text-gray-500 ">
              {languageData.IssueDate}
            </div>
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
  );
}

export default TagSummary;
