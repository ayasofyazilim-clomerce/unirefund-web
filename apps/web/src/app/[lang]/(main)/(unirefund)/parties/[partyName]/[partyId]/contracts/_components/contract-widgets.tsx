import type { WidgetProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { CustomCombobox } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto as RefundTableHeaderDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto as RefundFeeHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_CRMService_Merchants_StoreProfileDto as StoreProfileDto } from "@ayasofyazilim/saas/CRMService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressTypeDto } from "@ayasofyazilim/saas/LocationService";
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
  refundTableHeaders: RefundTableHeaderDto[] | undefined;
}) {
  function Widget(comboboxProps: WidgetProps) {
    return (
      <CustomCombobox<RefundTableHeaderDto>
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

export function RefundFeeWidget({
  loading,
  languageData,
  refundFeeHeaders,
}: {
  loading: boolean;
  languageData: ContractServiceResource;
  refundFeeHeaders: RefundFeeHeaderDto[] | undefined;
}) {
  function Widget(comboboxProps: WidgetProps) {
    return (
      <CustomCombobox<RefundFeeHeaderDto>
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

export function RebateTableWidget({
  loading,
  languageData,
  rebateTableHeaders,
}: {
  loading: boolean;
  languageData: ContractServiceResource;
  rebateTableHeaders: RebateTableHeaderDto[] | undefined;
}) {
  function Widget(comboboxProps: WidgetProps) {
    return (
      <CustomCombobox<RebateTableHeaderDto>
        {...comboboxProps}
        disabled={loading}
        emptyValue={
          languageData["Rebate.Form.rebateTableHeadersFromTemplate.id"]
        }
        list={rebateTableHeaders}
        searchPlaceholder={
          languageData[
            "Rebate.Form.rebateTableHeadersFromTemplate.id.searchPlaceholder"
          ]
        }
        searchResultLabel={
          languageData[
            "Rebate.Form.rebateTableHeadersFromTemplate.id.searchResultLabel"
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
