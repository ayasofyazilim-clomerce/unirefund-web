"use client";

import type {GetApiCrmServiceMerchantsByIdAddressesResponse} from "@ayasofyazilim/saas/CRMService";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putTaxOfficeAddressApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {AddressUpdateDto, CountryDto, SelectedAddressField} from "@/utils/address-hook/types";
import {useAddressHook} from "@/utils/address-hook/use-address-hook.tsx";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function AddressForm({
  languageData,
  countryList,
  partyId,
  addressResponse,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  countryList: CountryDto[];
  addressResponse: GetApiCrmServiceMerchantsByIdAddressesResponse;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const addressData = addressResponse[0];
  const selectedFieldsDefaultValue: SelectedAddressField = {
    countryId: addressData.countryId || "",
    regionId: addressData.regionId || "",
    cityId: addressData.cityId || "",
    districtId: addressData.districtId || "",
    neighborhoodId: addressData.neighborhoodId || "",
  };

  const {addressSchema, selectedFields, addressSchemaFieldConfig, onAddressValueChanged} = useAddressHook({
    countryList,
    selectedFieldsDefaultValue,
    fieldsToHideInAddressSchema: [],
    languageData,
  });

  const addressValues = {
    ...addressData,
    ...selectedFields,
  };

  function handleSubmit(formData: AddressUpdateDto) {
    startTransition(() => {
      void putTaxOfficeAddressApi({
        requestBody: formData,
        id: partyId,
        addressId: addressData.id || "",
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  }

  return (
    <AutoForm
      className="grid grid-cols-1 items-center justify-center gap-4 space-y-0 pt-6 md:grid-cols-2 lg:grid-cols-3 [&>div]:flex [&>div]:flex-col"
      fieldConfig={addressSchemaFieldConfig}
      formSchema={addressSchema}
      onSubmit={(values) => {
        const formData = {
          ...values,
          ...selectedFields,
          type: "Office",
        } as AddressUpdateDto;
        handleSubmit(formData);
      }}
      onValuesChange={(values) => {
        onAddressValueChanged(values);
      }}
      values={addressValues}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default AddressForm;
