"use client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import type {UniRefund_TagService_Tags_TagDetailDto} from "@ayasofyazilim/saas/TagService";
import {FileIcon} from "lucide-react";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {getStatusColor, dateToString} from "../../../_components/utils";

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

        <div>
          <div className="mt-2 flex flex-row">
            <div className="w-1/3 text-sm text-gray-500">{languageData.TaxFreeTagID}</div>
            <div className="w-2/3 font-semibold">{tagDetail.tagNumber}</div>
          </div>
          <div className="flex flex-row text-gray-500">
            <div className="w-1/3 text-sm text-gray-500">{languageData.Status}</div>
            <div className={`${getStatusColor(tagDetail.status)} w-2/3 font-semibold`}>
              {languageData[`TagStatus.${tagDetail.status}` as keyof TagServiceResource] || tagDetail.status}
            </div>
          </div>
          <div className="flex flex-row text-gray-500">
            <div className="w-1/3 text-sm text-gray-500">{languageData.IssueDate}</div>
            <div className="w-2/3">
              <div className="font-semibold">{dateToString(tagDetail.issueDate || "", "tr")}</div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default TagSummary;
