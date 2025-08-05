"use client";

import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {
  $UniRefund_CRMService_TaxOffices_UpdateTaxOfficeDto as $UpdateTaxOfficeDto,
  UniRefund_CRMService_TaxOffices_UpdateTaxOfficeDto as UpdateTaxOfficeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putTaxOfficeByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";

export function TaxOfficeForm({
  languageData,
  taxOfficeDetails,
}: {
  languageData: CRMServiceServiceResource;
  taxOfficeDetails: TaxOfficeDto;
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.TaxOffice",
    schema: $UpdateTaxOfficeDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end",
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
    <SchemaForm<UpdateTaxOfficeDto>
      className="sticky top-0 h-fit"
      schema={{
        ...$UpdateTaxOfficeDto,
        properties: {
          ...$UpdateTaxOfficeDto.properties,
          parentId: {
            type: "string",
          },
        },
      }}
      locale={lang}
      formData={{
        ...taxOfficeDetails,
        parentId: taxOfficeDetails.parentName || "",
        name: taxOfficeDetails.name!,
      }}
      disabled={isPending}
      withScrollArea={false}
      defaultSubmitClassName="[&>button]:w-full"
      submitText={languageData["Form.TaxOffice.Update"]}
      uiSchema={uiSchema}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putTaxOfficeByIdApi({
            taxOfficeId: partyId,
            requestBody: {
              ...formData,
              parentId: taxOfficeDetails.parentId,
            },
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
    />
  );
}
