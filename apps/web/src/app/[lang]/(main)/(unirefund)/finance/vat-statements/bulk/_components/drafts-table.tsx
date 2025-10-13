"use client";

import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import {toast} from "@/components/ui/sonner";
import {postVatStatementHeadersFormDraftApi} from "@repo/actions/unirefund/FinanceService/post-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDraftDto as VATStatementHeaderDraftDto,
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDraftSummaryDto as VATStatementHeaderDraftSummaryDto,
} from "@repo/saas/FinanceService";
import {$UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDraftSummaryDto as $VATStatementHeaderDraftSummaryDto} from "@repo/saas/FinanceService";
import {useState} from "react";
import {useTenant} from "@/providers/tenant";
import {VatStatements} from "../../_components/vat-statements";
import type {BasePropType} from "./client";

export function DraftsTable({
  drafts,
  merchantId,
  languageData,
  startTransition,
  monthYearPair,
  isPending,
}: {drafts: VATStatementHeaderDraftSummaryDto[]; merchantId: string} & BasePropType) {
  const {localization} = useTenant();
  const [detailedDraft, setDetailedDraft] = useState<VATStatementHeaderDraftDto[]>();
  const [detailedDraftOpen, setDetailedDraftOpen] = useState(false);

  const columns = tanstackTableCreateColumnsByRowData<VATStatementHeaderDraftSummaryDto>({
    rows: $VATStatementHeaderDraftSummaryDto.properties,
    localization,
    languageData: {
      languageData,
      constantKey: "Finance",
    },
    excludeColumns: ["contractHeaderId", "currency", "isFactoring", "customerNumber"],
    custom: {
      totalAmount: {
        showHeader: true,
        content: (row) => `${row.totalAmount} ${row.currency}`,
      },
      unpaidAmount: {
        showHeader: true,
        content: (row) => `${row.unpaidAmount} ${row.currency}`,
      },
      status: {
        showHeader: true,
        content: (row) => languageData[`Finance.status.${row.status}`],
      },
      billingPeriod: {
        showHeader: true,
        content: (row) => languageData[`Finance.billingPeriod.${row.billingPeriod}`],
      },
      paymentStatus: {
        showHeader: true,
        content: (row) => languageData[`Finance.paymentStatus.${row.paymentStatus}`],
      },
      deliveryMethod: {
        showHeader: true,
        content: (row) => languageData[`Finance.deliveryMethod.${row.deliveryMethod}`],
      },
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <TanstackTable columns={columns} data={drafts} resizeable={false} showPagination={false} />
      <Button
        className="sticky left-2 right-2 mx-auto w-full max-w-sm"
        data-testid="open-statement-details"
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            void postVatStatementHeadersFormDraftApi({
              requestBody: {
                merchantId,
                vatStatementDate: new Date().toISOString(),
                ...monthYearPair,
              },
            }).then((res) => {
              if (res.type === "success") {
                if (res.data.length > 0) {
                  setDetailedDraftOpen(true);
                  setDetailedDraft(res.data);
                }
              } else {
                setDetailedDraft([]);
                toast.error(res.message);
              }
            });
          });
        }}
        type="button"
        variant="outline">
        {languageData["Finance.statement"]}
      </Button>
      <Drawer onOpenChange={setDetailedDraftOpen} open={detailedDraftOpen}>
        <DrawerContent className="px-4">
          <VatStatements emptyMessage="" languageData={languageData} statements={detailedDraft} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
