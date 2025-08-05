"use client";

import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {
  $UniRefund_CRMService_Customs_UpdateCustomDto as $UpdateCustomDto,
  UniRefund_CRMService_Customs_CustomDto as CustomDto,
  UniRefund_CRMService_Customs_UpdateCustomDto as UpdateCustomDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putCustomByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";

export function CustomForm({
  languageData,
  customDetails,
}: {
  languageData: CRMServiceServiceResource;
  customDetails: CustomDto;
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Custom",
    schema: $UpdateCustomDto,
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
    <SchemaForm<UpdateCustomDto>
      className="sticky top-0 h-fit"
      schema={{
        ...$UpdateCustomDto,
        properties: {
          ...$UpdateCustomDto.properties,
          parentId: {
            type: "string",
          },
        },
      }}
      locale={lang}
      formData={{
        ...customDetails,
        parentId: customDetails.parentName || "",
        name: customDetails.name!,
      }}
      disabled={isPending}
      withScrollArea={false}
      defaultSubmitClassName="[&>button]:w-full"
      submitText={languageData["Form.Custom.Update"]}
      uiSchema={uiSchema}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putCustomByIdApi({
            customId: partyId,
            requestBody: {
              ...formData,
              parentId: customDetails.parentId,
            },
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
    />
  );
}
