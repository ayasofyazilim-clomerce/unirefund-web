"use client";

import {useRouter} from "next/navigation";
import {useTransition} from "react";
import type {
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto,
  UniRefund_CRMService_Enums_EntityPartyTypeCode,
  UniRefund_CRMService_Individuals_CreateIndividualDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {AutoFormSubmit, CustomCombobox} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {handlePostResponse} from "@repo/utils/api";
import {
  postAffiliationsToCustomApi,
  postAffiliationsToMerchantApi,
  postAffiliationsToTaxOfficeApi,
  postIndividualsWithComponentsApi,
  postAffiliationsToRefundPointApi,
  postAffiliationsToTaxFreeApi,
} from "src/actions/unirefund/CrmService/post-actions";
import {useAddressHook} from "src/actions/unirefund/LocationService/use-address-hook.tsx";
import {isPhoneValid, splitPhone} from "src/utils/utils-phone";
import {getBaseLink} from "@/utils";
import type {CountryDto, SelectedAddressField} from "src/actions/unirefund/LocationService/types";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {$UniRefund_CRMService_Individuals_CreateIndividualFormDto, individualFormSubPositions} from "./data";
import type {CreateIndividualSchema} from "./data";

export default function IndividualForm({
  countryList,
  languageData,
  affiliationCodeResponse,
  entityPartyTypeCode,
  partyId,
}: {
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
  affiliationCodeResponse: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[];
  entityPartyTypeCode?: UniRefund_CRMService_Enums_EntityPartyTypeCode;
  partyId?: string;
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
    {
      ...$UniRefund_CRMService_Individuals_CreateIndividualFormDto,
      properties: {
        ...$UniRefund_CRMService_Individuals_CreateIndividualFormDto.properties,
        affiliationCodeId: $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto.properties.affiliationCodeId,
      },
    },
    ["name", "personalSummaries", "address", "telephone", "email", "affiliationCodeId"],
    undefined,
    {...individualFormSubPositions, address: addressFieldsToShow},
  );
  function saveAffilationOfIndividual(formData: CreateIndividualSchema) {
    const body = {
      id: partyId || "",
      requestBody: {
        affiliationCodeId: formData.affiliationCodeId,
        email: formData.email.emailAddress,
        entityInformationTypeCode: "INDIVIDUAL" as const,
      },
    };
    switch (entityPartyTypeCode) {
      case "CUSTOMS":
        void postAffiliationsToCustomApi(body).then((res) => {
          handlePostResponse(res, router, getBaseLink(`parties/customs/${partyId}/affiliations`));
        });
        break;
      case "MERCHANT":
        void postAffiliationsToMerchantApi(body).then((res) => {
          handlePostResponse(res, router, getBaseLink(`parties/merchants/${partyId}/affiliations`));
        });
        break;
      case "TAXOFFICE":
        void postAffiliationsToTaxOfficeApi(body).then((res) => {
          handlePostResponse(res, router, getBaseLink(`parties/tax-offices/${partyId}/affiliations`));
        });
        break;
      case "TAXFREE":
        void postAffiliationsToTaxFreeApi(body).then((res) => {
          handlePostResponse(res, router, getBaseLink(`parties/tax-free/${partyId}/affiliations`));
        });
        break;
      case "REFUNDPOINT":
        void postAffiliationsToRefundPointApi(body).then((res) => {
          handlePostResponse(res, router, getBaseLink(`parties/refund-points/${partyId}/affiliations`));
        });
        break;
      default:
        break;
    }
  }

  function handleSaveIndividual(formData: CreateIndividualSchema) {
    if (entityPartyTypeCode && partyId && !formData.affiliationCodeId) return;
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
        if (formData.affiliationCodeId && entityPartyTypeCode && partyId) {
          saveAffilationOfIndividual(formData);
          return;
        }
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

        affiliationCodeId: {
          containerClassName: `p-4 border rounded-md ${partyId && entityPartyTypeCode ? "" : "hidden"}`,

          renderer: (props: AutoFormInputComponentProps) => {
            return (
              <CustomCombobox<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>
                childrenProps={{...props, isRequired: Boolean(partyId && entityPartyTypeCode)}}
                list={affiliationCodeResponse}
                selectIdentifier="id"
                selectLabel="name"
              />
            );
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
