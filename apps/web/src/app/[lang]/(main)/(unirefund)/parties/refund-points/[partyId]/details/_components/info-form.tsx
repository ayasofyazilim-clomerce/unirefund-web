"use client";

import type {
  UniRefund_CRMService_RefundPoints_RefundPointDto as RefundPointDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
  UniRefund_CRMService_RefundPoints_UpdateRefundPointDto as UpdateRefundPointDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_RefundPoints_UpdateRefundPointDto as $UpdateRefundPointDto} from "@repo/saas/CRMService";
import {putRefundPointByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function RefundPointForm({
  languageData,
  refundPointDetails,
  taxOffices,
}: {
  languageData: CRMServiceServiceResource;
  refundPointDetails: RefundPointDto;
  taxOffices: TaxOfficeDto[];
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const isHeadquarter = refundPointDetails.parentId === null || typeof refundPointDetails.parentId === "undefined";
  const disabled = {
    "ui:options": {
      readOnly: true,
      disabled: true,
    },
  };
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.RefundPoint",
    schema: $UpdateRefundPointDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end",
      name: {
        ...(isHeadquarter && {"ui:className": "col-span-full"}),
      },
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
      vatNumber: {
        ...(!isHeadquarter && disabled),
      },
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <SchemaForm<UpdateRefundPointDto>
      className="top-0 h-fit lg:sticky"
      defaultSubmitClassName="[&>button]:w-full"
      disabled={isPending}
      formData={{
        ...refundPointDetails,
        name: refundPointDetails.name || "",
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putRefundPointByIdApi({
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
        ...$UpdateRefundPointDto,
        properties: {
          ...$UpdateRefundPointDto.properties,
        },
      }}
      submitText={languageData["Form.RefundPoint.Update"]}
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
