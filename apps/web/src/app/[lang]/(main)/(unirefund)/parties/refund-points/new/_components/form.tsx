"use client";

import type {
  UniRefund_CRMService_RefundPoints_CreateRefundPointDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {AutoFormSubmit, CustomCombobox} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postRefundPointsWithComponentsApi} from "@repo/actions/unirefund/CrmService/post-actions";
import type {CountryDto, SelectedAddressField} from "@/utils/address-hook/types";
import {useAddressHook} from "@/utils/address-hook/use-address-hook.tsx";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {isPhoneValid, splitPhone} from "src/utils/utils-phone";
import type {CreateRefundPointOrganizationSchema} from "./data";
import {
  $UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationFormDto,
  refundPointOrganizationFormSubPositions,
} from "./data";

export default function RefundPointOrganizationForm({
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

  const $createRefundPointOrganizationHeadquarterSchema = createZodObject(
    $UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationFormDto,
    ["organization", "taxpayerId", "taxOfficeId", "address", "telephone", "email"],
    undefined,
    {
      ...refundPointOrganizationFormSubPositions,
      address: addressFieldsToShow,
    },
  );

  const $createRefundPointOrganizationStoreSchema = createZodObject(
    $UniRefund_CRMService_RefundPoints_CreateRefundPointOrganizationFormDto,
    ["organization", "address", "telephone", "email"],
    undefined,
    {
      ...refundPointOrganizationFormSubPositions,
      address: addressFieldsToShow,
    },
  );

  function handleSaveRefundPointOrganization(formData: CreateRefundPointOrganizationSchema) {
    const isValid = isPhoneValid(formData.telephone.localNumber);
    if (!isValid) {
      return;
    }
    const phoneData = splitPhone(formData.telephone.localNumber);
    formData.telephone = {...formData.telephone, ...phoneData};
    const createData: UniRefund_CRMService_RefundPoints_CreateRefundPointDto = {
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
      typeCode: parentId ? "REFUNDPOINT" : "HEADQUARTER",
    };
    void postRefundPointsWithComponentsApi({
      requestBody: createData,
    })
      .then((res) => {
        handlePostResponse(res, router, {
          prefix: "/parties/refund-points",
          identifier: "id",
          suffix: "details/info",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="flex w-full justify-center overflow-y-auto py-6">
      <div className="w-full max-w-5xl">
        <div className="p-6">
          <AutoForm
            className="grid gap-4 md:grid-cols-2"
            fieldConfig={{
              taxOfficeId: {
                containerClassName: "md:col-span-1 p-4 rounded-md  border-none",
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
              taxpayerId: {
                containerClassName: "md:col-span-1 p-4 rounded-md  border-none",
              },
              organization: {
                className: "md:col-span-2  p-4 rounded-md border-none",
              },
              address: {
                ...addressSchemaFieldConfig,
                className: "md:col-span-2  p-4 rounded-md border-none",
              },
              email: {
                className: "md:col-span-1  p-4 rounded-md border-none",
                emailAddress: {
                  inputProps: {
                    type: "email",
                  },
                },
              },
              telephone: {
                className: "md:col-span-1  p-4 rounded-md border-none",
                localNumber: {
                  fieldType: "phone",
                  displayName: languageData.Telephone,
                  inputProps: {
                    showLabel: true,
                  },
                },
              },
            }}
            formSchema={
              parentId ? $createRefundPointOrganizationStoreSchema : $createRefundPointOrganizationHeadquarterSchema
            }
            onSubmit={(formData) => {
              setLoading(true);
              handleSaveRefundPointOrganization(formData as CreateRefundPointOrganizationSchema);
            }}
            onValuesChange={(values) => {
              onAddressValueChanged(values);
            }}
            stickyChildren
            stickyChildrenClassName="sticky mt-6 flex justify-end">
            <AutoFormSubmit
              className="bg-primary hover:bg-primary/90 rounded-md px-6 py-2 text-white transition-colors"
              disabled={loading}>
              {languageData.Save}
            </AutoFormSubmit>
          </AutoForm>
        </div>
      </div>
    </div>
  );
}
