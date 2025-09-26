"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_ContractHeaderDetailForMerchantDto} from "@repo/saas/ContractService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./_components/table-data";

export default function ContractsTable(props: {
  languageData: CRMServiceServiceResource & ContractServiceResource;
  contractsData: PagedResultDto_ContractHeaderDetailForMerchantDto;
  partyId: string;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const columns = tableData.columns({...props, localization});
  const {grantedPolicies} = useGrantedPolicies();
  const table = tableData.table({...props, router, grantedPolicies});

  return <TanstackTable columns={columns} data={props.contractsData.items || []} {...table} />;
}
