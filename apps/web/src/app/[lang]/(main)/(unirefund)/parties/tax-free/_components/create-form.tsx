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

const DEFAULT_FORMDATA: CreateTaxFreeDto = {
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
          "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
          taxOfficeId: {
            ...{"ui:disabled": typeCode === "TAXFREE" && true},
            "ui:widget": "taxOfficeWidget",
          },
          isPersonalCompany: {
            "ui:widget": "switch",
            "ui:className": "border px-2 rounded-md col-span-full",
          },
          telephone: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateTaxFreeDto.properties.telephone,
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
            schema: $CreateTaxFreeDto.properties.address,
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
            schema: $CreateTaxFreeDto.properties.email,
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
            ...{"ui:disabled": typeCode === "TAXFREE" && true},
            "ui:title": languageData["Form.TaxFree.typeCode"],
          },
          vatNumber: {
            ...{"ui:className": typeCode === "TAXFREE" && "col-span-full"},
          },
          parentId: {
            "ui:className": "col-span-full",
            ...{"ui:disabled": typeCode === "TAXFREE" && true},
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
        ...(typeCode === "TAXFREE" ? ["vatNumber", "taxOfficeId"] : []),
      ],
    }),
    [typeCode],
  );

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
    <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
      <SchemaForm<CreateTaxFreeDto>
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
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
      />
    </FormReadyComponent>
  );
}
