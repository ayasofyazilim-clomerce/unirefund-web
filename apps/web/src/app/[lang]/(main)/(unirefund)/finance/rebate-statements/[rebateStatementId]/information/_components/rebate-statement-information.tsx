"use client";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto} from "@repo/saas/FinanceService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useTenant} from "@/providers/tenant";
import {dateToString} from "@/app/[lang]/(main)/(unirefund)/operations/_components/utils";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import {tableData} from "./rebate-information-table-data";

interface InformationItemProps {
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}

function InformationItem({label, value, highlight}: InformationItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`font-medium ${highlight ? "text-primary text-lg" : ""}`}>{value || "-"}</span>
    </div>
  );
}

export default function RebateStatementInformation({
  languageData,
  rebateStatementData,
}: {
  rebateStatementData: UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto;
  languageData: FinanceServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();

  const {localization} = useTenant();

  const columns = tableData.rebateInformation.columns(localization, languageData, grantedPolicies);
  const table = tableData.rebateInformation.table();

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "text-gray-600";

    switch (status) {
      case "Sent":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      case "DebtCollection":
        return "text-amber-600";
      case "CreditNote":
        return "text-green-600";
      case "PaymentReminder1":
      case "PaymentReminder2":
      case "PaymentReminder3":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-h-[calc(100vh-200px)] w-full overflow-y-auto pt-4 ">
      <Card className="mb-6 border shadow-sm">
        <CardHeader className="border-b pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{languageData["RebateStatement.Information"] || "Information"}</h2>
            <span className={`rounded-md px-3 py-1 font-bold ${getStatusColor(rebateStatementData.status)}`}>
              {rebateStatementData.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 md:grid-cols-4">
            <InformationItem
              highlight
              label={languageData["RebateStatement.MerchantName"]}
              value={rebateStatementData.merchantName}
            />
            <InformationItem label={languageData["RebateStatement.Number"]} value={rebateStatementData.number} />
            <InformationItem
              label={languageData["RebateStatement.CustomerNumber"]}
              value={rebateStatementData.customerNumber || "-"}
            />
            <InformationItem
              highlight
              label={languageData["RebateStatement.Total"]}
              value={formatCurrency(rebateStatementData.totalAmount)}
            />
            <InformationItem
              label={languageData["RebateStatement.RebateStatementDate"]}
              value={
                rebateStatementData.rebateStatementDate
                  ? dateToString(rebateStatementData.rebateStatementDate, "tr")
                  : "-"
              }
            />
            <InformationItem label={languageData["RebateStatement.Period"]} value={rebateStatementData.period} />
          </div>
          <TanstackTable
            {...table}
            columns={columns}
            data={rebateStatementData.rebateStatementStoreDetails || []}
            rowCount={rebateStatementData.rebateStatementStoreDetails?.length || 0}
          />
        </CardContent>
      </Card>
    </div>
  );
}
