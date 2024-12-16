"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type {
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantCreateDto as ContractHeaderForMerchantCreateDto,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantUpdateDto as ContractHeaderForMerchantUpdateDto,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaderRefundTableHeaders_ContractHeaderRefundTableHeaderCreateAndUpdateDto as ContractHeaderRefundTableHeaderCreateAndUpdateDto,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto as RefundTableHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantCreateDto as $ContractHeaderForMerchantCreateDto,
  $UniRefund_ContractService_ContractsForMerchant_ContractHeaders_ContractHeaderForMerchantUpdateDto as $ContractHeaderForMerchantUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressTypeDto } from "@ayasofyazilim/saas/LocationService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type { FieldProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useParams, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  handlePostResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { postMerchantContractHeadersByMerchantIdApi } from "src/actions/unirefund/ContractService/action";
import { putMerchantContractHeadersByIdApi } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import {
  MerchantAddressWidget,
  RefundTableWidget,
} from "../../contract-widgets";

type ContractHeaderFormProps = {
  languageData: ContractServiceResource;
  addresses: AddressTypeDto[];
  refundTableHeaders: RefundTableHeaderDto[];
  loading: boolean;
  setLoading?: Dispatch<SetStateAction<boolean>>;
} & (CreateContractHeaderFormProps | UpdateContractHeaderFormProps);

interface CreateContractHeaderFormProps {
  formType: "create";
}
interface UpdateContractHeaderFormProps {
  formType: "update";
  formData: ContractHeaderForMerchantUpdateDto;
  contractId: string;
}

export default function MerchantContractHeaderForm(
  props: ContractHeaderFormProps,
): JSX.Element {
  const { languageData, addresses, refundTableHeaders, loading, setLoading } =
    props;
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
    create: $ContractHeaderForMerchantCreateDto,
    update: $ContractHeaderForMerchantUpdateDto,
  };
  const formData = {
    create: {},
    update: props.formType === "update" && props.formData,
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
      refundTableHeaders: {
        "ui:className": "md:col-span-full",
        items: {
          "ui:field": "RefundTableHeadersItemField",
          displayLabel: false,
        },
      },
    },
  });

  return (
    <SchemaForm
      className="grid gap-2"
      disabled={formLoading || loading}
      fields={{
        RefundTableHeadersItemField: RefundTableHeadersItemField({
          loading,
          languageData,
          refundTableHeaders,
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
          "refundTableHeaders",
          "refundTableHeaders.validFrom",
          "refundTableHeaders.validTo",
          "refundTableHeaders.refundTableHeaderId",
        ],
      }}
      formData={formData[props.formType]}
      onSubmit={(data) => {
        if (!data.formData) return;
        handleLoading(true);
        if (props.formType === "create") {
          void postMerchantContractHeadersByMerchantIdApi({
            id: partyId,
            requestBody: data.formData as ContractHeaderForMerchantCreateDto,
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
          void putMerchantContractHeadersByIdApi({
            id: props.contractId,
            requestBody: data.formData as ContractHeaderForMerchantUpdateDto,
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
      submitText={languageData["Contracts.Create.Submit"]}
      uiSchema={uiSchema}
      widgets={{
        address: MerchantAddressWidget({
          loading,
          addressList: addresses,
          languageData,
        }),
      }}
      withScrollArea
    />
  );
}

function RefundTableHeadersItemField({
  languageData,
  refundTableHeaders,
  loading,
}: {
  languageData: ContractServiceResource;
  refundTableHeaders: RefundTableHeaderDto[];
  loading: boolean;
}) {
  function Field(props: FieldProps) {
    const [open, setOpen] = useState(false);

    const { schema } = props;
    const _formData: ContractHeaderRefundTableHeaderCreateAndUpdateDto =
      props.formData as ContractHeaderRefundTableHeaderCreateAndUpdateDto;
    const hasValue: boolean = Object.keys(props.formData as object).length > 0;
    const [defaultItem, setDefaultItem] = useState<boolean>(
      hasValue ? _formData.isDefault ?? true : props.index === 0,
    );

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
                    refundTableHeaders.find(
                      (x) => x.id === _formData.refundTableHeaderId,
                    )?.name
                  }
                </div>
              ) : (
                languageData["Contracts.Form.refundTableHeaders.edit"]
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SchemaForm<ContractHeaderRefundTableHeaderCreateAndUpdateDto>
              formData={_formData}
              onSubmit={(data) => {
                props.onChange({ ...data.formData, isDefault: defaultItem });
                setOpen(false);
              }}
              schema={props.schema}
              uiSchema={uiSchema}
              widgets={{
                refundTable: RefundTableWidget({
                  loading,
                  refundTableHeaders,
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
