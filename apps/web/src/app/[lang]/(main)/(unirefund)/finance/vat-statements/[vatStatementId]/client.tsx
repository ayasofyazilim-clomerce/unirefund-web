"use client";

import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto} from "@repo/saas/FinanceService";
import type {FinanceServiceResource} from "@/language-data/unirefund/FinanceService";
import {VatStatements} from "../_components/vat-statements";

export default function Client({
  statement,
  languageData,
}: {
  statement: UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto;
  languageData: FinanceServiceResource;
}) {
  return <VatStatements emptyMessage="" languageData={languageData} statements={[statement]} />;
}
