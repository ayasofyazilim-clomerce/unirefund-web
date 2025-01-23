import type {
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderInformationDto as AssignableRebateTableHeaders,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderInformationDto as AssignableRefundFeeHeaders,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderInformationDto as AssignableRefundTableHeaders,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_CRMService_RefundPoints_RefundPointProfileDto as StoreProfileDto } from "@ayasofyazilim/saas/CRMService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressTypeDto } from "@ayasofyazilim/saas/LocationService";
import type { WidgetProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { CustomCombobox } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

export function MerchantAddressWidget({
  loading,
  languageData,
  addressList,
}: {
  loading: boolean;
  languageData: ContractServiceResource;
  addressList: AddressTypeDto[] | undefined;
}) {
  function Widget(props: WidgetProps) {
    return (
      <CustomCombobox<AddressTypeDto>
        {...props}
        disabled={loading}
        emptyValue={
          languageData["Contracts.Form.addressCommonDataId.emptyValue"]
        }
        list={addressList}
        searchPlaceholder={
          languageData["Contracts.Form.addressCommonDataId.searchPlaceholder"]
        }
        searchResultLabel={
          languageData["Contracts.Form.addressCommonDataId.searchResultLabel"]
        }
        selectIdentifier="id"
        selectLabel="addressLine"
      />
    );
  }
  return Widget;
}

export function RefundTableWidget({
  loading,
  languageData,
  refundTableHeaders,
}: {
  loading: boolean;
  languageData: ContractServiceResource;
  refundTableHeaders: AssignableRefundTableHeaders[] | undefined;
}) {
  function Widget(comboboxProps: WidgetProps) {
    return (
      <CustomCombobox<AssignableRefundTableHeaders>
        {...comboboxProps}
        disabled={loading}
        emptyValue={
          languageData[
            "Contracts.Form.refundTableHeaders.refundTableHeaderId.emptyValue"
          ]
        }
        list={refundTableHeaders}
        searchPlaceholder={
          languageData[
            "Contracts.Form.refundTableHeaders.refundTableHeaderId.searchPlaceholder"
          ]
        }
        searchResultLabel={
          languageData[
            "Contracts.Form.refundTableHeaders.refundTableHeaderId.searchResultLabel"
          ]
        }
        selectIdentifier="id"
        selectLabel="name"
      />
    );
  }
  return Widget;
}

export function RebateTableWidget({
  loading,
  languageData,
  rebateTableHeaders,
}: {
  loading: boolean;
  languageData: ContractServiceResource;
  rebateTableHeaders: AssignableRebateTableHeaders[] | undefined;
}) {
  function Widget(comboboxProps: WidgetProps) {
    return (
      <CustomCombobox<AssignableRebateTableHeaders>
        {...comboboxProps}
        disabled={loading}
        emptyValue={
          languageData[
            "Contracts.Form.rebateTableHeaders.rebateTableHeaderId.emptyValue"
          ]
        }
        list={rebateTableHeaders}
        searchPlaceholder={
          languageData[
            "Contracts.Form.rebateTableHeaders.rebateTableHeaderId.searchPlaceholder"
          ]
        }
        searchResultLabel={
          languageData[
            "Contracts.Form.rebateTableHeaders.rebateTableHeaderId.searchResultLabel"
          ]
        }
        selectIdentifier="id"
        selectLabel="name"
      />
    );
  }
  return Widget;
}

export function RefundFeeWidget({
  loading,
  languageData,
  refundFeeHeaders,
}: {
  loading: boolean;
  languageData: ContractServiceResource;
  refundFeeHeaders: AssignableRefundFeeHeaders[] | undefined;
}) {
  function Widget(comboboxProps: WidgetProps) {
    return (
      <CustomCombobox<AssignableRefundFeeHeaders>
        {...comboboxProps}
        disabled={loading}
        emptyValue={
          languageData[
            "Contracts.Form.refundFeeHeaders.refundFeeHeaderId.emptyValue"
          ]
        }
        list={refundFeeHeaders}
        searchPlaceholder={
          languageData[
            "Contracts.Form.refundFeeHeaders.refundFeeHeaderId.searchPlaceholder"
          ]
        }
        searchResultLabel={
          languageData[
            "Contracts.Form.refundFeeHeaders.refundFeeHeaderId.searchResultLabel"
          ]
        }
        selectIdentifier="id"
        selectLabel="name"
      />
    );
  }
  return Widget;
}

export function MerchantStoresWidget({
  loading,
  languageData,
  list,
}: {
  loading: boolean;
  languageData: ContractServiceResource;
  list: StoreProfileDto[] | undefined;
}) {
  function Widget(props: WidgetProps) {
    return (
      <CustomCombobox<StoreProfileDto>
        {...props}
        disabled={loading}
        list={list}
        searchPlaceholder={languageData["Select.Placeholder"]}
        searchResultLabel={languageData["Select.ResultLabel"]}
        selectIdentifier="id"
        selectLabel="name"
      />
    );
  }
  return Widget;
}
