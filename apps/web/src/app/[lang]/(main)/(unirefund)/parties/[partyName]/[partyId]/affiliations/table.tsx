"use client";
import type {
  PagedResultDto_AffiliationCodeDto,
  UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import type { AffiliationsPostDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { PartyNameType } from "../../../types";
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
  partyName: Exclude<PartyNameType, "individuals">;
  partyId: string;
  locale: string;
  response: PagedResultDto_AffiliationCodeDto;
}) {
  const columns = tableData.affiliations.columns(languageData, locale);
  const table = tableData.affiliations.table();

  return (
    <SectionLayoutContent sectionId="affiliations">
      <TanstackTable
        {...table}
        columns={columns}
        data={response.items || []}
        rowCount={response.totalCount}
      />
    </SectionLayoutContent>
  );
}

export default AffiliationsTable;
