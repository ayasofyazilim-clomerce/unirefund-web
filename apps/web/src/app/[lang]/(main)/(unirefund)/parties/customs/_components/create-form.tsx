"use client";
import type { CRMServiceServiceResource } from "@/language-data/unirefund/CRMService";
import { getBaseLink } from "@/utils";
import { postCustomApi } from "@repo/actions/unirefund/CrmService/post-actions";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_Customs_CreateCustomDto as CreateCustomDto,
  UniRefund_CRMService_Customs_CustomListResponseDto as CustomDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Customs_CreateCustomDto as $CreateCustomDto
} from "@repo/saas/CRMService";
import { handlePostResponse } from "@repo/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { createAddressWidgets } from "../../_components/contact/address/address-form-widgets";

const DEFAULT_FORMDATA: CreateCustomDto = {
  name: "",
  typeCode: "CUSTOM",
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

interface CreateCustomFormProps {
  customList?: CustomDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateCustomDto>;
  typeCode?: "HEADQUARTER" | "CUSTOM";
}

export default function CreateCustomForm({
  customList = [],
  languageData,
  formData,
  typeCode = "HEADQUARTER",
}: CreateCustomFormProps) {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mergedFormData = useMemo(() => ({
    ...DEFAULT_FORMDATA,
    ...formData
  }), [formData]);

  const [form, setForm] = useState<CreateCustomDto>(mergedFormData);

  const { widgets: addressWidgets, schemaFormKey } = createAddressWidgets({ languageData })()

  // UI Schema
  const uiSchema = useMemo(() => createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Custom",
    schema: $CreateCustomDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto p-px",
      telephone: createUiSchemaWithResource({
        resources: languageData,
        schema: $CreateCustomDto.properties.telephone,
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
        schema: $CreateCustomDto.properties.address,
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
        schema: $CreateCustomDto.properties.email,
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
        ...{ "ui:disabled": typeCode === "CUSTOM" },
        "ui:title": languageData["Form.Custom.typeCode"],
      },
      vatNumber: {
        "ui:className": "col-span-full",
      },
      parentId: {
        "ui:widget": "customWidget",
      },
      "ui:order": [
        "name",
        "gateNumber",
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
      ...(typeCode === "CUSTOM" ? ["vatNumber"] : [])
    ],
  }), [typeCode]);

  const handleFormChange = useCallback(({ formData: editedFormData }: { formData?: CreateCustomDto }) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(({ formData: editedFormData }: { formData?: CreateCustomDto }) => {
    if (!editedFormData) return;

    startTransition(() => {
      void postCustomApi({
        ...editedFormData,
        typeCode: typeCode,
        parentId: typeCode === "CUSTOM" ? mergedFormData.parentId : undefined,
      }).then((response) => {
        handlePostResponse(response, router, {
          prefix: getBaseLink("parties/customs", lang),
          suffix: "details",
        });
      });
    });
  }, [typeCode, mergedFormData.parentId, router]);

  const widgets = useMemo(() => ({
    customWidget: CustomComboboxWidget<CustomDto>({
      list: customList,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
    ...addressWidgets,
  }), [customList, languageData, addressWidgets]);

  return (
    <SchemaForm<CreateCustomDto>
      key={schemaFormKey}
      defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
      disabled={isPending}
      filter={filter}
      onChange={handleFormChange}
      formData={form}
      id="create-custom-form"
      locale={lang}
      onSubmit={handleFormSubmit}
      schema={$CreateCustomDto}
      submitText={languageData["Form.Custom.Create"]}
      uiSchema={uiSchema}
      widgets={widgets}
    />
  );
}