"use client";
import {type PagedResultDto_AffiliationCodeDto} from "@ayasofyazilim/saas/CRMService";
import type {GetApiIdentityRolesAssignableRolesByCurrentUserResponse} from "@ayasofyazilim/saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {PartyNameType} from "@repo/actions/unirefund/CrmService/types";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./affiliations-table-data";

function AffiliationsTable({
  languageData,
  response,
  assignableRoles,
}: {
  languageData: CRMServiceServiceResource;
  response: PagedResultDto_AffiliationCodeDto;
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse;
}) {
  const router = useRouter();
  const {lang, partyType} = useParams<{
    lang: string;
    partyType: Exclude<PartyNameType, "individuals">;
  }>();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.affiliations.columns(lang, languageData, grantedPolicies, partyType);
  const table = tableData.affiliations.table(languageData, assignableRoles, grantedPolicies, router, partyType);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default AffiliationsTable;
