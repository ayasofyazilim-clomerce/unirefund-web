"use client";

import type {
  PagedResultDto_ContractHeaderDetailForMerchantDto,
  PagedResultDto_ContractHeaderDetailForRefundPointDto,
} from "@ayasofyazilim/saas/ContractService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./_components/table-data";
import type { ContractPartyName } from "./_components/types";

export default function Contracts(props: {
  languageData: CRMServiceServiceResource & ContractServiceResource;
  contractsData:
    | PagedResultDto_ContractHeaderDetailForMerchantDto
    | PagedResultDto_ContractHeaderDetailForRefundPointDto;
  partyId: string;
  partyName: ContractPartyName;
  lang: string;
}) {
  const router = useRouter();
  const columns = tableData.columns({ ...props });
  const table = tableData.table({ ...props, router });

  return (
    <SectionLayoutContent sectionId="contracts">
      <TanstackTable
        columns={columns}
        data={props.contractsData.items || []}
        {...table}
      />
    </SectionLayoutContent>
  );
}
