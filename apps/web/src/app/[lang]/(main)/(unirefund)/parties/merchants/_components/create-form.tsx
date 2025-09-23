"use client";
import {postMerchantApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_Merchants_CreateMerchantDto as CreateMerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Merchants_CreateMerchantDto as $CreateMerchantDto} from "@repo/saas/CRMService";
import {createAddressWidgets} from "@repo/ui/components/address/address-form-widgets";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useMemo, useState, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {CheckIsFormReady} from "../../_components/is-form-ready";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";

const DEFAULT_FORMDATA: CreateMerchantDto = {
  name: "",
  typeCode: "HEADQUARTER",
  isPersonalCompany: false,
  vatNumber: "",
  email: {
    type: "WORK",
    emailAddress: "",
    isPrimary: true,
  },
  telephone: {
    type: "WORK",
    isPrimary: true,
  },
  address: {
    isPrimary: true,
    type: "WORK",
    addressLine: "",
    adminAreaLevel1Id: "00000000-0000-0000-0000-000000000000",
    adminAreaLevel2Id: "00000000-0000-0000-0000-000000000000",
    countryId: "00000000-0000-0000-0000-000000000000",
  },
};
export default function CreateMerchantForm({
  taxOfficeList = [],
  languageData,
  typeCode = "HEADQUARTER",
  formData,
}: {
  taxOfficeList?: TaxOfficeDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateMerchantDto>;
  typeCode?: "HEADQUARTER" | "STORE";
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mergedFormData = useMemo(
    () => ({
      ...DEFAULT_FORMDATA,
      ...formData,
    }),
    [formData],
  );

  const [form, setForm] = useState<CreateMerchantDto>(mergedFormData);

  const {widgets: addressWidgets, schemaFormKey} = createAddressWidgets({languageData})({initialValue: form.address});

  const uiSchema = useMemo(
    () =>
      createUiSchemaWithResource({
        resources: languageData,
        name: "Form.Merchant",
        schema: $CreateMerchantDto,
        extend: {
          "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
          taxOfficeId: {
            "ui:widget": "taxOfficeWidget",
            ...{"ui:required": typeCode === "HEADQUARTER" && true},
          },
          // externalStoreIdentifier: {
          //   ...{ "ui:required": typeCode === "STORE" && true },
          // },
          isPersonalCompany: {
            "ui:widget": "switch",
            "ui:className": "border px-2 rounded-md",
          },
          telephone: {
            "ui:field": "telephone",
            "ui:className": "grid grid-cols-2 col-span-full",
            "ui:required": true,
          },
          address: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateMerchantDto.properties.address,
            name: "Form.address",
            extend: {
              "ui:className": "col-span-full grid grid-cols-2 gap-4",
              countryId: {
                "ui:widget": "countryWidget",
              },
              adminAreaLevel1Id: {
                "ui:widget": "adminAreaLevel1Widget",
              },
              adminAreaLevel2Id: {
                "ui:widget": "adminAreaLevel2Widget",
              },
              neighborhoodId: {
                "ui:widget": "neighborhoodWidget",
              },
              addressLine: {
                "ui:className": "col-span-full",
              },
              isPrimary: {
                "ui:widget": "hidden",
              },
            },
          }),
          email: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateMerchantDto.properties.email,
            name: "Form.email",
            extend: {
              "ui:className":
                "col-span-full border-none grid grid-cols-2 p-0 border-0 gap-y-2 gap-x-4 [&_*:is(input,button)]:h-9",
              displayLabel: false,
              emailAddress: {
                "ui:title": languageData["Form.email"],
                "ui:widget": "email",
                "ui:baseList": ["unirefund.com", "clomerce.com", "ayasofyazilim.com"],
              },
              isPrimary: {
                "ui:widget": "hidden",
              },
            },
          }),
          typeCode: {
            ...{"ui:disabled": typeCode === "STORE" && true},
            "ui:title": languageData["Form.Merchant.typeCode"],
          },
          vatNumber: {
            "ui:className": "col-span-full",
            ...{"ui:required": typeCode === "HEADQUARTER" && true},
          },
          parentId: {
            "ui:className": "col-span-full",
            ...{"ui:disabled": typeCode === "STORE" && true},
          },
          "ui:order": [
            "name",
            "taxOfficeId",
            "externalStoreIdentifier",
            "isPersonalCompany",
            "typeCode",
            "parentId",
            "vatNumber",
            "telephone",
            "email",
            "address",
          ],
        },
      }),
    [languageData, typeCode],
  );

  const widgets = useMemo(
    () => ({
      taxOfficeWidget: CustomComboboxWidget<TaxOfficeDto>({
        list: taxOfficeList,
        selectLabel: "name",
        selectIdentifier: "id",
        languageData,
      }),
      ...addressWidgets,
    }),
    [taxOfficeList, languageData, addressWidgets],
  );

  const filter = useMemo(
    () => ({
      type: "exclude" as const,
      keys: [
        "email.id",
        "telephone.id",
        "typeCode",
        "parentId",
        "address.partyType",
        "address.partyId",
        "address.placeId",
        "address.latitude",
        "address.longitude",
        "chainCodeId",
        ...(typeCode === "STORE" ? ["vatNumber", "taxOfficeId"] : []),
      ],
    }),
    [typeCode],
  );

  const fields = useMemo(() => {
    return {
      telephone: PhoneWithTypeField({
        languageData,
        typeOptions: $CreateMerchantDto.properties.telephone.properties.type.enum,
      }),
    };
  }, []);

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: CreateMerchantDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: CreateMerchantDto}) => {
      if (!editedFormData) return;

      startTransition(() => {
        void postMerchantApi({
          ...editedFormData,
          typeCode,
          parentId: typeCode === "STORE" ? mergedFormData.parentId : undefined,
        }).then((response) => {
          handlePostResponse(response, router, {
            prefix: getBaseLink("parties/merchants", lang),
            suffix: "details",
          });
        });
      });
    },
    [typeCode, mergedFormData.parentId, router],
  );

  const isFormReady = CheckIsFormReady({
    lang,
    languageData,
    taxOfficeListLength: taxOfficeList.length,
  });

  return (
    <FormReadyComponent active={typeCode === "HEADQUARTER" && isFormReady.isActive} content={isFormReady.content}>
      <SchemaForm<CreateMerchantDto>
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
        fields={fields}
        filter={filter}
        formData={form}
        id="create-merchant-form"
        key={schemaFormKey}
        locale={lang}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        schema={$CreateMerchantDto}
        submitText={languageData["Form.Merchant.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
      />
    </FormReadyComponent>
  );
}
