"use client";

import type {
  UniRefund_CRMService_TaxFrees_CreateTaxFreeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {AutoFormSubmit, CustomCombobox} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postTaxFreesWithComponentsApi} from "@repo/actions/unirefund/CrmService/post-actions";
import type {CountryDto, SelectedAddressField} from "@/utils/address-hook/types";
import {useAddressHook} from "@/utils/address-hook/use-address-hook.tsx";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {isPhoneValid, splitPhone} from "src/utils/utils-phone";
import type {CreateTaxFreeOrganizationSchema} from "./data";
import {
  $UniRefund_CRMService_TaxFrees_CreateTaxFreesOrganizationFormDto,
  taxFreeOrganizationFormSubPositions,
} from "./data";

export default function TaxFreeOrganizationForm({
  taxOfficeList,
  countryList,
  languageData,
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

  const $createTaxFreeOrganizationHeadquarterSchema = createZodObject(
    $UniRefund_CRMService_TaxFrees_CreateTaxFreesOrganizationFormDto,
    ["organization", "address", "taxpayerId", "taxOfficeId", "telephone", "email"],
    undefined,
    {...taxFreeOrganizationFormSubPositions, address: addressFieldsToShow},
  );

  const $createTaxFreeOrganizationStoreSchema = createZodObject(
    $UniRefund_CRMService_TaxFrees_CreateTaxFreesOrganizationFormDto,
    ["organization", "address", "telephone", "email"],
    undefined,
    {...taxFreeOrganizationFormSubPositions, address: addressFieldsToShow},
  );

  function handleSaveTaxFreeOrganization(formData: CreateTaxFreeOrganizationSchema) {
    const isValid = isPhoneValid(formData.telephone.localNumber);
    if (!isValid) {
      return;
    }
    const phoneData = splitPhone(formData.telephone.localNumber);
    formData.telephone = {...formData.telephone, ...phoneData};
    const createData: UniRefund_CRMService_TaxFrees_CreateTaxFreeDto = {
      parentId,
      taxpayerId: formData.taxpayerId,
      taxOfficeId: formData.taxOfficeId,
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
      typeCode: parentId ? "TAXFREE" : "HEADQUARTER",
    };
    void postTaxFreesWithComponentsApi({
      requestBody: createData,
    })
      .then((res) => {
        handlePostResponse(res, router, {
          prefix: "/parties/tax-free",
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
        taxOfficeId: {
          inputProps: {
            required: !parentId,
          },
          containerClassName: "lg:col-span-2 border p-4 rounded-md",
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
          className: parentId ? "row-span-3" : "row-span-5",
        },
        organization: {
          className: "lg:col-span-2",
        },
        email: {
          className: parentId ? "lg:col-span-2 border p-4 rounded-md" : "",
          containerClassName: parentId ? "" : "col-span-2",
          emailAddress: {
            inputProps: {
              type: "email",
            },
          },
        },
        taxpayerId: {
          containerClassName: "lg:col-span-2 border p-4 rounded-md",
          inputProps: {
            required: !parentId,
          },
        },
        telephone: {
          className: parentId ? "lg:col-span-2 border p-4 rounded-md" : "",
          containerClassName: parentId ? "" : "col-span-2",
          localNumber: {
            fieldType: "phone",
            displayName: languageData.Telephone,
            inputProps: {
              showLabel: true,
            },
          },
        },
      }}
      formSchema={parentId ? $createTaxFreeOrganizationStoreSchema : $createTaxFreeOrganizationHeadquarterSchema}
      onSubmit={(formData) => {
        setLoading(true);
        handleSaveTaxFreeOrganization(formData as CreateTaxFreeOrganizationSchema);
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
