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
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderFromTemplateCreateDto as RebateTableHeaderFromTemplateCreateDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderNotTemplateCreateDto as RebateTableHeaderNotTemplateCreateDto,
  UniRefund_ContractService_Rebates_RebateSettings_RebateSettingDto as RebateSettingDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_Rebates_MinimumNetCommissions_MinimumNetCommissionCreateDto as $MinimumNetCommissionCreateDto,
  $UniRefund_ContractService_Rebates_RebateSettings_RebateSettingCreateDto as $RebateSettingCreateDto,
  $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderFromTemplateCreateDto as $RebateTableHeaderFromTemplateCreateDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_CRMService_Merchants_StoreProfileDto as StoreProfileDto } from "@ayasofyazilim/saas/CRMService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type { FieldProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { postMerchantContractHeaderRebateSettingByHeaderIdApi } from "src/actions/unirefund/ContractService/post-actions";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import RebateForm from "src/app/[lang]/(main)/(unirefund)/settings/templates/rebate/rebate-form";
import {
  MerchantStoresWidget,
  RebateTableWidget,
} from "../../../_components/contract-widgets";

export function RebateSettings({
  languageData,
  rebateSettings,
  rebateTables,
  subMerchants,
  contractId,
  lang,
}: {
  languageData: ContractServiceResource;
  rebateSettings: RebateSettingDto;
  rebateTables: RebateTableHeaderDto[];
  subMerchants: StoreProfileDto[];
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
      rebateTableHeadersFromTemplate: {
        items: {
          "ui:field": "SelectRebateTableField",
        },
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
        }),
        SelectRebateTableField: SelectRebateTableField({
          dateFormat,
          lang,
          languageData,
          rebateTableHeaders: rebateTables,
        }),
        CreateMinimumNetCommissionField: CreateMinimumNetCommissionField({
          dateFormat,
          lang,
          loading,
          languageData,
          subMerchants,
        }),
      }}
      formData={rebateSettings}
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
    />
  );
}

function SelectRebateTableField({
  lang,
  dateFormat,
  languageData,
  rebateTableHeaders,
}: {
  lang: string;
  dateFormat: Intl.DateTimeFormatOptions;
  languageData: ContractServiceResource;
  rebateTableHeaders: RebateTableHeaderDto[];
}) {
  function Field(props: FieldProps) {
    const _formData = props.formData as RebateTableHeaderFromTemplateCreateDto;
    const selectedRebateTableHeader = rebateTableHeaders.find(
      (item) => item.id === _formData.id,
    );
    const [open, setOpen] = useState(false);
    return (
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button
            className="h-12 w-full justify-start"
            type="button"
            variant="ghost"
          >
            {selectedRebateTableHeader ? (
              <div className="flex items-center gap-2">
                <span>{selectedRebateTableHeader.name}</span>
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
              languageData["Rebate.Form.rebateTableHeadersFromTemplate.title"]
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {languageData["Rebate.Form.rebateTableHeaders.title"]}
            </SheetTitle>
          </SheetHeader>
          <SchemaForm<RebateTableHeaderFromTemplateCreateDto>
            className="h-full p-0 [&>fieldset]:border-0 [&>fieldset]:p-0"
            formData={_formData}
            onSubmit={(data) => {
              props.onChange(data.formData);
              setOpen(false);
            }}
            schema={$RebateTableHeaderFromTemplateCreateDto}
            uiSchema={createUiSchemaWithResource({
              schema: $RebateTableHeaderFromTemplateCreateDto,
              resources: languageData,
              name: "Rebate.Form.rebateTableHeadersFromTemplate",
              extend: {
                displayLabel: false,
                id: {
                  "ui:widget": "RebateTableWidget",
                },
              },
            })}
            useDefaultSubmit={false}
            widgets={{
              RebateTableWidget: RebateTableWidget({
                languageData,
                rebateTableHeaders,
                loading: false,
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

function CreateRebateTableField({
  lang,
  dateFormat,
  languageData,
}: {
  lang: string;
  dateFormat: Intl.DateTimeFormatOptions;
  languageData: ContractServiceResource;
}) {
  function Field(props: FieldProps) {
    const _formData: RebateTableHeaderNotTemplateCreateDto | undefined =
      props.formData as RebateTableHeaderNotTemplateCreateDto;
    const [open, setOpen] = useState(false);
    return (
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button
            className="h-12 w-full justify-start"
            type="button"
            variant="ghost"
          >
            {_formData.name && _formData.validFrom && _formData.validTo ? (
              <div className="flex items-center gap-2">
                <span>{_formData.name}</span>
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
          <RebateForm
            formData={_formData}
            formType="add"
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
