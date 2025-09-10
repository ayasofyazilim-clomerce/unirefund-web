"use client";
import {postMerchantApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_Merchants_CreateMerchantDto as CreateMerchantDto,
  UniRefund_CRMService_Merchants_MerchantDto as MerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Addresses_AddressDto as $AddressDto,
  $UniRefund_CRMService_Merchants_CreateMerchantDto as $CreateMerchantDto,
} from "@repo/saas/CRMService";
import {AddressField} from "@repo/ui/components/address/field";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useMemo, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {EmailWithTypeField} from "../../_components/contact/email-with-type";
import {CheckIsFormReady} from "../../_components/is-form-ready";

const DEFAULT_FORMDATA: CreateMerchantDto = {
  name: "",
  typeCode: "HEADQUARTER",
  isPersonalCompany: false,
  email: {
    type: "WORK",
    emailAddress: "",
  },
  telephone: {
    type: "WORK",
    number: "",
  },
  address: {
    type: "WORK",
    addressLine: "",
    adminAreaLevel1Id: "",
    adminAreaLevel2Id: "",
    countryId: "",
  },
};
export default function CreateMerchantForm({
  taxOfficeList,
  merchantList,
  languageData,
  typeCode,
  parentDetails,
  formData,
}: {
  taxOfficeList: TaxOfficeDto[];
  merchantList?: MerchantDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateMerchantDto>;
  parentDetails?: MerchantDto;
  typeCode?: "HEADQUARTER" | "STORE";
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mergedFormData = useMemo(() => ({...DEFAULT_FORMDATA, ...formData}), []);

  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Merchant",
    schema: $CreateMerchantDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
      taxOfficeId: {
        ...{"ui:disabled": typeCode === "STORE" && true},
        "ui:widget": "taxOfficeWidget",
      },
      isPersonalCompany: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md col-span-full",
      },
      telephone: createUiSchemaWithResource({
        resources: languageData,
        schema: $CreateMerchantDto.properties.telephone,
        name: "CRM.telephone",
        extend: {
          "ui:className":
            "col-span-full border-none grid grid-cols-2 p-0 border-0 gap-y-2 gap-x-4 [&_*:is(input,button)]:h-9",
          displayLabel: false,
          number: {
            "ui:widget": "phone-with-value",
            "ui:title": languageData["CRM.telephone.number"],
          },
        },
      }),
      address: createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressDto,
        name: "CRM.address",
        extend: {"ui:field": "address"},
      }),
      email: createUiSchemaWithResource({
        resources: languageData,
        schema: $CreateMerchantDto.properties.email,
        name: "CRM.email",
        extend: {
          "ui:className":
            "col-span-full border-none grid grid-cols-2 p-0 border-0 gap-y-2 gap-x-4 [&_*:is(input,button)]:h-9",
          displayLabel: false,
          emailAddress: {
            "ui:title": languageData["CRM.email"],
            "ui:widget": "email",
            "ui:baseList": ["unirefund.com", "clomerce.com", "ayasofyazilim.com"],
          },
        },
      }),
      typeCode: {
        ...{"ui:disabled": typeCode === "STORE" && true},
        "ui:title": languageData["Form.Merchant.typeCode"],
      },
      vatNumber: {
        "ui:className": "col-span-full",
      },
      parentId: {
        "ui:className": "col-span-full",
        "ui:widget": "merchantWidget",
        ...{"ui:disabled": typeCode === "STORE" && true},
      },
      "ui:order": [
        "name",
        "taxOfficeId",
        "chainCodeId",
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
  });
  const fields = {
    address: AddressField({
      className: "col-span-full p-4 border rounded-md",
      languageData,
      hiddenFields: ["latitude", "longitude", "placeId", "isPrimary"],
    }),
    email: EmailWithTypeField({languageData}),
    // phone: PhoneWithTypeField({ languageData }),
  };
  const list = parentDetails ? [parentDetails] : [];
  const widgets = {
    taxOfficeWidget: CustomComboboxWidget<TaxOfficeDto>({
      list: taxOfficeList,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
    merchantWidget: CustomComboboxWidget<MerchantDto>({
      list: merchantList || list,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
  };

  const isFormReady = CheckIsFormReady({
    lang,
    languageData,
    taxOfficeListLength: taxOfficeList.length,
  });
  return (
    <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
      <SchemaForm<CreateMerchantDto>
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
        fields={fields}
        filter={{
          type: "exclude",
          keys: ["email.id", "email.isPrimary", "telephone.id", "telephone.isPrimary", "typeCode", "parentId"],
        }}
        formData={{...mergedFormData, taxOfficeId: mergedFormData.taxOfficeId || taxOfficeList[0]?.id}}
        id="create-merchant-form"
        locale={lang}
        onSubmit={({formData: editedFormData}) => {
          if (!editedFormData) return;
          startTransition(() => {
            void postMerchantApi({...editedFormData, typeCode: "HEADQUARTER"}).then((response) => {
              handlePostResponse(response, router, {
                prefix: getBaseLink("parties/merchants"),
                suffix: "details",
              });
            });
          });
        }}
        schema={$CreateMerchantDto}
        submitText={languageData["Form.Merchant.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
      />
    </FormReadyComponent>
  );
}
