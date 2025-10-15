"use client";
import {postRefundPointApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_RefundPoints_CreateRefundPointDto as CreateRefundPointDto,
  UniRefund_CRMService_RefundPoints_RefundPointDto as RefundPointDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_RefundPoints_CreateRefundPointDto as $CreateRefundPointDto} from "@repo/saas/CRMService";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useMemo, useState, useTransition} from "react";
import {createAddressWidgets} from "@repo/ui/components/address/address-form-widgets";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {CheckIsFormReady} from "../../_components/is-form-ready";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";

const DEFAULT_FORMDATA: CreateRefundPointDto = {
  name: "",
  typeCode: "HEADQUARTER",
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
export default function CreateRefundPointForm({
  taxOfficeList = [],
  refundPointList,
  languageData,
  typeCode = "HEADQUARTER",
  formData,
}: {
  taxOfficeList?: TaxOfficeDto[];
  refundPointList?: RefundPointDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateRefundPointDto>;
  typeCode?: "HEADQUARTER" | "REFUNDPOINT";
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

  const [form, setForm] = useState<CreateRefundPointDto>(mergedFormData);

  const {widgets: addressWidgets, schemaFormKey} = createAddressWidgets({languageData})({initialValue: form.address});

  const uiSchema = useMemo(
    () =>
      createUiSchemaWithResource({
        resources: languageData,
        name: "Form.RefundPoint",
        schema: $CreateRefundPointDto,
        extend: {
          "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
          taxOfficeId: {
            ...{"ui:disabled": typeCode === "REFUNDPOINT" && true},
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
            "ui:required": true,
          },
          address: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateRefundPointDto.properties.address,
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
            schema: $CreateRefundPointDto.properties.email,
            name: "Form.email",
            extend: {
              "ui:className":
                "col-span-full border-none grid-cols-1 grid md:grid-cols-2 p-0 border-0 gap-y-2 gap-x-4 [&_*:is(input,button)]:h-9",
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
            ...{"ui:disabled": typeCode === "REFUNDPOINT" && true},
            "ui:title": languageData["Form.RefundPoint.typeCode"],
          },
          vatNumber: {
            ...{"ui:className": typeCode === "REFUNDPOINT" && "col-span-full"},
            ...{"ui:required": typeCode === "HEADQUARTER" && true},
          },
          parentId: {
            "ui:className": "col-span-full",
            ...{"ui:disabled": typeCode === "REFUNDPOINT" && true},
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
    [refundPointList, taxOfficeList, languageData, addressWidgets],
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
        ...(typeCode === "REFUNDPOINT" ? ["vatNumber", "taxOfficeId"] : []),
      ],
    }),
    [typeCode],
  );

  const fields = useMemo(() => {
    return {
      telephone: PhoneWithTypeField({
        languageData,
        typeOptions: $CreateRefundPointDto.properties.telephone.properties.type.enum,
      }),
    };
  }, []);

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: CreateRefundPointDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: CreateRefundPointDto}) => {
      if (!editedFormData) return;

      startTransition(() => {
        void postRefundPointApi({
          ...editedFormData,
          typeCode,
          parentId: typeCode === "REFUNDPOINT" ? mergedFormData.parentId : undefined,
        }).then((response) => {
          handlePostResponse(response, router, {
            prefix: getBaseLink("parties/refund-points", lang),
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
      <SchemaForm<CreateRefundPointDto>
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
        fields={fields}
        filter={filter}
        formData={form}
        id="create-refund-point-form"
        key={schemaFormKey}
        locale={lang}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        schema={$CreateRefundPointDto}
        submitText={languageData["Form.RefundPoint.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
        withScrollArea={false}
      />
    </FormReadyComponent>
  );
}
