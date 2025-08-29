"use client";
import type {
  UniRefund_CRMService_Merchants_CreateMerchantDto as CreateMerchantDto,
  UniRefund_CRMService_Merchants_MerchantDto as MerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {
  $UniRefund_CRMService_Addresses_AddressDto as $AddressDto,
  $UniRefund_CRMService_Merchants_CreateMerchantDto as $CreateMerchantDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {postMerchantApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {DependencyConfig} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {applyFieldDependencies, createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {AddressField} from "@repo/ui/components/address/field";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {EmailWithTypeField} from "../../_components/contact/email-with-type";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";
import {CheckIsFormReady} from "../../_components/is-form-ready";

export default function CreateMerchantForm({
  taxOfficeList,
  merchantList = [],
  languageData,
  typeCode,
  formData = {
    name: "  ",
    typeCode: "HEADQUARTER",
    telephone: {
      type: "WORK",
    },
    address: {
      type: "HOME",
    },
  },
}: {
  taxOfficeList: TaxOfficeDto[];
  merchantList?: MerchantDto[];
  languageData: CRMServiceServiceResource;
  formData?: CreateMerchantDto;
  typeCode?: "HEADQUARTER" | "STORE";
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Merchant",
    schema: $CreateMerchantDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
      taxOfficeId: {
        "ui:widget": "taxOfficeWidget",
      },
      isPersonalCompany: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md",
      },
      telephone: {
        "ui:className": "col-span-full",
        "ui:field": "phone",
      },
      address: createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressDto,
        name: "CRM.address",
        extend: {"ui:field": "address"},
      }),

      email: {
        "ui:className": "col-span-full",
        "ui:field": "email",
      },
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
    phone: PhoneWithTypeField({languageData}),
  };

  const widgets = {
    taxOfficeWidget: CustomComboboxWidget<TaxOfficeDto>({
      list: taxOfficeList,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
    merchantWidget: CustomComboboxWidget<MerchantDto>({
      list: merchantList,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
  };

  const dependencies: DependencyConfig = {
    typeCode: {
      REQUIRES: [
        {
          when: (value) => value === "HEADQUARTER",
          targets: ["vatNumber"],
        },
        {
          when: (value) => value === "STORE",
          targets: ["parentId"],
        },
      ],
      HIDES: [
        {
          when: (value) => value === "HEADQUARTER",
          targets: ["parentId"],
        },
        {
          when: (value) => value === "STORE",
          targets: ["vatNumber"],
        },
      ],
    },
  };

  const transformedSchema = applyFieldDependencies($CreateMerchantDto, dependencies);
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
          keys: ["email.id", "email.isPrimary", "telephone.id", "telephone.isPrimary"],
        }}
        formData={{...formData, taxOfficeId: formData.taxOfficeId || taxOfficeList[0]?.id}}
        locale={lang}
        onSubmit={({formData: editedFormData}) => {
          if (!editedFormData) return;
          startTransition(() => {
            void postMerchantApi(editedFormData).then((response) => {
              handlePostResponse(response, router, {
                prefix: getBaseLink("parties/merchants"),
                suffix: "details",
              });
            });
          });
        }}
        schema={transformedSchema}
        submitText={languageData["Form.Merchant.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
      />
    </FormReadyComponent>
  );
}
