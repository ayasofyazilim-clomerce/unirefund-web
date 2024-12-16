"use client";

import type {
  UniRefund_CRMService_Individuals_IndividualDto,
  UniRefund_CRMService_Organizations_OrganizationDto,
} from "@ayasofyazilim/saas/CRMService";
import AutoForm, {
  AutoFormSubmit,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { putCrmAddressApi } from "src/actions/unirefund/CrmService/put-actions";
import type {
  AddressUpdateDto,
  CountryDto,
  SelectedAddressField,
} from "src/actions/unirefund/LocationService/types";
import { useAddressHook } from "src/actions/unirefund/LocationService/use-address-hook.tsx";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { PartyNameType } from "../../../types";

function Address({
  languageData,
  partyName,
  countryList,
  partyId,
  organizationData,
}: {
  languageData: CRMServiceServiceResource;
  partyName: Exclude<PartyNameType, "individuals">;
  partyId: string;
  countryList: CountryDto[];
  organizationData:
    | UniRefund_CRMService_Organizations_OrganizationDto
    | UniRefund_CRMService_Individuals_IndividualDto
    | undefined;
}) {
  const router = useRouter();
  const addressData =
    organizationData?.contactInformations?.[0]?.addresses?.[0];
  const selectedFieldsDefaultValue: SelectedAddressField = {
    countryId: addressData?.countryId || "",
    regionId: addressData?.regionId || "",
    cityId: addressData?.cityId || "",
  };

  const {
    addressSchema,
    selectedFields,
    addressSchemaFieldConfig,
    onAddressValueChanged,
  } = useAddressHook({
    countryList,
    selectedFieldsDefaultValue,
    fieldsToHideInAddressSchema: ["districtId"],
    languageData,
  });

  const addressValues = {
    ...addressData,
    ...selectedFields,
  };

  function handleSubmit(formData: AddressUpdateDto) {
    void putCrmAddressApi(partyName, {
      requestBody: formData,
      id: partyId,
      addressId: addressValues.id || "",
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }

  return (
    <SectionLayoutContent sectionId="address">
      <AutoForm
        fieldConfig={addressSchemaFieldConfig}
        formClassName="pb-40"
        formSchema={addressSchema}
        onSubmit={(values) => {
          const formData = {
            ...values,
            ...selectedFields,
          } as AddressUpdateDto;
          handleSubmit(formData);
        }}
        onValuesChange={(values) => {
          onAddressValueChanged(values);
        }}
        values={addressValues}
      >
        <AutoFormSubmit className="float-right">
          {languageData.Save}
        </AutoFormSubmit>
      </AutoForm>
    </SectionLayoutContent>
  );
}

export default Address;
