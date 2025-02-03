"use client";
import type {
  UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
} from "@ayasofyazilim/saas/TravellerService";
import { $UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto } from "@ayasofyazilim/saas/TravellerService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putTravellerPersonalPreferenceApi } from "src/actions/unirefund/TravellerService/put-actions";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";

const updatPersonalPreferenceSchema = createZodObject(
  $UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
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

  const translatedPersonalPreferenceForm = createFieldConfigWithResource({
    schema:
      $UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
    resources: languageData,
  });
  const [isPending, startTransition] = useTransition();

  function updateTravellerPersonalPreference(
    data: UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
  ) {
    startTransition(() => {
      void putTravellerPersonalPreferenceApi({
        id: travellerId,
        requestBody: data,
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  }

  return (
    <AutoForm
      fieldConfig={translatedPersonalPreferenceForm}
      formSchema={updatPersonalPreferenceSchema}
      onSubmit={(values) => {
        updateTravellerPersonalPreference(
          values as UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
        );
      }}
      values={{
        languagePreferenceCode: travellerData.languagePreferenceCode,
      }}
    >
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData["Edit.Save"]}
      </AutoFormSubmit>
    </AutoForm>
  );
}
