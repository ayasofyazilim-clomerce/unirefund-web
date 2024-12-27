"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { UniRefund_CRMService_Merchants_RefundPointProfileDto } from "@ayasofyazilim/saas/CRMService";
import type {
  PagedResultDto_TagListItemDto,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@ayasofyazilim/saas/TagService";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import SummarySection from "../_components/summary-section";
import { RefundForm } from "../_components/table/form";
import ExportValidatedTable from "../_components/table/table";
import TravellerDocumentForm from "../_components/traveller-document-form";
import { getTotals } from "./utils";

export default function ClientPage({
  locale,
  response,
  languageData,
  accessibleRefundPoints = [],
}: {
  locale: string;
  response: PagedResultDto_TagListItemDto;
  languageData: TagServiceResource;
  accessibleRefundPoints: UniRefund_CRMService_Merchants_RefundPointProfileDto[];
}) {
  const { refundType } = useParams<{
    refundType: "export-validated" | "need-validation";
  }>();
  const [selectedRows, setSelectedRows] = useState<
    UniRefund_TagService_Tags_TagListItemDto[]
  >([]);
  const searchParams = useSearchParams();
  const refundPointId = searchParams.get("refundPointId") || "";
  const tabHref = `?${searchParams.toString()}`;

  const totalDataOfSelectedTags = {
    refund: getTotals("Refund", selectedRows),
    refundFee: getTotals("RefundFee", selectedRows),
    salesAmount: getTotals("SalesAmount", selectedRows),
    vatAmount: getTotals("VatAmount", selectedRows),
    grossRefund: getTotals("GrossRefund", selectedRows),
  };
  const tabList = [
    {
      label: languageData.ExportValidated,
      href: `export-validated${tabHref}`,
      value: "export-validated",
    },
    {
      label: languageData.NeedValidation,
      href: `need-validation${tabHref}`,
      value: "need-validation",
    },
  ];

  return (
    <div className="space-y-4">
      <TravellerDocumentForm
        accessibleRefundPoints={accessibleRefundPoints}
        languageData={languageData}
      />

      <Tabs defaultValue={refundType}>
        <TabsList className="grid w-full grid-cols-2">
          {tabList.map((tab) => (
            <TabsTrigger asChild key={tab.label} value={tab.value}>
              <Link href={tab.href}>{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent key={refundType} value={refundType}>
          <SummarySection
            languageData={languageData}
            totalDataOfSelectedTags={totalDataOfSelectedTags}
          />
          <div className="grid grid-cols-10 gap-5">
            <div className="col-span-6">
              <ExportValidatedTable
                languageData={languageData}
                locale={locale}
                response={response}
                setSelectedRows={setSelectedRows}
              />
            </div>

            <div
              className={cn(
                "col-span-4 h-full overflow-hidden",
                selectedRows.length ? "" : "pointer-events-none opacity-30",
              )}
            >
              <RefundForm
                refundPointId={refundPointId}
                selectedRows={selectedRows}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
