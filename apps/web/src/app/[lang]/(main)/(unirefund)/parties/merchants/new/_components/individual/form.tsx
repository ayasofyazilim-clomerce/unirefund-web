"use client";

import type {
  UniRefund_CRMService_Merchants_CreateMerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {AutoFormSubmit, CustomCombobox} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postMerchantsWithComponentsApi} from "@repo/actions/unirefund/CrmService/post-actions";
import type {CountryDto, SelectedAddressField} from "@/utils/address-hook/types";
import {useAddressHook} from "@/utils/address-hook/use-address-hook.tsx";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {isPhoneValid, splitPhone} from "src/utils/utils-phone";
import type {CreateMerchantIndividualSchema} from "./data";
import {
  $UniRefund_CRMService_Merchants_CreateMerchantIndividualFormDto,
  merchantIndividualFormSubPositions,
} from "./data";

export default function MerchantIndividualForm({
  countryList,
  languageData,
  taxOfficeList,
}: {
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
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

  const $createMerchantIndividualHeadquarterSchema = createZodObject(
    $UniRefund_CRMService_Merchants_CreateMerchantIndividualFormDto,
    ["name", "personalSummaries", "address", "customerNumber", "taxpayerId", "taxOfficeId", "telephone", "email"],
    undefined,
    {...merchantIndividualFormSubPositions, address: addressFieldsToShow},
  );

  const $createMerchantIndividualStoreSchema = createZodObject(
    $UniRefund_CRMService_Merchants_CreateMerchantIndividualFormDto,
    ["name", "personalSummaries", "address", "customerNumber", "telephone", "email"],
    undefined,
    {...merchantIndividualFormSubPositions, address: addressFieldsToShow},
  );

  function handleSaveMerchantIndividual(formData: CreateMerchantIndividualSchema) {
    const isValid = isPhoneValid(formData.telephone.localNumber);
    if (!isValid) {
      return;
    }
    const phoneData = splitPhone(formData.telephone.localNumber);
    formData.telephone = {...formData.telephone, ...phoneData};
    const createData: UniRefund_CRMService_Merchants_CreateMerchantDto = {
      parentId,
      typeCode: parentId ? "STORE" : "HEADQUARTER",
      taxOfficeId: formData.taxOfficeId,
      taxpayerId: formData.taxpayerId,
      customerNumber: formData.customerNumber,
      entityInformationTypes: [
        {
          individuals: [
            {
              name: formData.name,
              personalSummaries: [formData.personalSummaries],
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
    void postMerchantsWithComponentsApi({
      requestBody: createData,
    })
      .then((res) => {
        handlePostResponse(res, router, {
          prefix: "/parties/merchants",
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
        taxpayerId: {
          containerClassName: "border p-4 rounded-md",
        },
        customerNumber: {
          containerClassName: "lg:col-span-1 border p-4 rounded-md",
        },
        taxOfficeId: {
          containerClassName: "border p-4 rounded-md",
          renderer: (props: AutoFormInputComponentProps) => {
            return (
              <CustomCombobox<UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto>
                childrenProps={props}
                list={taxOfficeList}
                selectIdentifier="id"
                selectLabel="name"
              />
            );
          },
        },
        address: {
          ...addressSchemaFieldConfig,
          className: parentId ? "col-span-1" : "row-span-2",
        },
        organization: {
          className: "row-span-2",
        },
        email: {
          emailAddress: {
            inputProps: {
              type: "email",
            },
          },
        },
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
      formSchema={parentId ? $createMerchantIndividualStoreSchema : $createMerchantIndividualHeadquarterSchema}
      onSubmit={(formData) => {
        setLoading(true);
        handleSaveMerchantIndividual(formData as CreateMerchantIndividualSchema);
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
