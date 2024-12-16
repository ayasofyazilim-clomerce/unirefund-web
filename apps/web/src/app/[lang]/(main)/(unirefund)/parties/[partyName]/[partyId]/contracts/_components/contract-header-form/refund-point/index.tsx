"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type {
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as ContractHeaderForRefundPointCreateDto,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointUpdateDto as ContractHeaderForRefundPointUpdateDto,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaderRefundFeeHeaders_ContractHeaderRefundFeeHeaderCreateAndUpdateDto as ContractHeaderRefundFeeHeaderCreateAndUpdateDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto as RefundFeeHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointCreateDto as $ContractHeaderForRefundPointCreateDto,
  $UniRefund_ContractService_ContractsForRefundPoint_ContractHeaders_ContractHeaderForRefundPointUpdateDto as $ContractHeaderForRefundPointUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressTypeDto } from "@ayasofyazilim/saas/LocationService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type { FieldProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useParams, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { postRefundPointContractHeadersById } from "src/actions/unirefund/ContractService/post-actions";
import { putRefundPointContractHeadersById } from "src/actions/unirefund/ContractService/put-actions";
import {
  handlePostResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import { MerchantAddressWidget, RefundFeeWidget } from "../../contract-widgets";

type RefundPointContractHeaderFormProps = {
  loading: boolean;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  languageData: ContractServiceResource;
  addresses: AddressTypeDto[];
  refundFeeHeaders: RefundFeeHeaderDto[];
} & (
  | RefundPointContractHeaderUpdateFormProps
  | RefundPointContractHeaderCreateFormProps
);
interface RefundPointContractHeaderUpdateFormProps {
  formType: "update";
  contractId: string;
  formData: ContractHeaderForRefundPointUpdateDto;
}
interface RefundPointContractHeaderCreateFormProps {
  formType: "create";
  formData: ContractHeaderForRefundPointCreateDto;
}

export default function RefundPointContractHeaderForm(
  props: RefundPointContractHeaderFormProps,
) {
  const {
    formData,
    loading,
    languageData,
    addresses,
    refundFeeHeaders,
    setLoading,
  } = props;
  const router = useRouter();
  const { partyId, partyName } = useParams<{
    partyId: string;
    partyName: string;
  }>();
  const [formLoading, setFormLoading] = useState(loading || false);
  function handleLoading(_loading: boolean) {
    if (setLoading) setLoading(_loading);
    setFormLoading(_loading);
  }
  const $Schema = {
    create: $ContractHeaderForRefundPointCreateDto,
    update: $ContractHeaderForRefundPointUpdateDto,
  };
  const uiSchema = createUiSchemaWithResource({
    name: "Contracts.Form",
    resources: languageData,
    schema: $Schema[props.formType],
    extend: {
      "ui:options": {
        expandable: false,
      },
      webSite: {
        "ui:className": "md:col-span-full",
        "ui:options": {
          inputType: "url",
        },
      },
      "ui:className": "md:grid md:gap-2 md:grid-cols-2",
      addressCommonDataId: {
        "ui:className": "row-start-2",
        "ui:widget": "address",
      },
      status: {
        "ui:className": "md:col-span-full",
      },
      earlyRefund: {
        "ui:widget": "switch",
      },
      refundFeeHeaders: {
        "ui:className": "md:col-span-full",
        items: {
          "ui:field": "RefundFeeHeadersItemField",
          displayLabel: false,
        },
      },
    },
  });
  return (
    <SchemaForm
      disabled={formLoading || loading}
      fields={{
        RefundFeeHeadersItemField: RefundFeeHeadersItemField({
          loading: formLoading || loading,
          languageData,
          refundFeeHeaders,
        }),
      }}
      filter={{
        type: "include",
        sort: true,
        keys: [
          "validFrom",
          "validTo",
          "merchantClassification",
          "addressCommonDataId",
          "webSite",
          "status",
          "refundFeeHeaders",
          "refundFeeHeaders.validFrom",
          "refundFeeHeaders.validTo",
          "refundFeeHeaders.refundFeeHeaderId",
        ],
      }}
      formData={formData}
      onSubmit={({ formData: submitData }) => {
        if (!submitData) return;
        handleLoading(true);
        if (props.formType === "create") {
          void postRefundPointContractHeadersById({
            id: partyId,
            requestBody: submitData as ContractHeaderForRefundPointCreateDto,
          })
            .then((response) => {
              handlePostResponse(response, router, {
                prefix: `/parties/${partyName}/${partyId}/contracts`,
                suffix: "contract",
                identifier: "id",
              });
            })
            .finally(() => {
              handleLoading(false);
            });
        } else {
          void putRefundPointContractHeadersById({
            id: props.contractId,
            requestBody: submitData as ContractHeaderForRefundPointUpdateDto,
          })
            .then((response) => {
              handlePutResponse(response, router);
            })
            .finally(() => {
              handleLoading(false);
            });
        }
      }}
      schema={$Schema[props.formType]}
      uiSchema={uiSchema}
      widgets={{
        address: MerchantAddressWidget({
          loading: formLoading || loading,
          addressList: addresses,
          languageData,
        }),
      }}
    />
  );
}

function RefundFeeHeadersItemField({
  languageData,
  refundFeeHeaders,
  loading,
}: {
  languageData: ContractServiceResource;
  refundFeeHeaders: RefundFeeHeaderDto[];
  loading: boolean;
}) {
  function Field(props: FieldProps) {
    const [open, setOpen] = useState(false);

    const { schema } = props;
    const _formData: ContractHeaderRefundFeeHeaderCreateAndUpdateDto =
      props.formData as ContractHeaderRefundFeeHeaderCreateAndUpdateDto;
    const hasValue: boolean = Object.keys(props.formData as object).length > 0;
    const [defaultItem, setDefaultItem] = useState<boolean>(
      hasValue ? _formData.isDefault ?? true : props.index === 0,
    );
    const _defaults = {
      validFrom: new Date().toISOString(),
      validTo: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ).toISOString(),
      refundFeeHeaderId:
        refundFeeHeaders.length === 1
          ? refundFeeHeaders.at(0)?.id
          : "00000000-0000-0000-0000-000000000000",
    };
    const uiSchema = createUiSchemaWithResource({
      name: "Contracts.Form",
      resources: languageData,
      schema,
      extend: {
        refundFeeHeaderId: {
          "ui:widget": "refundFee",
          "ui:title":
            languageData["Contracts.Form.refundFeeHeaders.refundFeeHeaderId"],
        },
      },
    });
    return (
      <div
        className="grid w-full grid-cols-2 gap-2 rounded-md p-2"
        key={props.idSchema.$id}
      >
        <div className="relative flex h-9 items-center gap-2 text-nowrap">
          <input
            className="accent-primary"
            defaultChecked={defaultItem}
            disabled={loading}
            id={props.idSchema.$id}
            name="setDefault"
            onChange={(e) => {
              setDefaultItem(e.target.checked);
            }}
            type="radio"
          />
          <Label
            className="absolute inset-0 flex items-center pl-6"
            htmlFor={props.idSchema.$id}
          >
            {languageData.IsDefault}
          </Label>
        </div>
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
                    refundFeeHeaders.find(
                      (x) => x.id === _formData.refundFeeHeaderId,
                    )?.name
                  }
                </div>
              ) : (
                languageData["Contracts.Form.refundFeeHeaders.edit"]
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SchemaForm<ContractHeaderRefundFeeHeaderCreateAndUpdateDto>
              formData={{
                ..._defaults,
                ..._formData,
              }}
              onSubmit={(data) => {
                props.onChange({ ...data.formData, isDefault: defaultItem });
                setOpen(false);
              }}
              schema={props.schema}
              uiSchema={uiSchema}
              widgets={{
                refundFee: RefundFeeWidget({
                  loading,
                  refundFeeHeaders,
                  languageData,
                }),
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
    );
  }
  return Field;
}
