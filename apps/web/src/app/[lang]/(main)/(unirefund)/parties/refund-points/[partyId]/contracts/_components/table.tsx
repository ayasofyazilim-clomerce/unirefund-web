"use client";

import type {PagedResultDto_ContractHeaderDetailForRefundPointDto} from "@repo/saas/ContractService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./table-data";

export default function Contracts(props: {
  languageData: CRMServiceServiceResource & ContractServiceResource;
  contractsData: PagedResultDto_ContractHeaderDetailForRefundPointDto;
  partyId: string;
  lang: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {localization} = useTenant();
  const columns = tableData.columns({...props, localization});
  const table = tableData.table({...props, router, grantedPolicies});

  return <TanstackTable columns={columns} data={props.contractsData.items || []} {...table} />;
}
