import React from "react";
import DataTable from "@repo/ayasofyazilim-ui/molecules/tables";
import { Input } from "@/components/ui/input";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import { getResourceData } from "src/language-data/unirefund/ContractService";

const columns = [
  {
    header: "Refund method",
    accessorKey: "refundMethod",
  },
  {
    header: "Vat %",
    accessorKey: "vatPercent",
  },
  {
    header: "VAT",
    accessorKey: "vat",
  },
  {
    header: "GC",
    accessorKey: "gc",
  },
  {
    header: "Rebate",
    accessorKey: "rebate",
  },
  {
    header: "NC",
    accessorKey: "nc",
  },
  {
    header: "Rebate % of GC",
    accessorKey: "rebatePercentOfGc",
  },
];

const data = [
  {
    refundMethod: "Cash",
    vatPercent: "20 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash",
    vatPercent: "18 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash",
    vatPercent: "10 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash",
    vatPercent: "8 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash",
    vatPercent: "1 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Credit or Debit card",
    vatPercent: "20 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Credit or Debit card",
    vatPercent: "18 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Credit or Debit card",
    vatPercent: "10 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Credit or Debit card",
    vatPercent: "8 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Credit or Debit card",
    vatPercent: "1 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Alipay",
    vatPercent: "20 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Alipay",
    vatPercent: "18 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Alipay",
    vatPercent: "10 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Alipay",
    vatPercent: "8 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Alipay",
    vatPercent: "1 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "WeChat",
    vatPercent: "20 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "WeChat",
    vatPercent: "18 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "WeChat",
    vatPercent: "10 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "WeChat",
    vatPercent: "8 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "WeChat",
    vatPercent: "1 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash via partner",
    vatPercent: "20 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash via partner",
    vatPercent: "18 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash via partner",
    vatPercent: "10 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash via partner",
    vatPercent: "8 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Cash via partner",
    vatPercent: "1 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Refund later",
    vatPercent: "20 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Refund later",
    vatPercent: "18 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Refund later",
    vatPercent: "10 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Refund later",
    vatPercent: "8 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
  {
    refundMethod: "Refund later",
    vatPercent: "1 %",
    vat: "0",
    gc: "0",
    rebate: "0",
    nc: "0",
    rebatePercentOfGc: "0 %",
  },
];

async function MyDataTable({
  params,
}: {
  params: { lang: string; type: string };
}) {
  const { languageData } = await getResourceData(params.lang);
  return (
    <div>
      <div className="justify-end-between mt-4 flex">
        <Input placeholder="SIS" type="number" />
        <Button className="ml-4">
          {languageData["Rebate.Preview.Calculate"]}
        </Button>
      </div>
      <DataTable
        columnsData={{
          data: { columns },
          type: "Custom",
        }}
        data={data}
        showView={false}
      />
    </div>
  );
}

export default MyDataTable;
