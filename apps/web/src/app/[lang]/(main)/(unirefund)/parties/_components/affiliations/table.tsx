"use client";

import type {UniRefund_IdentityService_AssignableRoles_AssignableRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_AffiliationListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useSession} from "@repo/utils/auth";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {useTenant} from "@/providers/tenant";
import type {PartyTypeHasAffiliations} from "../party-header";
import {AffiliationDrawer} from "./drawer";
import {tableData} from "./table-data";

function AffiliationsTable({
  affiliations,
  languageData,
  roles,
  isRolesAvailable,
  partyType,
}: {
  affiliations: PagedResultDto_AffiliationListResponseDto;
  languageData: CRMServiceServiceResource;
  roles: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[];
  isRolesAvailable: boolean;
  partyType: PartyTypeHasAffiliations;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {session} = useSession();
  console.log(session);
  const {localization} = useTenant();
  const [open, setOpen] = useState(false);

  const columns = tableData.affiliations.columns(localization, languageData);
  const table = tableData.affiliations.table(
    partyType,
    languageData,
    router,
    grantedPolicies,
    roles,
    isRolesAvailable,
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
