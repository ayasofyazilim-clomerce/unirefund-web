"use client";
import type { PagedResultDto_RebateTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useRouter } from "next/navigation";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { tableData } from "./table-data";

export default function RebateTable({
  languageData,
  templates,
  lang,
}: {
  languageData: ContractServiceResource;
  templates: PagedResultDto_RebateTableHeaderDto;
  lang: string;
}) {
  const router = useRouter();
  const columns = tableData.rebateTableHeaders.columns(lang, languageData);
  const table = tableData.rebateTableHeaders.table({ languageData, router });

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={templates.items || []}
      rowCount={templates.totalCount}
    />
  );
}
