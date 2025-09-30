"use client";

import {cn} from "@/lib/utils";
import type {
  UniRefund_CRMService_Merchants_UpdateMerchantDto as UpdateMerchantDto,
  UniRefund_CRMService_Merchants_MerchantDto as MerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Merchants_UpdateMerchantDto as $UpdateMerchantDto} from "@repo/saas/CRMService";
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
  const isHeadquarter = merchantDetails.typeCode === "HEADQUARTER";
  const disabled = {
    "ui:options": {
      readOnly: true,
      disabled: true,
    },
  };

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
      vatNumber: {
        ...(!isHeadquarter && disabled),
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
      formData={{
        ...merchantDetails,
        name: merchantDetails.name || "",
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putMerchantByIdApi({
            id: partyId,
            requestBody: {
              ...formData,
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
