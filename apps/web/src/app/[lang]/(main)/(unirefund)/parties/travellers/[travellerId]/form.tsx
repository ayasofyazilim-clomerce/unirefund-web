"use client";
import type {
  UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
  UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
} from "@ayasofyazilim/saas/TravellerService";
import {
  $UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
  $UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
} from "@ayasofyazilim/saas/TravellerService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {
  SectionLayout,
  SectionLayoutContent,
} from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useParams, useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import {
  putTravellerPersonalPreferenceApi,
  putTravellerPersonalSummaryApi,
} from "src/actions/unirefund/TravellerService/put-actions";
import useGrantedPolicies from "src/hooks/use-granted-policies";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";
import { tableData } from "./identification-table-data";

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

  const updatPersonalPreferenceSchema = createZodObject(
    $UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
  );

  const updatPersonalSummarySchema = createZodObject(
    $UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
  );

  const translatedPersonalPreferenceForm = createFieldConfigWithResource({
    schema:
      $UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
    resources: languageData,
  });

  const translatedPersonalSummaryForm = createFieldConfigWithResource({
    schema:
      $UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
    resources: languageData,
    name: "Form.Summary",
  });
  const grantedPolicies = useGrantedPolicies();
  const { lang } = useParams<{ lang: string }>();
  const columns = tableData.identifications.columns(
    lang,
    languageData,
    grantedPolicies,
    travellerId,
  );
  const table = tableData.identifications.table(
    languageData,
    router,
    grantedPolicies,
    travellerId,
  );

  function updateTravellerPersonalPreference(
    data: UniRefund_TravellerService_PersonalPreferencesTypes_UpsertPersonalPreferenceDto,
  ) {
    void putTravellerPersonalPreferenceApi({
      id: travellerId,
      requestBody: data,
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }

  function updateTravellerPersonalSummary(
    data: UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
  ) {
    void putTravellerPersonalSummaryApi({
      id: travellerId,
      requestBody: data,
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }

  return (
    <SectionLayout
      sections={[
        {
          name: languageData["Travellers.Personal.Identifications"],
          id: "identifications",
        },
        {
          name: languageData["Travellers.Personal.Preferences"],
          id: "preferences",
        },
        { name: languageData["Travellers.Personal.Summary"], id: "summary" },
      ]}
      vertical
    >
      <SectionLayoutContent sectionId="identifications">
        <TanstackTable
          {...table}
          columns={columns}
          data={travellerData.personalIdentifications}
          rowCount={travellerData.personalIdentifications.length || 0}
        />
      </SectionLayoutContent>

      <SectionLayoutContent sectionId="preferences">
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
          <AutoFormSubmit className="float-right">
            {languageData["Edit.Save"]}
          </AutoFormSubmit>
        </AutoForm>
      </SectionLayoutContent>
      <SectionLayoutContent sectionId="summary">
        <AutoForm
          fieldConfig={translatedPersonalSummaryForm}
          formSchema={updatPersonalSummarySchema}
          onSubmit={(values) => {
            updateTravellerPersonalSummary(
              values as UniRefund_TravellerService_PersonalSummaries_UpsertPersonalSummaryDto,
            );
          }}
          values={{
            genderTypeCode: travellerData.gender,
          }}
        >
          <AutoFormSubmit className="float-right">
            {languageData["Edit.Save"]}
          </AutoFormSubmit>
        </AutoForm>
      </SectionLayoutContent>
    </SectionLayout>
  );
}
