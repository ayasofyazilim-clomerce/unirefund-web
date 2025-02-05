"use client";
import type {
  UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
} from "@ayasofyazilim/saas/TravellerService";
import {$UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto} from "@ayasofyazilim/saas/TravellerService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {AutoFormSubmit, createFieldConfigWithResource} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "src/actions/core/api-utils-client";
import {putTravellerPersonalSummaryApi} from "src/actions/unirefund/TravellerService/put-actions";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

const updatPersonalSummarySchema = createZodObject(
  $UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
);

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

  const translatedPersonalSummaryForm = createFieldConfigWithResource({
    schema: $UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
    resources: languageData,
    name: "Form.Summary",
  });
  const [isPending, startTransition] = useTransition();

  function updateTravellerPersonalSummary(data: UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto) {
    startTransition(() => {
      void putTravellerPersonalSummaryApi({
        id: travellerId,
        requestBody: data,
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  }

  return (
    <AutoForm
      fieldConfig={translatedPersonalSummaryForm}
      formSchema={updatPersonalSummarySchema}
      onSubmit={(values) => {
        updateTravellerPersonalSummary(values as UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto);
      }}
      values={{
        genderTypeCode: travellerData.gender,
      }}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData["Edit.Save"]}
      </AutoFormSubmit>
    </AutoForm>
  );
}
