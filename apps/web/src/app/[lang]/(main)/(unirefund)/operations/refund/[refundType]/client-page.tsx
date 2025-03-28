"use client";

import {cn} from "@/lib/utils";
import type {UniRefund_CRMService_RefundPoints_RefundPointProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {
  PagedResultDto_TagListItemDto,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@ayasofyazilim/saas/TagService";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {useSearchParams} from "next/navigation";
import {useState} from "react";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {getBaseLink} from "@/utils";
import type {TotalDataOfSelectedTagsType} from "../_components/summary-section";
import SummarySection from "../_components/summary-section";
import {RefundForm} from "../_components/table/form";
import ExportValidatedTable from "../_components/table/table";
import TravellerDocumentForm from "../_components/traveller-document-form";
import {getTotals} from "./utils";

export default function ClientPage({
  locale,
  response,
  languageData,
  accessibleRefundPoints = [],
}: {
  locale: string;
  response: PagedResultDto_TagListItemDto;
  languageData: TagServiceResource;
  accessibleRefundPoints: UniRefund_CRMService_RefundPoints_RefundPointProfileDto[];
}) {
  const [selectedRows, setSelectedRows] = useState<UniRefund_TagService_Tags_TagListItemDto[]>([]);
  const searchParams = useSearchParams();
  const refundPointId = searchParams.get("refundPointId") || "";

  const totalDataOfSelectedTags: TotalDataOfSelectedTagsType = {
    refund: getTotals("Refund", selectedRows),
    refundFee: getTotals("RefundFee", selectedRows),
    salesAmount: getTotals("SalesAmount", selectedRows),
    vatAmount: getTotals("VatAmount", selectedRows),
    grossRefund: getTotals("GrossRefund", selectedRows),
  };
  const tabList = [
    {
      label: languageData.ExportValidated,
      href: getBaseLink(`operations/refund/export-validated?${searchParams.toString()}`, locale),
      value: "export-validated",
    },
    {
      label: languageData.NeedValidation,
      href: getBaseLink(`operations/refund/need-validation?${searchParams.toString()}`, locale),
      value: "need-validation",
    },
  ];

  return (
    <div className="mx-auto w-full">
      <TravellerDocumentForm accessibleRefundPoints={accessibleRefundPoints} languageData={languageData} />
      <div className=" mt-6 rounded-lg border border-gray-200 p-6 shadow-sm">
        <TabLayout
          classNames={{
            horizontal: {
              tabList: "grid w-full max-w-2xl grid-cols-2 mx-auto mb-4",
              tabTrigger: "h-full text-center",
              tabContent: "mx-auto w-full ",
            },
          }}
          orientation="horizontal"
          tabList={tabList}>
          <SummarySection languageData={languageData} totalDataOfSelectedTags={totalDataOfSelectedTags} />
          <div className="mt-2 grid grid-cols-10 gap-6">
            <div className="col-span-6 rounded-lg border border-gray-200 p-6 shadow-sm">
              <ExportValidatedTable
                languageData={languageData}
                locale={locale}
                response={response}
                setSelectedRows={setSelectedRows}
              />
            </div>

            <div
              className={cn(
                "col-span-4 h-full overflow-hidden rounded-lg border border-gray-200 p-7 shadow-sm",
                selectedRows.length ? "" : "pointer-events-none opacity-30",
              )}>
              <RefundForm refundPointId={refundPointId} selectedRows={selectedRows} />
            </div>
          </div>
        </TabLayout>
      </div>
    </div>
  );
}
