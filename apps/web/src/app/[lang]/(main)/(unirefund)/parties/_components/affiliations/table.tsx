"use client";

import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_AffiliationListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import {useState} from "react";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import type {PartyTypeHasAffiliations} from "../party-header";
import {AffiliationDrawer} from "./drawer";
import {tableData} from "./table-data";

function AffiliationsTable({
  affiliations,
  languageData,
  roles,
  isRolesAvailable,
  isUsersAvailable,
  partyType,
}: {
  affiliations: PagedResultDto_AffiliationListResponseDto;
  languageData: CRMServiceServiceResource;
  roles: Volo_Abp_Identity_IdentityRoleDto[];
  isRolesAvailable: boolean;
  isUsersAvailable: boolean;
  partyType: PartyTypeHasAffiliations;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const [open, setOpen] = useState(false);

  const columns = tableData.affiliations.columns(lang, languageData);
  const table = tableData.affiliations.table(
    partyType,
    languageData,
    router,
    grantedPolicies,
    roles,
    isRolesAvailable,
    isUsersAvailable,
    setOpen,
  );

  return (
    <div>
      <TanstackTable {...table} columns={columns} data={affiliations.items || []} rowCount={affiliations.totalCount} />
      <AffiliationDrawer
        languageData={languageData}
        open={open}
        partyType={partyType}
        roles={roles}
        setOpen={setOpen}
      />
    </div>
  );
}

export default AffiliationsTable;
