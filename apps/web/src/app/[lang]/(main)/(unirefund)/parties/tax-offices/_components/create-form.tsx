"use client";
import {postTaxOfficeApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as CreateTaxOfficeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Addresses_AddressDto as $AddressDto,
  $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as $CreateTaxOfficeDto,
} from "@repo/saas/CRMService";
import {AddressField} from "@repo/ui/components/address/field";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useMemo, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {EmailWithTypeField} from "../../_components/contact/email-with-type";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";

const DEFAULT_FORMDATA: CreateTaxOfficeDto = {
  name: "",
  typeCode: "TAXOFFICE",
  telephone: {
    type: "WORK",
    number: "",
  },
  email: {
    type: "WORK",
    emailAddress: "",
  },
  address: {
    type: "WORK",
    addressLine: "",
    adminAreaLevel1Id: "",
    adminAreaLevel2Id: "",
    countryId: "",
  },
};
export default function CreateTaxOfficeForm({
  taxOfficeList,
  languageData,
  typeCode,
  formData,
  parentDetails,
}: {
  taxOfficeList?: TaxOfficeDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateTaxOfficeDto>;
  parentDetails?: TaxOfficeDto;
  typeCode?: "HEADQUARTER" | "TAXOFFICE";
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mergedFormData = useMemo(() => ({...DEFAULT_FORMDATA, ...formData}), []);
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.TaxOffice",
    schema: $CreateTaxOfficeDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
      telephone: createUiSchemaWithResource({
        resources: languageData,
        schema: $CreateTaxOfficeDto.properties.telephone,
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
        schema: $CreateTaxOfficeDto.properties.email,
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
        ...{"ui:disabled": typeCode === "TAXOFFICE" && true},
        "ui:title": languageData["Form.TaxOffice.typeCode"],
      },
      parentId: {
        "ui:widget": "taxOfficeWidget",
        ...{"ui:disabled": typeCode === "TAXOFFICE" && true},
      },
      "ui:order": [
        "name",
        "externalStoreIdentifier",
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

  const list = parentDetails ? [parentDetails] : [];
  const widgets = {
    taxOfficeWidget: CustomComboboxWidget<TaxOfficeDto>({
      list: taxOfficeList || list,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
  };
  return (
    <SchemaForm<CreateTaxOfficeDto>
      defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
      disabled={isPending}
      fields={fields}
      filter={{
        type: "exclude",
        keys: ["email.id", "email.isPrimary", "telephone.id", "telephone.isPrimary", "typeCode", "parentId"],
      }}
      formData={mergedFormData}
      locale={lang}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          void postTaxOfficeApi({...editedFormData, typeCode: "HEADQUARTER"}).then((response) => {
            handlePostResponse(response, router, {
              prefix: getBaseLink("parties/tax-offices"),
              suffix: "details",
            });
          });
        });
      }}
      schema={$CreateTaxOfficeDto}
      submitText={languageData["Form.TaxOffice.Create"]}
      uiSchema={uiSchema}
      widgets={widgets}
    />
  );
}
