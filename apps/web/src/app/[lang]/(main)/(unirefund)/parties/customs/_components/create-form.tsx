"use client";
import {postCustomApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {UniRefund_CRMService_Customs_CreateCustomDto as CreateCustomDto} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Customs_CreateCustomDto as $CreateCustomDto} from "@repo/saas/CRMService";
import {createAddressWidgets} from "@repo/ui/components/address/address-form-widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useMemo, useState, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";

const DEFAULT_FORMDATA: CreateCustomDto = {
  name: "",
  typeCode: "CUSTOM",
  email: {
    type: "WORK",
    emailAddress: "",
    isPrimary: true,
  },
  telephone: {
    type: "WORK",
    localNumber: "",
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

interface CreateCustomFormProps {
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateCustomDto>;
  typeCode?: "HEADQUARTER" | "CUSTOM";
}

export default function CreateCustomForm({languageData, formData, typeCode = "HEADQUARTER"}: CreateCustomFormProps) {
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

  const [form, setForm] = useState<CreateCustomDto>(mergedFormData);

  const {widgets, schemaFormKey} = createAddressWidgets({languageData})({initialValue: form.address});

  // UI Schema
  const uiSchema = useMemo(
    () =>
      createUiSchemaWithResource({
        resources: languageData,
        name: "Form.Custom",
        schema: $CreateCustomDto,
        extend: {
          "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto p-px",
          telephone: {
            "ui:field": "telephone",
            "ui:className": "grid grid-cols-1 md:grid-cols-2 col-span-full",
            "ui:required": true,
          },
          address: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateCustomDto.properties.address,
            name: "Form.address",
            extend: {
              "ui:className": "col-span-full grid-cols-1 grid md:grid-cols-2 gap-4",
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
            schema: $CreateCustomDto.properties.email,
            name: "Form.email",
            extend: {
              "ui:className":
                "col-span-full border-none grid grid-cols-1 md:grid-cols-2 p-0 border-0 gap-y-2 gap-x-4 [&_*:is(input,button)]:h-9",
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
            ...{"ui:disabled": typeCode === "CUSTOM"},
            "ui:title": languageData["Form.Custom.typeCode"],
          },
          vatNumber: {
            "ui:className": "col-span-full",
            ...{"ui:required": typeCode === "HEADQUARTER" && true},
          },
          parentId: {
            "ui:widget": "customWidget",
          },
          "ui:order": [
            "name",
            "gateNumber",
            "typeCode",
            "externalIdentifier",
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
        ...(typeCode === "CUSTOM" ? ["vatNumber"] : []),
      ],
    }),
    [typeCode],
  );

  const fields = useMemo(() => {
    return {
      telephone: PhoneWithTypeField({
        languageData,
        typeOptions: $CreateCustomDto.properties.telephone.properties.type.enum,
      }),
    };
  }, []);

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: CreateCustomDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: CreateCustomDto}) => {
      if (!editedFormData) return;

      startTransition(() => {
        void postCustomApi({
          ...editedFormData,
          typeCode,
          parentId: typeCode === "CUSTOM" ? mergedFormData.parentId : undefined,
        }).then((response) => {
          handlePostResponse(response, router, {
            prefix: getBaseLink("parties/customs", lang),
            suffix: "details",
          });
        });
      });
    },
    [typeCode, mergedFormData.parentId, router],
  );

  return (
    <SchemaForm<CreateCustomDto>
      defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
      disabled={isPending}
      fields={fields}
      filter={filter}
      formData={form}
      id="create-custom-form"
      key={schemaFormKey}
      locale={lang}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
      schema={$CreateCustomDto}
      submitText={languageData["Form.Custom.Create"]}
      uiSchema={uiSchema}
      widgets={widgets}
      withScrollArea={false}
    />
  );
}
