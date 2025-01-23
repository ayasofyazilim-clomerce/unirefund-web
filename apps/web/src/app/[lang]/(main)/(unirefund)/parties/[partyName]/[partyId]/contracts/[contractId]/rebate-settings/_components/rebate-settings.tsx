"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  $UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as $RebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderInformationDto as AssignableRebateTableHeaders,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingDto as RebateSettingDto,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as RebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeadersToRebateSettingUpSertDto as RebateTableHeadersToRebateSettingUpSertDto,
} from "@ayasofyazilim/saas/ContractService";
import type {
  UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto as AffiliationTypeDetailDto,
  // UniRefund_CRMService_Merchants_StoreProfileDto as StoreProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type { FieldProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postMerchantContractHeaderRebateSettingByHeaderIdApi } from "src/actions/unirefund/ContractService/post-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { getBaseLink } from "src/utils";
import { RebateTableWidget } from "../../../_components/contract-widgets";

export function RebateSettings({
  languageData,
  rebateSettings,
  rebateTableHeaders,
  // subMerchants,
  individuals,
  contractId,
  // lang,
  fromDate,
}: {
  languageData: ContractServiceResource;
  rebateSettings: RebateSettingDto | undefined;
  rebateTableHeaders: AssignableRebateTableHeaders[];
  // subMerchants: StoreProfileDto[];
  individuals: AffiliationTypeDetailDto[];
  contractId: string;
  // lang: string;
  fromDate?: Date | undefined;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const uiSchema = createUiSchemaWithResource({
    schema: $RebateSettingUpSertDto,
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
  return (
    <SchemaForm<RebateSettingUpSertDto>
      disabled={loading}
      fields={{
        CreateRebateTableField: RebateTableHeadersItemField({
          loading,
          languageData,
          rebateTableHeaders,
          fromDate,
        }),
      }}
      formData={
        rebateSettings
          ? {
              ...rebateSettings,
              rebateTableHeaders: rebateSettings.rebateTableHeaders?.map(
                (rebateTableHeader) => ({
                  ...rebateTableHeader,
                  rebateTableHeaderId: rebateTableHeader.id,
                }),
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
      schema={$RebateSettingUpSertDto}
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

function RebateTableHeadersItemField({
  languageData,
  rebateTableHeaders,
  loading,
  fromDate,
}: {
  languageData: ContractServiceResource;
  rebateTableHeaders: AssignableRebateTableHeaders[];
  loading: boolean;
  fromDate?: Date | undefined;
}) {
  function Field(props: FieldProps) {
    const [open, setOpen] = useState(false);

    const { schema } = props;
    const _formData: RebateTableHeadersToRebateSettingUpSertDto =
      props.formData as RebateTableHeadersToRebateSettingUpSertDto;
    const hasValue: boolean = Object.keys(props.formData as object).length > 0;
    // const [defaultItem, setDefaultItem] = useState<boolean>(
    //   hasValue ? _formData.isDefault ?? true : props.index === 0,
    // );

    const uiSchema = createUiSchemaWithResource({
      name: "Contracts.Form",
      resources: languageData,
      schema,
      extend: {
        refundTableHeaderId: {
          "ui:widget": "refundTable",
          "ui:title":
            languageData[
              "Contracts.Form.refundTableHeaders.refundTableHeaderId"
            ],
        },
        validFrom: {
          "ui:options": {
            fromDate,
          },
        },
      },
    });
    const [selectedRebateTableHeader, setSelectedRebateTableHeader] = useState(
      _formData.rebateTableHeaderId,
    );
    return (
      <div className="w-full rounded-md p-2" key={props.idSchema.$id}>
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button
              className="w-full"
              disabled={loading}
              type="button"
              variant="outline"
            >
              {hasValue ? (
                <div>
                  {
                    rebateTableHeaders.find(
                      (x) => x.id === _formData.rebateTableHeaderId,
                    )?.name
                  }
                </div>
              ) : (
                languageData["Contracts.Form.refundTableHeaders.edit"]
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SchemaForm<RebateTableHeadersToRebateSettingUpSertDto>
              formData={_formData}
              onChange={({ formData }) => {
                if (!formData) return;
                setSelectedRebateTableHeader(formData.rebateTableHeaderId);
              }}
              onSubmit={({ formData }) => {
                props.onChange(formData);
                setOpen(false);
              }}
              schema={props.schema}
              uiSchema={uiSchema}
              useDefaultSubmit={false}
              widgets={{
                refundTable: RebateTableWidget({
                  loading,
                  rebateTableHeaders,
                  languageData,
                }),
              }}
            >
              <div className="mt-2 flex w-full justify-end gap-2">
                <Button asChild variant="outline">
                  <Link
                    href={getBaseLink(
                      `settings/templates/rebate-tables/${selectedRebateTableHeader}`,
                    )}
                  >
                    {languageData.Edit}
                  </Link>
                </Button>
                <Button>{languageData.Save}</Button>
              </div>
            </SchemaForm>
          </SheetContent>
        </Sheet>
      </div>
    );
  }
  return Field;
}
