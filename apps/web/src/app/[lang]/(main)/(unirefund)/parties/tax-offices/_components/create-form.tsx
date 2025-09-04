"use client";
import type {
  UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as CreateTaxOfficeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {
  $UniRefund_CRMService_Addresses_AddressDto as $AddressDto,
  $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as $CreateTaxOfficeDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {postTaxOfficeApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {DependencyConfig} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {applyFieldDependencies, createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {AddressField} from "@repo/ui/components/address/field";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {EmailWithTypeField} from "../../_components/contact/email-with-type";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";

export default function CreateTaxOfficeForm({
  taxOfficeList,
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
  parentDetails,
}: {
  taxOfficeList?: TaxOfficeDto[];
  languageData: CRMServiceServiceResource;
  formData?: CreateTaxOfficeDto;
  parentDetails?: TaxOfficeDto;
  typeCode?: "HEADQUARTER" | "TAXOFFICE";
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.TaxOffice",
    schema: $CreateTaxOfficeDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
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
  const dependencies: DependencyConfig = {
    typeCode: {
      REQUIRES: [
        {
          when: (value) => value === "HEADQUARTER",
          targets: ["vatNumber"],
        },
        {
          when: (value) => value === "TAXOFFICE",
          targets: ["parentId"],
        },
      ],
      HIDES: [
        {
          when: (value) => value === "HEADQUARTER",
          targets: ["parentId"],
        },
        {
          when: (value) => value === "TAXOFFICE",
          targets: ["vatNumber"],
        },
      ],
    },
  };

  const transformedSchema = applyFieldDependencies($CreateTaxOfficeDto, dependencies);
  return (
    <SchemaForm<CreateTaxOfficeDto>
      defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
      disabled={isPending}
      fields={fields}
      filter={{
        type: "exclude",
        keys: ["email.id", "email.isPrimary", "telephone.id", "telephone.isPrimary"],
      }}
      formData={formData}
      locale={lang}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          void postTaxOfficeApi(editedFormData).then((response) => {
            handlePostResponse(response, router, {
              prefix: getBaseLink("parties/tax-offices"),
              suffix: "details",
            });
          });
        });
      }}
      schema={transformedSchema}
      submitText={languageData["Form.TaxOffice.Create"]}
      uiSchema={uiSchema}
      widgets={widgets}
    />
  );
}
