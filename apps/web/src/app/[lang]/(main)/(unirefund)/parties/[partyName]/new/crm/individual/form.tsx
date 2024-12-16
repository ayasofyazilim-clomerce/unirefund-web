"use client";

import { toast } from "@/components/ui/sonner";
import type { UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_Merchants_CreateMerchantDto as CreateMerchantSchema } from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type { AutoFormInputComponentProps } from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {
  AutoFormSubmit,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  CountryDto,
  SelectedAddressField,
} from "src/actions/unirefund/LocationService/types";
import { useAddressHook } from "src/actions/unirefund/LocationService/use-address-hook.tsx";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { getBaseLink } from "src/utils";
import { isPhoneValid, splitPhone } from "src/utils/utils-phone";
import type { CreatePartiesDto } from "../../../../table-data";
import { dataConfigOfParties, localNumber } from "../../../../table-data";
import type { CreateMerchantDTO } from "../../../../types";
import { createPartyRow } from "../../../action";

function createScheme(schema: typeof CreateMerchantSchema) {
  return {
    type: "object",
    properties: {
      taxOfficeId: {
        type: "string",
      },
      name: schema.properties.entityInformationTypes.items.properties
        .individuals.items.properties.name,
      personalSummaries:
        schema.properties.entityInformationTypes.items.properties.individuals
          .items.properties.personalSummaries.items,
      telephone: {
        ...schema.properties.entityInformationTypes.items.properties.individuals
          .items.properties.contactInformations.items.properties.telephones
          .items,
        properties: {
          ...schema.properties.entityInformationTypes.items.properties
            .individuals.items.properties.contactInformations.items.properties
            .telephones.items.properties,
          localNumber,
        },
      },
      address:
        schema.properties.entityInformationTypes.items.properties.individuals
          .items.properties.contactInformations.items.properties.addresses
          .items,
      email:
        schema.properties.entityInformationTypes.items.properties.individuals
          .items.properties.contactInformations.items.properties.emails.items,
    },
  };
}

export default function CrmIndividual({
  partyName,
  taxOfficeList,
  countryList,
  languageData,
}: {
  partyName: "merchants";
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
}) {
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");
  const router = useRouter();

  const selectedFieldsDefaultValue: SelectedAddressField = {
    countryId: "",
    regionId: "",
    cityId: "",
  };

  const {
    selectedFields,
    addressFieldsToShow,
    addressSchemaFieldConfig,
    onAddressValueChanged,
  } = useAddressHook({
    countryList,
    selectedFieldsDefaultValue,
    fieldsToHideInAddressSchema: ["districtId"],
    languageData,
  });

  function formSchemaByData() {
    const config = dataConfigOfParties[partyName];
    const schema = createScheme(CreateMerchantSchema);

    return createZodObject(
      schema,
      [
        "name",
        "personalSummaries",
        "address",
        "taxOfficeId",
        "telephone",
        "email",
      ],
      undefined,
      {
        ...config.createFormSchema.formSubPositions,
        address: addressFieldsToShow,
      },
    );
  }

  const schema = formSchemaByData();

  const handleSave = async (formData: CreatePartiesDto) => {
    const isValid = isPhoneValid(formData.telephone.localNumber);
    if (!isValid) {
      return;
    }
    const phoneData = splitPhone(formData.telephone.localNumber);
    formData.telephone = { ...formData.telephone, ...phoneData };
    const createformData: CreateMerchantDTO = {
      taxOfficeId: formData.taxOfficeId,
      typeCode: parentId
        ? dataConfigOfParties[partyName].subEntityType
        : "HEADQUARTER",
      parentId,
      entityInformationTypes: [
        {
          individuals: [
            {
              name: formData.name,
              personalSummaries: [formData.personalSummaries],
              contactInformations: [
                {
                  telephones: [{ ...formData.telephone, primaryFlag: true }],
                  emails: [{ ...formData.email, primaryFlag: true }],
                  addresses: [
                    {
                      ...formData.address,
                      ...selectedFields,
                      primaryFlag: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    try {
      const response = await createPartyRow(partyName, createformData);
      if (response.status === 200) {
        toast.success(`${partyName} added successfully`);
        router.push(getBaseLink(`/parties/${partyName}`));
      } else {
        toast.error(response.message || `Failed to add ${partyName}`);
      }
    } catch (error) {
      toast.error(`An error occurred while saving the ${partyName}`);
    }
  };

  return (
    <AutoForm
      className="grid gap-2 space-y-0 md:grid-cols-2 lg:grid-cols-3"
      fieldConfig={{
        taxOfficeId: {
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
        address: { ...addressSchemaFieldConfig, className: "row-span-2" },
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
      formClassName="pb-4"
      formSchema={schema}
      onSubmit={(val) => {
        void handleSave(val as CreatePartiesDto);
      }}
      onValuesChange={(values) => {
        onAddressValueChanged(values);
      }}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}
