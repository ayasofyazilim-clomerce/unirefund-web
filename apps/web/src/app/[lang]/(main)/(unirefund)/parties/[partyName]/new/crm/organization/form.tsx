"use client";

import { toast } from "@/components/ui/sonner";
import type { UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto } from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type { AutoFormInputComponentProps } from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {
  AutoFormSubmit,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { type TableData } from "@repo/ui/utils/table/table-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type {
  CountryDto,
  SelectedAddressField,
} from "src/actions/unirefund/LocationService/types";
import { useAddressHook } from "src/actions/unirefund/LocationService/use-address-hook.tsx";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { getBaseLink } from "src/utils";
import { isPhoneValid, splitPhone } from "src/utils/utils-phone";
import type { CreatePartiesDto } from "../../../../table-data";
import { dataConfigOfParties } from "../../../../table-data";
import type { PartiesCreateDTOType, PartyNameType } from "../../../../types";
import { createPartyRow } from "../../../action";

export default function CrmOrganization({
  partyName,
  taxOfficeList,
  countryList,
  languageData,
}: {
  partyName: Exclude<PartyNameType, "individuals">;
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
}) {
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");
  const router = useRouter();
  const [_formData] = useState<TableData>(dataConfigOfParties[partyName]);

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

    return createZodObject(
      config.createFormSchema.schema,
      config.createFormSchema.formPositions,
      undefined,
      {
        ...config.createFormSchema.formSubPositions,
        address: addressFieldsToShow,
      },
    );
  }

  const handleSave = async (formData: CreatePartiesDto) => {
    const isValid = isPhoneValid(formData.telephone.localNumber);
    if (!isValid) {
      return;
    }
    const phoneData = splitPhone(formData.telephone.localNumber);
    formData.telephone = { ...formData.telephone, ...phoneData };
    const createformData: PartiesCreateDTOType = {
      taxOfficeId: formData.taxOfficeId,
      typeCode: parentId
        ? dataConfigOfParties[partyName].subEntityType
        : "HEADQUARTER",
      parentId,
      entityInformationTypes: [
        {
          organizations: [
            {
              ...formData.organization,
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

    const response = await createPartyRow(partyName, createformData);
    if (response.status === 200) {
      toast.success(`${partyName} added successfully`);
      router.push(getBaseLink(`/parties/${partyName}`));
    } else {
      toast.error(response.message || `Failed to add ${partyName}`);
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
      formSchema={formSchemaByData()}
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
