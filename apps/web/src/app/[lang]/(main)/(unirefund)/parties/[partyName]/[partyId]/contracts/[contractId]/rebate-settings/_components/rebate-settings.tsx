"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type {
  UniRefund_ContractService_Rebates_MinimumNetCommissions_MinimumNetCommissionCreateDto as MinimumNetCommissionCreateDto,
  UniRefund_ContractService_Rebates_RebateSettings_RebateSettingCreateDto as RebateSettingCreateDto,
  UniRefund_ContractService_Rebates_RebateSettings_RebateSettingDto as RebateSettingDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderTemplateDto as RebateTableHeaderDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderNotTemplateCreateDto as RebateTableHeaderNotTemplateCreateDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_Rebates_MinimumNetCommissions_MinimumNetCommissionCreateDto as $MinimumNetCommissionCreateDto,
  $UniRefund_ContractService_Rebates_RebateSettings_RebateSettingCreateDto as $RebateSettingCreateDto,
} from "@ayasofyazilim/saas/ContractService";
import type {
  UniRefund_CRMService_Merchants_StoreProfileDto as StoreProfileDto,
  UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto as AffiliationTypeDetailDto,
} from "@ayasofyazilim/saas/CRMService";
import { Combobox } from "@repo/ayasofyazilim-ui/molecules/combobox";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type { FieldProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postMerchantContractHeaderRebateSettingByHeaderIdApi } from "src/actions/unirefund/ContractService/post-actions";
import RebateForm from "src/app/[lang]/(main)/(unirefund)/settings/templates/rebate/rebate-form";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { MerchantStoresWidget } from "../../../_components/contract-widgets";

export function RebateSettings({
  languageData,
  rebateSettings,
  rebateTables,
  subMerchants,
  individuals,
  contractId,
  lang,
}: {
  languageData: ContractServiceResource;
  rebateSettings: RebateSettingDto | undefined;
  rebateTables: RebateTableHeaderDto[];
  subMerchants: StoreProfileDto[];
  individuals: AffiliationTypeDetailDto[];
  contractId: string;
  lang: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const uiSchema = createUiSchemaWithResource({
    schema: $RebateSettingCreateDto,
    resources: languageData,
    name: "Rebate.Form",
    extend: {
      isTrustedMerchant: {
        "ui:widget": "switch",
      },
      rebateTableHeaders: {
        items: {
          "ui:field": "CreateRebateTableField",
        },
      },
      contactInformationTypeId: {
        "ui:widget": "Individuals",
      },
      minimumNetCommissions: {
        items: {
          "ui:field": "CreateMinimumNetCommissionField",
        },
      },
    },
  });
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  return (
    <SchemaForm<RebateSettingCreateDto>
      disabled={loading}
      fields={{
        CreateRebateTableField: CreateRebateTableField({
          dateFormat,
          lang,
          languageData,
          rebateTables,
          loading,
        }),
        CreateMinimumNetCommissionField: CreateMinimumNetCommissionField({
          dateFormat,
          lang,
          loading,
          languageData,
          subMerchants,
        }),
      }}
      formData={
        rebateSettings
          ? {
              ...rebateSettings,
              rebateTableHeaders: rebateSettings.rebateTableHeaders?.map(
                (rebateTableHeader) => {
                  return {
                    ...rebateTableHeader,
                    validFrom:
                      rebateTableHeader.validFrom || new Date().toISOString(),
                  };
                },
              ),
            }
          : undefined
      }
      onSubmit={(data) => {
        if (!data.formData) return;
        setLoading(true);
        void postMerchantContractHeaderRebateSettingByHeaderIdApi({
          id: contractId,
          requestBody: data.formData,
        })
          .then((res) => {
            handlePostResponse(res, router);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$RebateSettingCreateDto}
      uiSchema={uiSchema}
      widgets={{
        Individuals: CustomComboboxWidget<AffiliationTypeDetailDto>({
          languageData,
          selectLabel: "name",
          selectIdentifier: "id",
          list: individuals,
          badges: {
            codeName: {
              className: "",
            },
          },
        }),
      }}
    />
  );
}

function CreateRebateTableField({
  lang,
  dateFormat,
  languageData,
  rebateTables,
  loading,
}: {
  lang: string;
  dateFormat: Intl.DateTimeFormatOptions;
  languageData: ContractServiceResource;
  rebateTables: RebateTableHeaderDto[];
  loading: boolean;
}) {
  function Field(props: FieldProps) {
    const _formData: RebateTableHeaderNotTemplateCreateDto | undefined =
      props.formData as RebateTableHeaderNotTemplateCreateDto;
    const [open, setOpen] = useState(false);
    const [onTheFlyFormData, setOnTheFlyFormData] =
      useState<RebateTableHeaderNotTemplateCreateDto>(_formData);
    const [selectedTemplate, setSelectedTemplate] = useState<
      RebateTableHeaderDto | undefined | null
    >();
    const [iteration, setIteration] = useState(0);
    return (
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button
            className="h-12 w-full justify-start"
            type="button"
            variant="ghost"
          >
            {_formData.name && _formData.validFrom ? (
              <div className="flex items-center gap-2">
                <span>{_formData.name}</span>
                <div className="space-x-2">
                  <Badge variant="outline">
                    {new Date(_formData.validFrom).toLocaleDateString(
                      lang,
                      dateFormat,
                    )}
                  </Badge>
                </div>
              </div>
            ) : (
              languageData["Rebate.Form.rebateTableHeaders.title"]
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-screen pb-20 sm:max-w-full lg:w-[50vw]">
          <SheetHeader>
            <SheetTitle>
              {languageData["Rebate.Form.rebateTableHeaders.title"]}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-2">
            <div className="flex w-full gap-2">
              <Combobox<RebateTableHeaderDto>
                disabled={loading}
                emptyValue={
                  languageData["Rebate.Form.rebateTableHeadersFromTemplate.id"]
                }
                list={rebateTables}
                onValueChange={(value) => {
                  setSelectedTemplate(value);
                }}
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
                value={selectedTemplate}
              />
              <ConfirmDialog
                confirmProps={{
                  onConfirm: () => {
                    if (selectedTemplate) {
                      setOnTheFlyFormData({
                        ...selectedTemplate,
                        validFrom: new Date().toISOString(),
                      });
                      setSelectedTemplate(null);
                      setIteration(iteration + 1);
                    }
                  },
                  closeAfterConfirm: true,
                }}
                description="Are you sure you want to fill from template? This will override your current data."
                title="Fill from template"
                triggerProps={{
                  children: "Fill from template",
                  variant: "outline",
                  disabled: !selectedTemplate,
                }}
                type="with-trigger"
              />
            </div>
            <RebateForm
              formData={onTheFlyFormData}
              formType="add"
              key={iteration}
              languageData={languageData}
              onSubmit={(data) => {
                props.onChange(data);
                setOpen(false);
              }}
            >
              <SheetFooter className="mt-2">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    {languageData.Cancel}
                  </Button>
                </SheetClose>
                <Button type="submit">{languageData.Save}</Button>
              </SheetFooter>
            </RebateForm>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return Field;
}

function CreateMinimumNetCommissionField({
  lang,
  dateFormat,
  loading,
  languageData,
  subMerchants,
}: {
  lang: string;
  dateFormat: Intl.DateTimeFormatOptions;
  loading: boolean;
  languageData: ContractServiceResource;
  subMerchants: StoreProfileDto[];
}) {
  function Field(props: FieldProps) {
    const _formData: MinimumNetCommissionCreateDto =
      props.formData as MinimumNetCommissionCreateDto;
    const hasValue: boolean = Object.keys(props.formData as object).length > 0;
    const [open, setOpen] = useState(false);
    return (
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button
            className="w-full justify-start"
            type="button"
            variant="ghost"
          >
            {hasValue ? (
              <div className="flex items-center gap-2">
                <span>{_formData.amount}</span>
                <div className="space-x-2">
                  <Badge variant="outline">
                    {new Date(_formData.validFrom).toLocaleDateString(
                      lang,
                      dateFormat,
                    )}
                  </Badge>
                  <Badge variant="outline">
                    {new Date(_formData.validTo).toLocaleDateString(
                      lang,
                      dateFormat,
                    )}
                  </Badge>
                </div>
              </div>
            ) : (
              languageData["Rebate.Form.minimumNetCommissions.title"]
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit</SheetTitle>
          </SheetHeader>
          <SchemaForm<MinimumNetCommissionCreateDto>
            className="h-full p-0 [&>fieldset]:border-0 [&>fieldset]:p-0"
            filter={{
              type: "include",
              sort: true,
              keys: ["appliedOrganizationId", "validFrom", "validTo", "amount"],
            }}
            formData={_formData}
            onSubmit={(data) => {
              props.onChange(data.formData);
              setOpen(false);
            }}
            schema={$MinimumNetCommissionCreateDto}
            uiSchema={createUiSchemaWithResource({
              schema: $MinimumNetCommissionCreateDto,
              resources: languageData,
              name: "Rebate.Form.minimumNetCommissions",
              extend: {
                displayLabel: false,
                appliedOrganizationId: {
                  "ui:widget": "MerchantStoresWidget",
                },
              },
            })}
            useDefaultSubmit={false}
            widgets={{
              MerchantStoresWidget: MerchantStoresWidget({
                languageData,
                loading,
                list: subMerchants,
              }),
            }}
            withScrollArea={false}
          >
            <SheetFooter className="mt-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  {languageData.Cancel}
                </Button>
              </SheetClose>
              <Button type="submit">{languageData.Save}</Button>
            </SheetFooter>
          </SchemaForm>
        </SheetContent>
      </Sheet>
    );
  }
  return Field;
}
