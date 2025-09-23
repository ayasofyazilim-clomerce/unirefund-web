"use client";

import {postTravellerApi} from "@repo/actions/unirefund/TravellerService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {WidgetProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget, CustomSelect} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {UniRefund_TravellerService_Travellers_CreateTravellerDto} from "@repo/saas/TravellerService";
import {$UniRefund_TravellerService_Travellers_CreateTravellerDto} from "@repo/saas/TravellerService";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useMemo, useTransition} from "react";
import type {CountryDto} from "@/utils/address-hook/types";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

type LanguageOption = {cultureName: string; displayName: string};

interface LanguageSelectUiOptions {
  languagesList?: LanguageOption[];
}

function LanguageSelectWidget(props: WidgetProps) {
  const uiOptions = props.uiSchema?.["ui:options"] as LanguageSelectUiOptions | undefined;
  const languagesList = uiOptions?.languagesList ?? [];

  const enumOptions = languagesList.map((l) => ({
    value: l.cultureName,
    label: l.displayName,
  }));

  return (
    <CustomSelect
      {...props}
      options={{enumOptions}}
      uiSchema={{...props.uiSchema, "ui:placeholder": "Select language"}}
    />
  );
}

export default function TravellerNewForm({
  languageData,
  countryList,
  languagesList,
}: {
  languageData: TravellerServiceResource;
  countryList: CountryDto[];
  languagesList: {cultureName: string; displayName: string}[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const CountryWidget = useMemo(
    () =>
      CustomComboboxWidget<CountryDto>({
        languageData,
        list: countryList,
        selectIdentifier: "code2",
        selectLabel: "name",
      }),
    [languageData, countryList],
  );

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_TravellerService_Travellers_CreateTravellerDto,
    resources: languageData,
    extend: {
      "ui:className": "md:grid md:grid-cols-2 border rounded-md md:p-6 p-2 my-6 gap-y-6 gap-x-4",
      "ui:order": [
        "travellerDocument",
        "firstName",
        "lastName",
        "birthDate",
        "nationalityCountryCode2",
        "languagePreferenceCultureName",
        "gender",
      ],

      nationalityCountryCode2: {
        "ui:widget": "countryWidget",
      },
      languagePreferenceCultureName: {
        "ui:widget": "languageSelectWidget",
        "ui:options": {languagesList},
      },

      travellerDocument: {
        "ui:className": "md:grid md:grid-cols-2 md:gap-4 md:col-span-full",
        "ui:order": [
          "identificationType",
          "travelDocumentNumber",
          "firstName",
          "lastName",
          "birthDate",
          "expirationDate",
          "issueDate",
          "residenceCountryCode2",
          "nationalityCountryCode2",
        ],
        residenceCountryCode2: {"ui:widget": "countryWidget"},
        nationalityCountryCode2: {"ui:widget": "countryWidget"},
      },
    },
  });

  return (
    <SchemaForm<UniRefund_TravellerService_Travellers_CreateTravellerDto>
      className="mx-auto flex max-w-6xl flex-col gap-0 p-0"
      defaultSubmitClassName="p-0"
      disabled={isPending}
      id="new-traveller-form"
      onSubmit={({formData}) => {
        startTransition(() => {
          void postTravellerApi({requestBody: formData}).then((res) => {
            handlePostResponse(res, router, "../travellers");
          });
        });
      }}
      schema={$UniRefund_TravellerService_Travellers_CreateTravellerDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      widgets={{
        countryWidget: CountryWidget,
        languageSelectWidget: LanguageSelectWidget,
      }}
    />
  );
}
