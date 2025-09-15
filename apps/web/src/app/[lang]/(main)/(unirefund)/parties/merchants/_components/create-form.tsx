"use client";
import type { CRMServiceServiceResource } from "@/language-data/unirefund/CRMService";
import { getBaseLink } from "@/utils";
import { postMerchantApi } from "@repo/actions/unirefund/CrmService/post-actions";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_Merchants_CreateMerchantDto as CreateMerchantDto,
  UniRefund_CRMService_Merchants_MerchantDto as MerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Merchants_CreateMerchantDto as $CreateMerchantDto
} from "@repo/saas/CRMService";
import { FormReadyComponent } from "@repo/ui/form-ready";
import { handlePostResponse } from "@repo/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { createAddressWidgets } from "../../_components/contact/address/address-form-widgets";
import { CheckIsFormReady } from "../../_components/is-form-ready";

const DEFAULT_FORMDATA: CreateMerchantDto = {
  name: "",
  typeCode: "HEADQUARTER",
  isPersonalCompany: false,
  vatNumber: "",
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
export default function CreateMerchantForm({
  taxOfficeList,
  merchantList,
  languageData,
  typeCode = "HEADQUARTER",
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
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mergedFormData = useMemo(() => ({
    ...DEFAULT_FORMDATA,
    ...formData
  }), [formData]);

  const [form, setForm] = useState<CreateMerchantDto>(mergedFormData);

  const { widgets: addressWidgets, schemaFormKey } = createAddressWidgets({ languageData })()

  const uiSchema = useMemo(() => createUiSchemaWithResource({
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
        schema: $CreateMerchantDto.properties.address,
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
        ...{ "ui:disabled": typeCode === "STORE" && true },
        "ui:title": languageData["Form.Merchant.typeCode"],
      },
      vatNumber: {
        ...{ "ui:className": typeCode === "STORE" && "col-span-full" },
      },
      parentId: {
        "ui:className": "col-span-full",
        "ui:widget": "merchantWidget",
        ...{ "ui:disabled": typeCode === "STORE" && true },
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

  const list = parentDetails ? [parentDetails] : [];
  const widgets = useMemo(() => ({
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
    ...addressWidgets,
  }), [merchantList, taxOfficeList, languageData, addressWidgets]);

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
      ...(typeCode === "STORE" ? ["vatNumber", "taxOfficeId"] : [])
    ],
  }), [typeCode]);

  const handleFormChange = useCallback(({ formData: editedFormData }: { formData?: CreateMerchantDto }) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(({ formData: editedFormData }: { formData?: CreateMerchantDto }) => {
    if (!editedFormData) return;

    startTransition(() => {
      void postMerchantApi({
        ...editedFormData,
        typeCode: typeCode,
        parentId: typeCode === "STORE" ? mergedFormData.parentId : undefined,
      }).then((response) => {
        handlePostResponse(response, router, {
          prefix: getBaseLink("parties/merchants", lang),
          suffix: "details",
        });
      });
    });
  }, [typeCode, mergedFormData.parentId, router]);

  const isFormReady = CheckIsFormReady({
    lang,
    languageData,
    taxOfficeListLength: taxOfficeList.length,
  });

  return (
    <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
      <SchemaForm<CreateMerchantDto>
        key={schemaFormKey}
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
        filter={filter}
        onChange={handleFormChange}
        formData={form}
        id="create-merchant-form"
        locale={lang}
        onSubmit={handleFormSubmit}
        schema={$CreateMerchantDto}
        submitText={languageData["Form.Merchant.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
      />
    </FormReadyComponent>
  );
}
