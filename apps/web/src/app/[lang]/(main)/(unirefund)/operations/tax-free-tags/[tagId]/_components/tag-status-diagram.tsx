"use client";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import DateTooltip from "@repo/ayasofyazilim-ui/molecules/date-tooltip";
import type {GetApiFinanceServiceVatStatementHeadersByIdResponse} from "@repo/saas/FinanceService";
import type {UniRefund_RefundService_Refunds_GetDetailAsync_RefundDetailDto} from "@repo/saas/RefundService";
import type {GetApiTagServiceTagByIdDetailResponse} from "@repo/saas/TagService";
import {ClockIcon, SquareArrowOutUpRight} from "lucide-react";
import {useTenant} from "@/providers/tenant";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import TagActions from "./tag-actions";

function ValidStatus({
  title,
  link,
  date,
  message,
}: {
  title: string;
  link?: string;
  date?: string | null;
  message?: string[];
}) {
  const {localization} = useTenant();
  return (
    <Card className="rounded-none">
      <CardHeader className="text-primary-800 flex flex-row space-y-0 px-6 pb-0 pt-3 text-lg font-semibold">
        <div className="grid w-full grid-cols-6 gap-x-2 gap-y-1">
          <div className="col-span-full">
            <div className={date ? "" : "text-muted-foreground mb-2"}>
              {link ? (
                <a className="flex flex-row items-center text-blue-700" data-testid="valid-status-link" href={link}>
                  <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                  {title}
                </a>
              ) : (
                title
              )}
            </div>
            {date ? (
              <span className="text-primary-800 inline-flex items-center rounded p-0 text-sm font-bold">
                <DateTooltip date={date} icon={<ClockIcon className="h-4 w-4" />} localization={localization} />
              </span>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-muted-foreground mt-0 text-sm">
        {message?.map((m, index) => <p key={m + index}>{m}</p>)}
      </CardContent>
    </Card>
  );
}

export default function TagStatusDiagram({
  tagDetail,
  tagVatStatementHeader,
  tagRefundDetail,
  languageData,
}: {
  tagDetail: GetApiTagServiceTagByIdDetailResponse;
  tagVatStatementHeader: GetApiFinanceServiceVatStatementHeadersByIdResponse | null;
  tagRefundDetail: UniRefund_RefundService_Refunds_GetDetailAsync_RefundDetailDto | null;
  languageData: TagServiceResource;
}) {
  return (
    <div className=" h-max gap-3">
      <ValidStatus
        date={tagDetail.issueDate}
        link={`/operations/tax-free-tags/${tagDetail.id}`}
        title={languageData.Issue}
      />
      {tagDetail.exportValidation ? (
        <ValidStatus
          date={tagDetail.exportValidation.exportDate}
          link={`/operations/export-validations/${tagDetail.exportValidation.id}`}
          message={[
            `${languageData.CustomTitle}: ${tagDetail.exportValidation.customsName}`,
            `${languageData.ReferenceId}: ${tagDetail.exportValidation.referenceId}`,
          ]}
          title={languageData.ExportValidation}
        />
      ) : (
        <ValidStatus title={languageData.WaitingExportValidation} />
      )}
      {tagRefundDetail ? (
        <ValidStatus
          date={tagRefundDetail.paidDate}
          message={[
            `${languageData.RefundPoint}: ${tagRefundDetail.refundPoint.name}`,
            `${languageData.RefundMethod}: ${tagRefundDetail.refundTypeEnum}`,
          ]}
          title={languageData.Refund}
        />
      ) : (
        <ValidStatus title={languageData.Refund} />
      )}
      {tagVatStatementHeader?.id ? (
        <ValidStatus
          date={tagVatStatementHeader.vatStatementDate}
          link={`/finance/vat-statements/${tagVatStatementHeader.id}`}
          message={[
            `${languageData.InvoiceNumber}: ${tagVatStatementHeader.invoiceNumber}`,
            `${languageData.MerchantTitle}: ${tagVatStatementHeader.merchantName}`,
          ]}
          title={languageData.VatStatement}
        />
      ) : (
        <ValidStatus title={languageData.VatStatement} />
      )}
      <TagActions languageData={languageData} refundPoint tagDetail={tagDetail} />
    </div>
  );
}
