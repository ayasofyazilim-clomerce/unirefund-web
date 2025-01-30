"use client";
import type { UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useRouter } from "next/navigation";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { tableData } from "./table-data";

function RefundTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto[];
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const columns = tableData.refundTableHeaders.columns(locale, {
    name: languageData.Name,
    creationTime: languageData.CreationTime,
    lastModificationTime: languageData.LastModificationTime,
    isDefault: languageData.IsDefault,
    isDeleted: languageData.IsDeleted,
    isActive: languageData.IsActive,
  });
  const table = tableData.refundTableHeaders.table({ languageData, router });
  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response}
      rowCount={response.length}
    />
  );
}

export default RefundTable;
