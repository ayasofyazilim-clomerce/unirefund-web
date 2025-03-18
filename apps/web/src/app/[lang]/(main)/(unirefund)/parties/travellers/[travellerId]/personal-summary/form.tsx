"use client";
import type {
  UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
} from "@ayasofyazilim/saas/TravellerService";
import {$UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto} from "@ayasofyazilim/saas/TravellerService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putTravellerPersonalSummaryApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

export default function Page({
  languageData,
  travellerId,
  travellerData,
}: {
  languageData: TravellerServiceResource;
  travellerId: string;
  travellerData: UniRefund_TravellerService_Travellers_TravellerDetailProfileDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
    resources: languageData,
    name: "Form.Summary",
  });

  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={isPending}
      formData={{
        genderTypeCode: travellerData.gender,
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putTravellerPersonalSummaryApi({
            id: travellerId,
            requestBody: formData as UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={$UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}
