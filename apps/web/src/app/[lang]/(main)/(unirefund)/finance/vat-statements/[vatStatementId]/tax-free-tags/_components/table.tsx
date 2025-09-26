"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto} from "@repo/saas/FinanceService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useTenant} from "@/providers/tenant";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import {tableData} from "./tax-free-tag-table-data";

function TaxFreeTagTable({
  languageData,
  taxFreeTagsData,
}: {
  taxFreeTagsData: UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto;
  languageData: FinanceServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();

  const {localization} = useTenant();

  const columns = tableData.TaxFreeTag.columns(localization, languageData, grantedPolicies);
  const table = tableData.TaxFreeTag.table();

  const hasData = taxFreeTagsData.vatStatementTagDetails && taxFreeTagsData.vatStatementTagDetails.length > 0;
  const tagsCount = taxFreeTagsData.vatStatementTagDetails?.length || 0;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b pb-2">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold">{languageData["VatStatement.TaxFreeTags"] || "Tax-Free Tags"}</h2>
          {hasData ? (
            <span className="rounded bg-gray-100 px-2 py-1 text-sm font-medium">
              {tagsCount} {languageData["VatStatement.TagCount"] || "tags"}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        {hasData ? (
          <div className="">
            <TanstackTable
              {...table}
              columns={columns}
              data={taxFreeTagsData.vatStatementTagDetails || []}
              rowCount={tagsCount}
            />
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">No tags found</div>
        )}
      </CardContent>
    </Card>
  );
}

export default TaxFreeTagTable;
