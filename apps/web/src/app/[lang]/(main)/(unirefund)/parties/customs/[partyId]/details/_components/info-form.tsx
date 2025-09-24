"use client";

import type {
  UniRefund_CRMService_Customs_CustomDto as CustomDto,
  UniRefund_CRMService_Customs_UpdateCustomDto as UpdateCustomDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Customs_UpdateCustomDto as $UpdateCustomDto} from "@repo/saas/CRMService";
import {putCustomByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function CustomForm({
  languageData,
  customDetails,
}: {
  languageData: CRMServiceServiceResource;
  customDetails: CustomDto;
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const isHeadquarter = customDetails.typeCode === "HEADQUARTER";
  const disabled = {
    "ui:options": {
      readOnly: true,
      disabled: true,
    },
  };

  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Custom",
    schema: $UpdateCustomDto,
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
      parentId: {
        ...(isHeadquarter && {"ui:widget": "hidden"}),
        ...disabled,
      },
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <SchemaForm<UpdateCustomDto>
      className="sticky top-0 h-fit"
      defaultSubmitClassName="[&>button]:w-full"
      disabled={isPending}
      formData={{
        ...customDetails,
        parentId: customDetails.parentName || "",
        name: customDetails.name || "",
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putCustomByIdApi({
            id: partyId,
            requestBody: {
              ...formData,
              parentId: customDetails.parentId,
            },
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={{
        ...$UpdateCustomDto,
        properties: {
          ...$UpdateCustomDto.properties,
          parentId: {
            type: "string",
          },
        },
      }}
      submitText={languageData["Form.Custom.Update"]}
      uiSchema={uiSchema}
      withScrollArea={false}
    />
  );
}
