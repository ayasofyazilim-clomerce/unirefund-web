"use client";

import type {UniRefund_CRMService_Individuals_CreateIndividualDto} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postIndividualsWithComponentsApi} from "src/actions/unirefund/CrmService/post-actions";
import type {CountryDto, SelectedAddressField} from "src/actions/unirefund/LocationService/types";
import {useAddressHook} from "src/actions/unirefund/LocationService/use-address-hook.tsx";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {isPhoneValid, splitPhone} from "src/utils/utils-phone";
import type {CreateIndividualSchema} from "./data";
import {$UniRefund_CRMService_Individuals_CreateIndividualFormDto, individualFormSubPositions} from "./data";

export default function IndividualForm({
  countryList,
  languageData,
}: {
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectedFieldsDefaultValue: SelectedAddressField = {
    countryId: "",
    regionId: "",
    cityId: "",
    neighborhoodId: "",
    districtId: "",
  };

  const {selectedFields, addressFieldsToShow, addressSchemaFieldConfig, onAddressValueChanged} = useAddressHook({
    countryList,
    selectedFieldsDefaultValue,
    fieldsToHideInAddressSchema: [],
    languageData,
  });

  const $createIndividualSchema = createZodObject(
    $UniRefund_CRMService_Individuals_CreateIndividualFormDto,
    ["name", "personalSummaries", "address", "telephone", "email"],
    undefined,
    {...individualFormSubPositions, address: addressFieldsToShow},
  );

  function handleSaveIndividual(formData: CreateIndividualSchema) {
    const isValid = isPhoneValid(formData.telephone.localNumber);
    if (!isValid) {
      return;
    }
    const phoneData = splitPhone(formData.telephone.localNumber);
    formData.telephone = {...formData.telephone, ...phoneData};
    const createData: UniRefund_CRMService_Individuals_CreateIndividualDto = {
      name: formData.name,
      personalSummaries: [formData.personalSummaries],
      createAbpUserAccount: true,
      contactInformations: [
        {
          telephones: [
            {
              ...formData.telephone,
              primaryFlag: true,
              typeCode: "OFFICE",
            },
          ],
          emails: [{...formData.email, primaryFlag: true, typeCode: "WORK"}],
          addresses: [
            {
              ...formData.address,
              ...selectedFields,
              primaryFlag: true,
              type: "Office",
            },
          ],
        },
      ],
    };

    startTransition(() => {
      void postIndividualsWithComponentsApi({
        requestBody: createData,
      }).then((res) => {
        handlePostResponse(res, router, {
          prefix: "/parties/individuals",
          identifier: "id",
          suffix: "details/name",
        });
      });
    });
  }

  return (
    <AutoForm
      className="grid gap-2 space-y-0 md:grid-cols-2 lg:grid-cols-3"
      fieldConfig={{
        email: {
          emailAddress: {
            inputProps: {
              type: "email",
            },
          },
        },
        address: {...addressSchemaFieldConfig, className: "row-span-1"},
        telephone: {
          localNumber: {
            fieldType: "phone",
            displayName: languageData.Telephone,
            inputProps: {
              showLabel: true,
            },
          },
        },
      }}
      formSchema={$createIndividualSchema}
      onSubmit={(formData) => {
        handleSaveIndividual(formData as CreateIndividualSchema);
      }}
      onValuesChange={(values) => {
        onAddressValueChanged(values);
      }}
      stickyChildren
      stickyChildrenClassName="sticky px-6">
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}
