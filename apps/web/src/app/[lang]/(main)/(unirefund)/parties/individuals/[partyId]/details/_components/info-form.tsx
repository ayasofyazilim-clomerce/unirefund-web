"use client";

import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {
  $UniRefund_CRMService_Individuals_UpdateIndividualDto as $UpdateIndividualDto,
  UniRefund_CRMService_Individuals_UpdateIndividualDto as UpdateIndividualDto,
  UniRefund_CRMService_Individuals_IndividualDto as IndividualDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putIndividualByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";

export function IndividualForm({
  languageData,
  individualDetails,
}: {
  languageData: CRMServiceServiceResource;
  individualDetails: IndividualDto;
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Individual",
    schema: $UpdateIndividualDto,
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
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <SchemaForm<UpdateIndividualDto>
      className="sticky top-0 h-fit"
      schema={$UpdateIndividualDto}
      locale={lang}
      formData={individualDetails}
      disabled={isPending}
      withScrollArea={false}
      defaultSubmitClassName="[&>button]:w-full"
      submitText={languageData["Form.Individual.Update"]}
      uiSchema={uiSchema}
      onSubmit={({formData}) => {
        if (!formData) return;
        console.log("formData", formData);
        startTransition(() => {
          void putIndividualByIdApi({
            individualId: partyId,
            requestBody: formData,
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
    />
  );
}
