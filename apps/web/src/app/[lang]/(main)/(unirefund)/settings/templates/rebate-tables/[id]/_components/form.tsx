"use client";

import type { ContractServiceResource } from "@/language-data/unirefund/ContractService";

export default function RebateTableHeaderUpdateForm({
  languageData,
}: {
  languageData: ContractServiceResource;
}) {
  return <div>Form {languageData.Cancel}</div>;
}
