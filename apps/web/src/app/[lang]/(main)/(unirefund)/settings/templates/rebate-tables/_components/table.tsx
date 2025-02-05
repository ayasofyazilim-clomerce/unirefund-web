"use client";
import type {PagedResultDto_RebateTableHeaderListDto} from "@ayasofyazilim/saas/ContractService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import {tableData} from "./table-data";

export default function RebateTable({
  languageData,
  rebateTableHeaders,
  lang,
}: {
  languageData: ContractServiceResource;
  rebateTableHeaders: PagedResultDto_RebateTableHeaderListDto;
  lang: string;
}) {
  const router = useRouter();
  const columns = tableData.rebateTableHeaders.columns(lang, languageData);
  const table = tableData.rebateTableHeaders.table({languageData, router});

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={rebateTableHeaders.items || []}
      rowCount={rebateTableHeaders.totalCount}
    />
  );
}
