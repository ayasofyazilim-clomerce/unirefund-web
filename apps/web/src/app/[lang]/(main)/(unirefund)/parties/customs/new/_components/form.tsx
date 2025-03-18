"use client";

import type {UniRefund_CRMService_Customss_CreateCustomsDto} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postCustomsWithComponentsApi} from "@repo/actions/unirefund/CrmService/post-actions";
import type {CountryDto, SelectedAddressField} from "@/utils/address-hook/types";
import {useAddressHook} from "@/utils/address-hook/use-address-hook.tsx";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {isPhoneValid, splitPhone} from "src/utils/utils-phone";
import type {CreateCustomOrganizationSchema} from "./data";
import {
  $UniRefund_CRMService_Customs_CreateCustomsOrganizationFormDto,
  CustomOrganizationFormSubPositions,
} from "./data";

export default function CustomsOrganizationForm({
  countryList,
  languageData,
}: {
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const parentId = searchParams.get("parentId");

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

  const $createCustomOrganizationHeadquarterSchema = createZodObject(
    $UniRefund_CRMService_Customs_CreateCustomsOrganizationFormDto,
    ["organization", "address", "taxpayerId", "telephone", "email"],
    undefined,
    {...CustomOrganizationFormSubPositions, address: addressFieldsToShow},
  );

  const $createCustomOrganizationStoreSchema = createZodObject(
    $UniRefund_CRMService_Customs_CreateCustomsOrganizationFormDto,
    ["organization", "address", "telephone", "email"],
    undefined,
    {...CustomOrganizationFormSubPositions, address: addressFieldsToShow},
  );

  function handleSaveCustomOrganization(formData: CreateCustomOrganizationSchema) {
    const isValid = isPhoneValid(formData.telephone.localNumber);
    if (!isValid) {
      return;
    }
    const phoneData = splitPhone(formData.telephone.localNumber);
    formData.telephone = {...formData.telephone, ...phoneData};
    const createData: UniRefund_CRMService_Customss_CreateCustomsDto = {
      parentId,
      taxpayerId: formData.taxpayerId,
      typeCode: parentId ? "CUSTOMS" : "HEADQUARTER",
      entityInformationTypes: [
        {
          organizations: [
            {
              ...formData.organization,
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
            },
          ],
        },
      ],
    };
    void postCustomsWithComponentsApi({
      requestBody: createData,
    })
      .then((res) => {
        handlePostResponse(res, router, {
          prefix: "/parties/customs",
          identifier: "id",
          suffix: "details/info",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AutoForm
      className="grid gap-2 space-y-0 md:grid-cols-2 lg:grid-cols-3"
      fieldConfig={{
        address: {...addressSchemaFieldConfig, className: "row-span-4"},
        organization: {
          className: "lg:col-span-2",
        },
        email: {
          className: "lg:col-span-2 border p-4 rounded-md",
          emailAddress: {
            inputProps: {
              type: "email",
            },
          },
        },
        taxpayerId: {
          containerClassName: "lg:col-span-2 border p-4 rounded-md",
          inputProps: {
            required: true,
          },
        },
        telephone: {
          className: "lg:col-span-2 border p-4 rounded-md",
          localNumber: {
            fieldType: "phone",
            displayName: languageData.Telephone,
            inputProps: {
              showLabel: true,
            },
          },
        },
      }}
      formSchema={parentId ? $createCustomOrganizationStoreSchema : $createCustomOrganizationHeadquarterSchema}
      onSubmit={(formData) => {
        setLoading(true);
        handleSaveCustomOrganization(formData as CreateCustomOrganizationSchema);
      }}
      onValuesChange={(values) => {
        onAddressValueChanged(values);
      }}
      stickyChildren
      stickyChildrenClassName="sticky px-6">
      <AutoFormSubmit className="float-right" disabled={loading}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}
