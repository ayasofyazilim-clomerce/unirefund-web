"use client";
import {postTaxFreeApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_TaxFrees_CreateTaxFreeDto as CreateTaxFreeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_TaxFrees_CreateTaxFreeDto as $CreateTaxFreeDto} from "@repo/saas/CRMService";
import {createAddressWidgets} from "@repo/ui/components/address/address-form-widgets";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useMemo, useState, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {CheckIsFormReady} from "../../_components/is-form-ready";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";

const DEFAULT_FORMDATA: CreateTaxFreeDto = {
  name: "",
  typeCode: "HEADQUARTER",
  email: {
    type: "WORK",
    emailAddress: "",
    isPrimary: true,
  },
  telephone: {
    localNumber: "",
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
export default function CreateTaxFreeForm({
  taxOfficeList = [],
  languageData,
  typeCode = "HEADQUARTER",
  formData,
}: {
  taxOfficeList?: TaxOfficeDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateTaxFreeDto>;
  typeCode?: "HEADQUARTER" | "TAXFREE";
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

  const [form, setForm] = useState<CreateTaxFreeDto>(mergedFormData);

  const {widgets: addressWidgets, schemaFormKey} = createAddressWidgets({languageData})({initialValue: form.address});

  const uiSchema = useMemo(
    () =>
      createUiSchemaWithResource({
        resources: languageData,
        name: "Form.TaxFree",
        schema: $CreateTaxFreeDto,
        extend: {
          "ui:className": "grid grid-cols-1 md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
          taxOfficeId: {
            ...{"ui:disabled": typeCode === "TAXFREE" && true},
            ...{"ui:required": typeCode === "HEADQUARTER" && true},
            "ui:widget": "taxOfficeWidget",
          },
          externalStoreIdentifier: {
            "ui:required": typeCode === "HEADQUARTER" && true,
          },
          isPersonalCompany: {
            "ui:widget": "switch",
            "ui:className": "border px-2 rounded-md col-span-full",
          },
          telephone: {
            "ui:field": "telephone",
            "ui:className": "grid grid-cols-1 md:grid-cols-2 col-span-full",
          },
          address: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateTaxFreeDto.properties.address,
            name: "Form.address",
            extend: {
              "ui:className": "col-span-full grid grid-cols-1 md:grid-cols-2 gap-4",
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
            schema: $CreateTaxFreeDto.properties.email,
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
            ...{"ui:disabled": typeCode === "TAXFREE" && true},
            "ui:title": languageData["Form.TaxFree.typeCode"],
          },
          vatNumber: {
            ...{"ui:className": typeCode === "TAXFREE" && "col-span-full"},
            ...{"ui:required": typeCode === "HEADQUARTER" && true},
          },
          parentId: {
            "ui:className": "col-span-full",
            ...{"ui:disabled": typeCode === "TAXFREE" && true},
          },
          "ui:order": [
            "name",
            "taxOfficeId",
            "chainCodeId",
            "externalIdentifier",
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
        ...(typeCode === "TAXFREE" ? ["vatNumber", "taxOfficeId"] : []),
      ],
    }),
    [typeCode],
  );

  const fields = useMemo(() => {
    return {
      telephone: PhoneWithTypeField({
        languageData,
        typeOptions: $CreateTaxFreeDto.properties.telephone.properties.type.enum,
      }),
    };
  }, []);

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: CreateTaxFreeDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: CreateTaxFreeDto}) => {
      if (!editedFormData) return;

      startTransition(() => {
        void postTaxFreeApi({
          ...editedFormData,
          typeCode,
          parentId: typeCode === "TAXFREE" ? mergedFormData.parentId : undefined,
        }).then((response) => {
          handlePostResponse(response, router, {
            prefix: getBaseLink("parties/tax-free", lang),
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
      <SchemaForm<CreateTaxFreeDto>
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
        fields={fields}
        filter={filter}
        formData={form}
        id="create-tax-free-form"
        key={schemaFormKey}
        locale={lang}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        schema={$CreateTaxFreeDto}
        submitText={languageData["Form.TaxFree.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
        withScrollArea={false}
      />
    </FormReadyComponent>
  );
}
