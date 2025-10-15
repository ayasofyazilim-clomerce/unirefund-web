import type {FilterComponentSearchItem} from "@repo/ayasofyazilim-ui/molecules/filter-component";
import type {
  GetApiTagServiceTagData,
  UniRefund_TagService_Tags_TagStatusType,
  UniRefund_ContractService_Enums_RefundMethod,
} from "@repo/saas/TagService";
import {getDateRanges} from "@/utils/utils-date";

export interface TagsSearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  invoiceNumber?: string;
  exportDate?: string;
  issuedDate?: string;
  paidDate?: string;
  merchantIds?: string;
  refundTypes?: string;
  statuses?: string;
  tagNumber?: string;
  travellerDocumentNumber?: string;
  travellerFullName?: string;
  travellerIds?: string;
}

export function initParams(searchParams: TagsSearchParamType) {
  const {ranges} = getDateRanges();
  const {
    merchantIds: spMerchantIds,
    statuses: spStatuses,
    refundTypes: spRefundTypes,
    travellerIds: spTravellerIds,
    exportDate: spExportDate,
    issuedDate: spIssuedDate,
    paidDate: spPaidDate,
  } = searchParams;

  const merchantIdsParsed = JSON.parse(spMerchantIds || "[]") as FilterComponentSearchItem[];
  const merchantIds = merchantIdsParsed.map((i: FilterComponentSearchItem) => i.id);

  const tagData: GetApiTagServiceTagData = {
    ...searchParams,
    merchantIds,
    statuses: spStatuses?.split(",") as UniRefund_TagService_Tags_TagStatusType[],
    refundTypes: spRefundTypes?.split(",") as UniRefund_ContractService_Enums_RefundMethod[],
    travellerIds: spTravellerIds?.split(","),
  };

  if (spIssuedDate) {
    tagData.issuedStartDate = ranges[spIssuedDate].startDate.toISOString();
    tagData.issuedEndDate = ranges[spIssuedDate].endDate.toISOString();
  }
  if (spPaidDate) {
    tagData.paidStartDate = ranges[spPaidDate].startDate.toISOString();
    tagData.paidEndDate = ranges[spPaidDate].endDate.toISOString();
  }
  if (spExportDate) {
    tagData.exportStartDate = ranges[spExportDate].startDate.toISOString();
    tagData.exportEndDate = ranges[spExportDate].endDate.toISOString();
  }
  tagData.sorting = "issueDate desc, status";
  return tagData;
}
