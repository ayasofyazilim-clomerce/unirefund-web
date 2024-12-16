import type { GetApiTagServiceTagData } from "@ayasofyazilim/saas/TagService";
import {
  $UniRefund_TagService_Tags_RefundType,
  $UniRefund_TagService_Tags_TagStatusType,
} from "@ayasofyazilim/saas/TagService";
import type { ColumnFilter } from "@repo/ayasofyazilim-ui/molecules/tables/types";

export type FilterType = Partial<keyof GetApiTagServiceTagData>;
export type DetailedFilter = ColumnFilter & { name: FilterType };
export type TypedFilter = Partial<Record<FilterType, DetailedFilter>>;

export const typedCommonFilter: TypedFilter = {
  tagNumber: {
    name: "tagNumber",
    displayName: "Tag Number",
    type: "string",
    value: "",
  },
  travellerDocumentNumber: {
    name: "travellerDocumentNumber",
    displayName: "Traveller Document Number",
    type: "string",
    value: "",
  },
  travellerFullName: {
    name: "travellerFullName",
    displayName: "Traveller Name",
    type: "string",
    value: "",
  },
  invoiceNumber: {
    name: "invoiceNumber",
    displayName: "Invoice Number",
    type: "string",
    value: "",
  },
  paidEndDate: {
    name: "paidEndDate",
    displayName: "Paid End Date",
    type: "date",
    value: "",
  },
  issuedStartDate: {
    name: "issuedStartDate",
    displayName: "Issued Start Date",
    type: "date",
    value: "",
  },
  paidStartDate: {
    name: "paidStartDate",
    displayName: "Paid Start Date",
    type: "date",
    value: "",
  },
  refundTypes: {
    name: "refundTypes",
    displayName: "Refund Types",
    type: "select",
    options: [
      ...$UniRefund_TagService_Tags_RefundType.enum.map((item) => ({
        label: item,
        value: item,
      })),
    ],
    placeholder: "Select Refund Type",
    value: "",
  },
  statuses: {
    name: "statuses",
    displayName: "Statuses",
    type: "select",
    value: "",
    options: [
      ...$UniRefund_TagService_Tags_TagStatusType.enum.map((item) => ({
        label: item,
        value: item,
      })),
    ],
    placeholder: "Select Status",
  },
  exportEndDate: {
    name: "exportEndDate",
    displayName: "Export End Date",
    type: "date",
    value: "",
  },
  exportStartDate: {
    name: "exportStartDate",
    displayName: "Export Start Date",
    type: "date",
    value: "",
  },
  issuedEndDate: {
    name: "issuedEndDate",
    displayName: "Issued End Date",
    type: "date",
    value: "",
  },
  sorting: {
    name: "sorting",
    displayName: "Sorting",
    type: "select",
    value: "",
    options: [
      { label: "Ascending", value: "asc" },
      { label: "Descending", value: "desc" },
    ],
    placeholder: "Select Sorting",
  },
};

export const Commonfilters: DetailedFilter[] = Object.values(typedCommonFilter);
