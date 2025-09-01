"use client";

import type {PagedResultDto_ContractHeaderDetailForMerchantDto} from "@ayasofyazilim/saas/ContractService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./_components/table-data";

export default function ContractsTable(props: {
  languageData: CRMServiceServiceResource & ContractServiceResource;
  contractsData: PagedResultDto_ContractHeaderDetailForMerchantDto;
  partyId: string;
  lang: string;
}) {
  const router = useRouter();
  const columns = tableData.columns({...props});
  const {grantedPolicies} = useGrantedPolicies();
  const table = tableData.table({...props, router, grantedPolicies});

  return <TanstackTable columns={columns} data={props.contractsData.items || []} {...table} />;
}
