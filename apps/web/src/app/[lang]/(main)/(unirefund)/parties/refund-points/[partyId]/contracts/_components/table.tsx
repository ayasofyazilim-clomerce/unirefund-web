"use client";

import type {PagedResultDto_ContractHeaderDetailForRefundPointDto} from "@ayasofyazilim/saas/ContractService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";

export default function Contracts(props: {
  languageData: CRMServiceServiceResource & ContractServiceResource;
  contractsData: PagedResultDto_ContractHeaderDetailForRefundPointDto;
  partyId: string;
  lang: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const columns = tableData.columns({...props});
  const table = tableData.table({...props, router, grantedPolicies});

  return <TanstackTable columns={columns} data={props.contractsData.items || []} {...table} />;
}
