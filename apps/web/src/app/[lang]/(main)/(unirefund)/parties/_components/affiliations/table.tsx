"use client";

import {PagedResultDto_AffiliationListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";
import {
  Volo_Abp_Identity_IdentityRoleDto,
  Volo_Abp_Identity_IdentityUserDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import {useState} from "react";
import {AffiliationDrawer} from "./drawer";
import {UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";

function AffiliationsTable({
  affiliations,
  languageData,
  individuals,
  isIndividualsAvailable,
  roles,
  isRolesAvailable,
  users,
  isUsersAvailable,
}: {
  affiliations: PagedResultDto_AffiliationListResponseDto;
  languageData: CRMServiceServiceResource;
  individuals: IndividualListResponseDto[];
  isIndividualsAvailable: boolean;

  roles: Volo_Abp_Identity_IdentityRoleDto[];
  isRolesAvailable: boolean;

  users: Volo_Abp_Identity_IdentityUserDto[];
  isUsersAvailable: boolean;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const [open, setOpen] = useState(false);

  const columns = tableData.affiliations.columns(lang, languageData, router, grantedPolicies);
  const table = tableData.affiliations.table(
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
        isIndividualsAvailable={isIndividualsAvailable}
        individuals={individuals}
        open={open}
        setOpen={setOpen}
        languageData={languageData}
        users={users}
        roles={roles}
      />
    </div>
  );
}

export default AffiliationsTable;
