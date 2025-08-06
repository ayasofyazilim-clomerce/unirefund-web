"use client";

import {cn} from "@/lib/utils";
import type {
  UniRefund_CRMService_Merchants_UpdateMerchantDto as UpdateMerchantDto,
  UniRefund_CRMService_Merchants_MerchantDto as MerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {$UniRefund_CRMService_Merchants_UpdateMerchantDto as $UpdateMerchantDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putMerchantByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function MerchantForm({
  languageData,
  merchantDetails,
  taxOffices,
}: {
  languageData: CRMServiceServiceResource;
  merchantDetails: MerchantDto;
  taxOffices: TaxOfficeDto[];
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Merchant",
    schema: $UpdateMerchantDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end",
      taxOfficeId: {
        "ui:widget": "taxOfficeWidget",
      },
      isPersonalCompany: {
        "ui:widget": "switch",
        "ui:className": cn(
          "border px-2 rounded-md",
          merchantDetails.typeCode === "STORE" ? "col-span-full" : "col-span-1",
        ),
      },
      telephone: {
        "ui:className": "col-span-full",
        "ui:field": "phone",
      },
      address: {
        "ui:field": "address",
      },
      email: {
        "ui:className": "col-span-full",
        "ui:field": "email",
      },
      typeCode: {
        "ui:options": {
          readOnly: true,
          disabled: true,
        },
      },
      parentId: {
        "ui:options": {
          readOnly: true,
          disabled: true,
        },
      },
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <SchemaForm<UpdateMerchantDto>
      className="sticky top-0 h-fit"
      defaultSubmitClassName="[&>button]:w-full"
      disabled={isPending}
      filter={merchantDetails.typeCode === "STORE" ? {type: "exclude", keys: ["vatNumber"]} : undefined}
      formData={{
        ...merchantDetails,
        parentId: merchantDetails.parentName || "",
        name: merchantDetails.name || "",
        typeCode: merchantDetails.typeCode || "HEADQUARTER",
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putMerchantByIdApi({
            merchantId: partyId,
            requestBody: {
              ...formData,
              parentId: merchantDetails.parentId,
            },
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={{
        ...$UpdateMerchantDto,
        properties: {
          ...$UpdateMerchantDto.properties,
          parentId: {
            type: "string",
          },
        },
      }}
      submitText={languageData["Form.Merchant.Update"]}
      uiSchema={uiSchema}
      widgets={{
        taxOfficeWidget: CustomComboboxWidget<TaxOfficeDto>({
          languageData,
          list: taxOffices,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
      withScrollArea={false}
    />
  );
}
