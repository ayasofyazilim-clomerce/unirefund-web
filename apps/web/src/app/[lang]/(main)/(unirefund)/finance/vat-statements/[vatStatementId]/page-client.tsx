"use client";
import type { UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto } from "@ayasofyazilim/saas/FinanceService";
import SelectTabs, {
  SelectTabsContent,
} from "@repo/ayasofyazilim-ui/molecules/select-tabs";
import { useState } from "react";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import TaxFreeTagTable from "./_components/tax-free-tag/table";

type TabSection = "Information" | "TaxFreeTags";

export default function PageClientSide({
  languageData,
  vatStatementHeadersData,
}: {
  languageData: FinanceServiceResource;
  vatStatementHeadersData: UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto;
}) {
  const [activeTab, setActiveTab] = useState<TabSection>("Information");

  return (
    <>
      <div className="mb-3">
        <SelectTabs
          onValueChange={(value) => {
            setActiveTab(value as TabSection);
          }}
          value={activeTab}
        >
          <SelectTabsContent value="Information">
            <div className="flex flex-row items-center gap-1">
              {languageData["VatStatements.Information"]}
            </div>
          </SelectTabsContent>
          <SelectTabsContent value="TaxFreeTags">
            <div className="flex flex-row items-center gap-1">
              {languageData["VatStatements.TaxFreeTags"]}
            </div>
          </SelectTabsContent>
        </SelectTabs>
      </div>
      {activeTab === "Information" ? (
        <>hello</>
      ) : (
        <TaxFreeTagTable
          languageData={languageData}
          taxFreeTagsData={vatStatementHeadersData}
        />
      )}
    </>
  );
}
