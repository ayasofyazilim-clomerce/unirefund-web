"use client";

import type {
  UniRefund_CRMService_TaxOffices_UpdateTaxOfficeDto as UpdateTaxOfficeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_TaxOffices_UpdateTaxOfficeDto as $UpdateTaxOfficeDto} from "@repo/saas/CRMService";
import {putTaxOfficeByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function TaxOfficeForm({
  languageData,
  taxOfficeDetails,
}: {
  languageData: CRMServiceServiceResource;
  taxOfficeDetails: TaxOfficeDto;
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const isHeadquarter = taxOfficeDetails.typeCode === "HEADQUARTER";
  const disabled = {
    "ui:options": {
      readOnly: true,
      disabled: true,
    },
  };
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.TaxOffice",
    schema: $UpdateTaxOfficeDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end",
      name: {
        ...(isHeadquarter && {"ui:className": "col-span-full"}),
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
    <SchemaForm<UpdateTaxOfficeDto>
      className="top-0 h-fit lg:sticky"
      defaultSubmitClassName="[&>button]:w-full"
      disabled={isPending}
      formData={{
        ...taxOfficeDetails,
        name: taxOfficeDetails.name || "",
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putTaxOfficeByIdApi({
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
        ...$UpdateTaxOfficeDto,
        properties: {
          ...$UpdateTaxOfficeDto.properties,
        },
      }}
      submitText={languageData["Form.TaxOffice.Update"]}
      uiSchema={uiSchema}
      withScrollArea={false}
    />
  );
}
