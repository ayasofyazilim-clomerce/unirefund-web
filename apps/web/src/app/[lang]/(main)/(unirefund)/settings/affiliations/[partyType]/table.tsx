"use client";
import type {
  PagedResultDto_AffiliationCodeDto,
  UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { AffiliationsPostDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./affiliations-table-data";

export interface AutoFormValues {
  email: UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;
  affilation: AffiliationsPostDto;
}

function AffiliationsTable({
  locale,
  languageData,
  response,
}: {
  languageData: CRMServiceServiceResource;
  locale: string;
  response: PagedResultDto_AffiliationCodeDto;
}) {
  const columns = tableData.affiliations.columns(languageData, locale);
  const table = tableData.affiliations.table();

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}

export default AffiliationsTable;
