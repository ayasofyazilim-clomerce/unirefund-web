"use client";
import type {
  PagedResultDto_AffiliationTypeDetailDto,
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto,
  UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import type {
  AffiliationsPostDto,
  PartyNameType,
} from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./individuals-table-data";

export interface AutoFormValues {
  email: UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;
  affilation: AffiliationsPostDto;
}

function Individual({
  locale,
  languageData,
  partyName,
  partyId,
  response,
  affiliationCodes,
}: {
  languageData: CRMServiceServiceResource;
  partyName: Exclude<PartyNameType, "individuals">;
  partyId: string;
  locale: string;
  response: PagedResultDto_AffiliationTypeDetailDto;
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[];
}) {
  const router = useRouter();
  const columns = tableData.individuals.columns(languageData, locale);
  const table = tableData.individuals.table(
    languageData,
    router,
    partyName,
    partyId,
    affiliationCodes,
  );
  return (
    <SectionLayoutContent sectionId="individuals">
      <TanstackTable
        {...table}
        columns={columns}
        data={response.items || []}
        rowCount={response.totalCount}
      />
    </SectionLayoutContent>
  );
}

export default Individual;
