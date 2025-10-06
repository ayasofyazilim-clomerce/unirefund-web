"use client";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import type {
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderDetailForMerchantDto as ContractHeaderDetailForMerchantDto,
  UniRefund_ContractService_ContractsForMerchant_ContractSettings_ContractSettingCreateDto as ContractSettingCreateUpdateDto,
  UniRefund_ContractService_ContractsForMerchant_ContractSettings_ContractSettingDto as ContractSettingDto,
} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_ContractsForMerchant_ContractSettings_ContractSettingCreateDto as $ContractSettingCreateUpdateDto} from "@repo/saas/ContractService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {bulkCreateUiSchema, createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
import type {Dispatch, SetStateAction} from "react";
import {useCallback, useState} from "react";
import {handleDeleteResponse, handlePostResponse, handlePutResponse} from "@repo/utils/api";
import {getMerchantContractHeaderContractSettingsByHeaderIdApi as getContractSettings} from "@repo/actions/unirefund/ContractService/action";
import {
  putMerchantContractContractHeaderSetDefaultContractSettingByHeaderIdApi,
  putMerchantContractContractSettingsByIdApi,
} from "@repo/actions/unirefund/ContractService/put-actions";
import {postMerchantContractHeaderContractSettingsByHeaderIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {deleteMerchantContractContractSettingsByIdApi} from "@repo/actions/unirefund/ContractService/delete-actions";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import type {UniRefund_CRMService_Addresses_AddressDto} from "@repo/saas/CRMService";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import {useTenant} from "@/providers/tenant";

interface ContractSettingsTable {
  id: string;
  name: string;
  isDefault?: boolean;
  details?: Partial<ContractSettingDto & ContractSettingCreateUpdateDto>;
}
const $ContractSettingsTable = {
  id: {
    type: "string",
  },
  name: {
    type: "string",
  },
  isDefault: {
    type: "boolean",
  },
  details: {
    type: "string",
  },
};
export function ContractSettings({
  languageData,
  contractSettings,
  contractHeaderDetails,
  addressList,
}: {
  languageData: ContractServiceResource;
  contractSettings: ContractSettingDto[];
  contractHeaderDetails: ContractHeaderDetailForMerchantDto;
  addressList: UniRefund_CRMService_Addresses_AddressDto[];
  lang: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {localization} = useTenant();
  const [settings, setSettings] = useState<ContractSettingsTable[]>(
    contractSettings.map((item) => {
      return {
        id: item.id,
        name: item.name,
        isDefault: item.isDefault,
        details: item,
      };
    }),
  );
  const [tempSettings, setTempSettings] = useState<ContractSettingsTable | undefined>();

  async function handleFetch() {
    setLoading(true);
    const contractSettingsResponse = await getContractSettings({
      id: contractHeaderDetails.id,
    });
    if (contractSettingsResponse.type === "success") {
      setSettings(
        contractSettingsResponse.data.items?.map((item) => {
          return {
            id: item.id,
            name: item.name,
            isDefault: item.isDefault,
            details: item,
          };
        }) || [],
      );
    } else {
      setSettings([]);
    }
  }

  const RowForm = useCallback(
    (row: ContractSettingsTable) => {
      const invoicingAddressCommonDataId: string | undefined = (() => {
        if (!row.details) return undefined;
        if (row.details.invoicingAddressCommonData?.id) return row.details.invoicingAddressCommonData.id;
        if ("invoicingAddressCommonDataId" in row.details) {
          const v = (row.details as {invoicingAddressCommonDataId?: unknown}).invoicingAddressCommonDataId;
          return typeof v === "string" ? v : undefined;
        }
        return undefined;
      })();

      return (
        <SchemaFormForContractSettings
          addressList={addressList}
          formData={{
            ...row.details,
            invoicingAddressCommonDataId,
          }}
          handleFetch={handleFetch}
          languageData={languageData}
          loading={loading}
          setLoading={setLoading}
          setTempSettings={setTempSettings}
          submitId={tempSettings ? contractHeaderDetails.id : row.id}
          type={tempSettings ? "temp" : "edit"}
        />
      );
    },
    [addressList, tempSettings, contractHeaderDetails],
  );
  const SetDefaultAction = useCallback((row: ContractSettingsTable) => {
    if (row.isDefault || tempSettings) return <></>;
    return (
      <Button
        data-testid="set-default-button"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          void putMerchantContractContractHeaderSetDefaultContractSettingByHeaderIdApi({
            id: contractHeaderDetails.id,
            requestBody: {contractSettingId: row.id},
          })
            .then((res) => {
              handlePutResponse(res, router);
            })
            .finally(() => {
              void handleFetch().then(() => {
                setLoading(false);
              });
            });
        }}
        size="sm"
        variant="outline">
        {languageData["Contracts.Settings.SetDefault"]}
      </Button>
    );
  }, []);
  const columns = tanstackTableCreateColumnsByRowData<ContractSettingsTable>({
    rows: $ContractSettingsTable,
    localization,
    custom: {
      isDefault: {
        showHeader: false,
        content: (row) => SetDefaultAction(row),
      },
    },
    badges: {
      name: {
        values: [
          {
            label: languageData["Form.isDefault"],
            conditions: [
              {
                conditionAccessorKey: "isDefault",
                when: (value) => value === true,
              },
            ],
          },
        ],
      },
    },
    expandRowTrigger: "name",
  });

  const tableActions: TanstackTableTableActionsType<ContractSettingsTable>[] | undefined = !tempSettings
    ? [
        {
          actionLocation: "table",
          cta: languageData.New,
          type: "simple",
          onClick: () => {
            const tempDetails: Partial<ContractSettingDto & ContractSettingCreateUpdateDto> = {
              name: languageData["Contracts.Default"],
            };

            if (addressList.length > 0) {
              tempDetails.invoicingAddressCommonDataId = addressList[0].id;
            }

            setTempSettings({
              name: languageData["Contracts.Default"],
              id: "$temp",
              details: tempDetails,
            });
          },
        },
      ]
    : undefined;

  const hasEditPermission = isActionGranted(
    ["ContractService.ContractHeaderForMerchant.ContractSettingEdit"],
    grantedPolicies,
  );

  if (settings.length > 0) {
    return (
      <TanstackTable<ContractSettingsTable, ContractSettingsTable>
        columnVisibility={{
          columns: ["id", "details"],
          type: "hide",
        }}
        columns={columns}
        data={tempSettings ? [...settings, tempSettings] : settings}
        expandedRowComponent={(row) => RowForm(row)}
        fillerColumn="name"
        tableActions={tableActions}
      />
    );
  }
  return (
    <SchemaFormForContractSettings
      addressList={addressList}
      formData={{}}
      handleFetch={handleFetch}
      languageData={languageData}
      loading={!hasEditPermission || loading}
      setLoading={setLoading}
      submitId={contractHeaderDetails.id}
      type="create"
    />
  );
}
function SchemaFormForContractSettings({
  languageData,
  formData,
  loading,
  setLoading,
  addressList,
  setTempSettings,
  submitId,
  type,
  handleFetch,
}: {
  languageData: ContractServiceResource;
  formData: Partial<ContractSettingCreateUpdateDto>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setTempSettings?: Dispatch<SetStateAction<ContractSettingsTable | undefined>>;
  addressList: UniRefund_CRMService_Addresses_AddressDto[];
  submitId: string;
  type: "edit" | "create" | "temp";
  handleFetch: () => Promise<void>;
}) {
  const router = useRouter();
  const switchFields: (keyof ContractSettingCreateUpdateDto)[] = [
    "deliveryFee",
    "factoring",
    "excludeFromCashLimit",
    "eTaxFree",
    "crossTaxFreeForm",
    "facturaNumberIsUnique",
    "goodsHaveSerialNumbers",
    "excludeFromCashLimit",
    "deskoScanner",
  ];

  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Contracts.Settings.Form",
    schema: $ContractSettingCreateUpdateDto,
    extend: {
      ...bulkCreateUiSchema<ContractSettingCreateUpdateDto>({
        elements: switchFields,
        config: {"ui:widget": "switch"},
      }),
      invoicingAddressCommonDataId: {
        "ui:className": "md:col-span-2",
        "ui:widget": "address",
      },
      "ui:className": cn("md:grid md:grid-cols-2 md:gap-2", type === "edit" && "p-4"),
      isDefault: {
        "ui:widget": "switch",
        "ui:className": "hidden",
      },
    },
  });

  return (
    <SchemaForm<Partial<ContractSettingCreateUpdateDto>>
      className="bg-white"
      data-testid="contract-settings-form"
      defaultSubmitClassName="pr-4"
      disabled={loading}
      filter={{
        type: "include",
        sort: true,
        keys: [
          "name",
          "referenceNumber",
          "invoiceChannel",
          "invoicingFrequency",
          "termOfPayment",
          "receiptType",
          "invoicingAddressCommonDataId",
          ...switchFields,
        ],
      }}
      formData={formData}
      onSubmit={(data) => {
        if (!data.formData) return;
        setLoading(true);
        if (type === "create" || type === "temp") {
          void postMerchantContractHeaderContractSettingsByHeaderIdApi({
            id: submitId,
            requestBody: data.formData as ContractSettingCreateUpdateDto,
          })
            .then((response) => {
              handlePostResponse(response, router);
            })
            .finally(() => {
              void handleFetch().then(() => {
                setLoading(false);
              });
            });
        } else {
          void putMerchantContractContractSettingsByIdApi({
            id: submitId,
            requestBody: data.formData as ContractSettingCreateUpdateDto,
          })
            .then((response) => {
              handlePutResponse(response, router);
            })
            .finally(() => {
              void handleFetch().then(() => {
                setLoading(false);
              });
            });
        }
      }}
      schema={$ContractSettingCreateUpdateDto}
      uiSchema={uiSchema}
      useDefaultSubmit={false}
      widgets={{
        address: CustomComboboxWidget<UniRefund_CRMService_Addresses_AddressDto>({
          list: addressList,
          languageData,
          selectIdentifier: "id",
          selectLabel: "addressLine",
        }),
      }}
      withScrollArea>
      <div className="sticky bottom-0 z-50 flex justify-end gap-2 bg-white py-4">
        <DeleteDialog
          disabled={loading}
          handleFetch={handleFetch}
          languageData={languageData}
          setLoading={setLoading}
          setTempSettings={setTempSettings}
          submitId={type === "temp" ? "$temp" : submitId}
        />
        <Button data-testid="contract-settings-form-submit" disabled={loading} type="submit">
          {type === "edit" ? languageData["Edit.Save"] : languageData.Save}
        </Button>
      </div>
    </SchemaForm>
  );
}

function DeleteDialog({
  submitId,
  languageData,
  setLoading,
  setTempSettings,
  handleFetch,
  disabled,
}: {
  submitId: string;
  languageData: ContractServiceResource;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setTempSettings?: Dispatch<SetStateAction<ContractSettingsTable | undefined>>;
  handleFetch: () => Promise<void>;
  disabled: boolean;
}) {
  const router = useRouter();
  return (
    <ConfirmDialog
      confirmProps={{
        variant: "destructive",
        closeAfterConfirm: true,
        onConfirm: () => {
          if (submitId === "$temp" && setTempSettings) {
            setTempSettings(undefined);
            return;
          }
          setLoading(true);
          void deleteMerchantContractContractSettingsByIdApi(submitId)
            .then((response) => {
              handleDeleteResponse(response, router);
            })
            .finally(() => {
              void handleFetch().then(() => {
                setLoading(false);
              });
            });
        },
      }}
      description={languageData["Delete.Assurance"]}
      title={languageData.Delete}
      triggerProps={{
        disabled,
        "data-testid": "contract-settings-delete-button",
        type: "button",
        variant: "outline",
        children: languageData.Delete,
      }}
      type="with-trigger"
    />
  );
}
