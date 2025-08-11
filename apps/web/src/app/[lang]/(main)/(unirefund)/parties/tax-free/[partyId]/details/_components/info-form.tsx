"use client";

import type {
  UniRefund_CRMService_TaxFrees_UpdateTaxFreeDto as UpdateTaxFreeDto,
  UniRefund_CRMService_TaxFrees_TaxFreeDto as TaxFreeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {$UniRefund_CRMService_TaxFrees_UpdateTaxFreeDto as $UpdateTaxFreeDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putTaxFreeByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function TaxFreeForm({
  languageData,
  taxFreeDetails,
  taxOffices,
}: {
  languageData: CRMServiceServiceResource;
  taxFreeDetails: TaxFreeDto;
  taxOffices: TaxOfficeDto[];
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.TaxFree",
    schema: $UpdateTaxFreeDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end",
      taxOfficeId: {
        "ui:widget": "taxOfficeWidget",
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
    <SchemaForm<UpdateTaxFreeDto>
      className="sticky top-0 h-fit"
      defaultSubmitClassName="[&>button]:w-full"
      disabled={isPending}
      formData={{
        ...taxFreeDetails,
        parentId: taxFreeDetails.parentName || "",
        name: taxFreeDetails.name || "",
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putTaxFreeByIdApi({
            taxFreeId: partyId,
            requestBody: {
              ...formData,
              parentId: taxFreeDetails.parentId,
            },
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={{
        ...$UpdateTaxFreeDto,
        properties: {
          ...$UpdateTaxFreeDto.properties,
          parentId: {
            type: "string",
          },
        },
      }}
      submitText={languageData["Form.TaxFree.Update"]}
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
