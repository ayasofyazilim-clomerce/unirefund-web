"use client";
import type { CRMServiceServiceResource } from "@/language-data/unirefund/CRMService";
import { getBaseLink } from "@/utils";
import { postTaxOfficeApi } from "@repo/actions/unirefund/CrmService/post-actions";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {
  UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as CreateTaxOfficeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto as $CreateTaxOfficeDto
} from "@repo/saas/CRMService";
import { handlePostResponse } from "@repo/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { createAddressWidgets } from "../../_components/contact/address/address-form-widgets";

const DEFAULT_FORMDATA: CreateTaxOfficeDto = {
  name: "",
  typeCode: "HEADQUARTER",
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
    adminAreaLevel1Id: "00000000-0000-0000-0000-000000000000",
    adminAreaLevel2Id: "00000000-0000-0000-0000-000000000000",
    countryId: "00000000-0000-0000-0000-000000000000",
  },
};
export default function CreateTaxOfficeForm({
  languageData,
  typeCode = "HEADQUARTER",
  formData,
}: {
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateTaxOfficeDto>;
  typeCode?: "HEADQUARTER" | "TAXOFFICE";
}) {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mergedFormData = useMemo(() => ({
    ...DEFAULT_FORMDATA,
    ...formData
  }), [formData]);

  const [form, setForm] = useState<CreateTaxOfficeDto>(mergedFormData);

  const AddressWidgets = createAddressWidgets({ languageData });
  const { widgets, schemaFormKey } = AddressWidgets();

  const uiSchema = useMemo(() => createUiSchemaWithResource({
    resources: languageData,
    name: "Form.TaxOffice",
    schema: $CreateTaxOfficeDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
      taxOfficeId: {
        ...{ "ui:disabled": typeCode === "TAXOFFICE" && true },
        "ui:widget": "taxOfficeWidget",
      },
      isPersonalCompany: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md col-span-full",
      },
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
        schema: $CreateTaxOfficeDto.properties.address,
        name: "CRM.address",
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
        },
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
        ...{ "ui:disabled": typeCode === "TAXOFFICE" && true },
        "ui:title": languageData["Form.TaxOffice.typeCode"],
      },
      vatNumber: {
        ...{ "ui:className": typeCode !== "TAXOFFICE" && "col-span-full" },
      },
      parentId: {
        "ui:className": "col-span-full",
        "ui:widget": "merchantWidget",
        ...{ "ui:disabled": typeCode === "TAXOFFICE" && true },
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
  }), [languageData, typeCode]);



  const filter = useMemo(() => ({
    type: "exclude" as const,
    keys: [
      "email.id",
      "email.isPrimary",
      "telephone.id",
      "telephone.isPrimary",
      "typeCode",
      "parentId",
      "address.partyType",
      "address.partyId",
      "address.placeId",
      "address.latitude",
      "address.longitude",
      "address.isPrimary",
      ...(typeCode === "TAXOFFICE" ? ["vatNumber"] : [])
    ],
  }), [typeCode]);

  const handleFormChange = useCallback(({ formData: editedFormData }: { formData?: CreateTaxOfficeDto }) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(({ formData: editedFormData }: { formData?: CreateTaxOfficeDto }) => {
    if (!editedFormData) return;

    startTransition(() => {
      void postTaxOfficeApi({
        ...editedFormData,
        typeCode: typeCode,
        parentId: typeCode === "TAXOFFICE" ? mergedFormData.parentId : undefined,
      }).then((response) => {
        handlePostResponse(response, router, {
          prefix: getBaseLink("parties/tax-offices", lang),
          suffix: "details",
        });
      });
    });
  }, [typeCode, mergedFormData.parentId, router]);

  return (
    <SchemaForm<CreateTaxOfficeDto>
      key={schemaFormKey}
      defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
      disabled={isPending}
      filter={filter}
      onChange={handleFormChange}
      formData={form}
      id="create-tax-office-form"
      locale={lang}
      onSubmit={handleFormSubmit}
      schema={$CreateTaxOfficeDto}
      submitText={languageData["Form.TaxOffice.Create"]}
      uiSchema={uiSchema}
      widgets={widgets}
    />
  );
}
