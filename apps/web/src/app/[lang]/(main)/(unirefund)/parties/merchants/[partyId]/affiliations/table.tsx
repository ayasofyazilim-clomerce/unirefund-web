"use client";
import type {
  PagedResultDto_AffiliationTypeDetailDto,
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto,
  UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useRouter } from "next/navigation";
import type { AffiliationsPostDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./affiliations-table-data";

export interface AutoFormValues {
  email: UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;
  affiliation: AffiliationsPostDto;
}

function Affiliations({
  locale,
  languageData,
  partyId,
  response,
  affiliationCodes,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  locale: string;
  response: PagedResultDto_AffiliationTypeDetailDto;
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[];
}) {
  const router = useRouter();
  const columns = tableData.affiliations.columns(languageData, locale);
  const table = tableData.affiliations.table(
    languageData,
    router,
    partyId,
    affiliationCodes,
  );
  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}

export default Affiliations;
