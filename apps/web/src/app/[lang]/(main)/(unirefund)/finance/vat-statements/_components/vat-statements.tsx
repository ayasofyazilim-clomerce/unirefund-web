"use client";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import DateTooltip from "@repo/ayasofyazilim-ui/molecules/date-tooltip";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDraftDto as VATStatementHeaderDraftDto,
  UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDraftDto as VATStatementTagDetailDraftDto,
} from "@repo/saas/FinanceService";
import {$UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDraftDto as $VATStatementTagDetailDraftDto} from "@repo/saas/FinanceService";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import type {LucideIcon} from "lucide-react";
import {
  ArrowDown01Icon,
  ArrowUp10Icon,
  BadgeInfoIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  CircleHelp,
  CirclePlusIcon,
  Clock10Icon,
  FileKeyIcon,
  TagsIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {getBaseLink} from "@/utils";
import {useTenant} from "@/providers/tenant";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";

export function VatStatements({
  languageData,
  statements,
  emptyMessage,
  children,
}: {
  languageData: FinanceServiceResource;
  statements: VATStatementHeaderDraftDto[] | undefined;
  emptyMessage: string;
  children?: JSX.Element;
}) {
  const {localization} = useTenant();
  return (
    <div className="flex size-full flex-col overflow-hidden">
      {statements ? (
        <>
          <div className="h-full overflow-hidden">
            {statements.length === 1 ? (
              <VatStatementDetails languageData={languageData} statement={statements[0]} />
            ) : (
              <Accordion className="w-full" collapsible defaultValue="statement-item-0" type="single">
                {statements.map((statement, index) => {
                  return (
                    <AccordionItem key={`statement-item-${index}`} value={`statement-item-${index}`}>
                      <AccordionTrigger data-testid={`statement-item-${index}`}>
                        <div className="flex w-full items-center gap-2">
                          {statement.merchantName}
                          <Badge className="ml-auto" variant="outline">
                            <DateTooltip date={statement.vatStatementDate} localization={localization} />
                          </Badge>
                          <Badge variant="outline">
                            {languageData["Finance.tagCount"]} {statement.tagCount}
                          </Badge>
                          <Badge variant="outline">
                            {languageData["Finance.totalAmount"]} {statement.totalAmount}
                            {statement.currency}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <VatStatementDetails languageData={languageData} statement={statement} />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
          {children}
        </>
      ) : (
        <div className="text-muted-foreground m-auto">{emptyMessage}</div>
      )}
    </div>
  );
}

function VatStatementDetails({
  statement,
  languageData,
}: {
  statement: VATStatementHeaderDraftDto;
  languageData: FinanceServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const {localization} = useTenant();
  const {lang} = useParams<{lang: string}>();
  const merchantLink = isActionGranted(["CRMService.Merchants.View"], grantedPolicies)
    ? getBaseLink(`parties/merchants/${statement.merchantId}/details`, lang)
    : null;
  const hasContractGrant = isActionGranted(
    ["ContractService.ContractHeaderForMerchant.ViewDetail", "CRMService.Merchants.View"],
    grantedPolicies,
  );
  return (
    <div className="flex h-full flex-col gap-2 md:flex-row [&>div]:size-full">
      <SidebarProvider className="relative min-h-full gap-2 overflow-hidden">
        <SidebarInset className="w-full overflow-auto">
          <div className="my-2 flex justify-between text-lg font-bold">
            {languageData["Finance.tags"]}
            <Tooltip>
              <TooltipTrigger>
                <SidebarTrigger className="bg-muted text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>{languageData["Finance.statement"]}</TooltipContent>
            </Tooltip>
          </div>
          <TaxFreeTags languageData={languageData} tags={statement.vatStatementTagDetails || []} />
        </SidebarInset>
        <Sidebar className="absolute h-full" collapsible="icon" side="right">
          <SidebarContent className="gap-0 divide-y">
            <SidebarMenuButton className="h-auto min-h-12 w-full min-w-full rounded-none py-2 pl-2 text-lg font-bold">
              <CircleHelp className="w-4 [[data-state=collapsed]_&]:ml-2" />
              <span>{languageData["Finance.statement"]}</span>
            </SidebarMenuButton>
            <LabelValuePair
              icon={UserIcon}
              label={languageData["Finance.merchantId"]}
              link={merchantLink}
              value={statement.merchantName}
            />
            {hasContractGrant ? (
              <LabelValuePair
                icon={FileKeyIcon}
                label={languageData["Finance.contract"]}
                link={getBaseLink(
                  `parties/merchants/${statement.merchantId}/contracts/${statement.contractHeaderId}/contract`,
                  lang,
                )}
                value={languageData["Finance.contract.open"]}
              />
            ) : null}
            <LabelValuePair
              icon={BadgeInfoIcon}
              label={languageData["Finance.status"]}
              value={languageData[`Finance.status.${statement.status}`]}
            />
            <LabelValuePair
              icon={CalendarRangeIcon}
              label={languageData["Finance.billingPeriod"]}
              value={languageData[`Finance.billingPeriod.${statement.billingPeriod}`]}
            />
            <LabelValuePair
              icon={Clock10Icon}
              label={languageData["Finance.termOfPayment"]}
              value={statement.termOfPayment}
            />
            <LabelValuePair
              icon={TruckIcon}
              label={languageData["Finance.deliveryMethod"]}
              value={languageData[`Finance.deliveryMethod.${statement.deliveryMethod}`]}
            />
            <LabelValuePair
              icon={ArrowDown01Icon}
              label={languageData["Finance.referenceNumber"]}
              value={statement.referenceNumber || "-"}
            />
            <LabelValuePair
              icon={ArrowUp10Icon}
              label={languageData["Finance.yourReference"]}
              value={statement.yourReference || "-"}
            />
            <LabelValuePair
              icon={CalendarDaysIcon}
              label={languageData["Finance.referenceDateRange"]}
              value={
                <div className="flex flex-col [&_svg]:hidden">
                  <DateTooltip date={statement.referenceDateBegin} localization={localization} />
                  <DateTooltip date={statement.referenceDateEnd} localization={localization} />
                </div>
              }
            />
            <LabelValuePair
              classNames={{value: "text-2xl"}}
              icon={TagsIcon}
              label={languageData["Finance.tagCount"]}
              value={statement.tagCount || "-"}
            />
            <LabelValuePair
              classNames={{value: "text-2xl"}}
              icon={CirclePlusIcon}
              label={languageData["Finance.totalAmount"]}
              value={`${statement.totalAmount} ${statement.currency}`}
            />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
function LabelValuePair({
  label,
  value,
  classNames,
  link,
  icon: Icon,
}: {
  label: string;
  icon?: LucideIcon;
  value: string | number | JSX.Element;
  link?: string | null;
  classNames?: {
    label?: string;
    value?: string;
    container?: string;
  };
}) {
  return (
    <SidebarMenuButton
      className={cn(
        "text-muted-foreground h-auto min-h-16 w-full min-w-full items-start rounded-none hover:cursor-auto [[data-state=collapsed]_&]:items-center",
        classNames?.container,
      )}
      tooltip={label}>
      {Icon ? <Icon className="mt-1 size-4 [[data-state=collapsed]_&]:ml-2" /> : null}
      <div className="flex flex-col truncate text-nowrap">
        {label}
        {link ? (
          <Link className={cn("font-semibold text-blue-600", classNames?.value)} data-testid={link} href={link}>
            {value}
          </Link>
        ) : (
          <span className={cn("font-semibold text-black", classNames?.value)}>{value}</span>
        )}
      </div>
    </SidebarMenuButton>
  );
}

function TaxFreeTags({
  languageData,
  tags,
}: {
  languageData: FinanceServiceResource;
  tags: VATStatementTagDetailDraftDto[];
}) {
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tanstackTableCreateColumnsByRowData<VATStatementTagDetailDraftDto>({
    rows: $VATStatementTagDetailDraftDto.properties,
    languageData: {
      languageData,
      constantKey: "Finance.Tags",
    },
    links: {
      tagNumber: {
        conditions: [
          {
            conditionAccessorKey: "tagId",
            when: () => isActionGranted(["TagService.Tags.View"], grantedPolicies),
          },
        ],
        targetAccessorKey: "tagId",
        prefix: getBaseLink("operations/tax-free-tags"),
      },
    },
    custom: {
      grandTotalAmount: {
        showHeader: true,
        content: (row) => `${row.grandTotalAmount} ${row.currency}`,
      },
      taxAmount: {
        showHeader: true,
        content: (row) => `${row.taxAmount} ${row.currency}`,
      },
      refundAmount: {
        showHeader: true,
        content: (row) => `${row.refundAmount} ${row.currency}`,
      },
      correctedAmount: {
        showHeader: true,
        content: (row) => `${row.correctedAmount || "0"} ${row.currency}`,
      },
    },
    localization,
  });
  return (
    <TanstackTable
      columnVisibility={{type: "hide", columns: ["merchantName", "tagId", "merchantId", "currency"]}}
      columns={columns}
      data={tags}
      resizeable={false}
      showPagination={false}
    />
  );
}
