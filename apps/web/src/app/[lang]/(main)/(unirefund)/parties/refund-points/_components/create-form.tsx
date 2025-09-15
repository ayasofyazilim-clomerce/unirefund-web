"use client";
import type { CRMServiceServiceResource } from "@/language-data/unirefund/CRMService";
import { getBaseLink } from "@/utils";
import { postRefundPointApi } from "@repo/actions/unirefund/CrmService/post-actions";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {
  UniRefund_CRMService_RefundPoints_CreateRefundPointDto as CreateRefundPointDto,
  UniRefund_CRMService_RefundPoints_RefundPointDto as RefundPointDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeDto as TaxOfficeDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_RefundPoints_CreateRefundPointDto as $CreateRefundPointDto
} from "@repo/saas/CRMService";
import { FormReadyComponent } from "@repo/ui/form-ready";
import { handlePostResponse } from "@repo/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { createAddressWidgets } from "../../_components/contact/address/address-form-widgets";
import { CheckIsFormReady } from "../../_components/is-form-ready";

const DEFAULT_FORMDATA: CreateRefundPointDto = {
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
export default function CreateRefundPointForm({
  taxOfficeList,
  refundPointList,
  languageData,
  typeCode = "HEADQUARTER",
  parentDetails,
  formData,
}: {
  taxOfficeList: TaxOfficeDto[];
  refundPointList?: RefundPointDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateRefundPointDto>;
  parentDetails?: RefundPointDto;
  typeCode?: "HEADQUARTER" | "REFUNDPOINT";
}) {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mergedFormData = useMemo(() => ({
    ...DEFAULT_FORMDATA,
    ...formData
  }), [formData]);

  const [form, setForm] = useState<CreateRefundPointDto>(mergedFormData);

  const { widgets: addressWidgets, schemaFormKey } = createAddressWidgets({ languageData })();

  const uiSchema = useMemo(() => createUiSchemaWithResource({
    resources: languageData,
    name: "Form.RefundPoint",
    schema: $CreateRefundPointDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
      taxOfficeId: {
        ...{ "ui:disabled": typeCode === "REFUNDPOINT" && true },
        "ui:widget": "taxOfficeWidget",
      },
      isPersonalCompany: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md col-span-full",
      },
      telephone: createUiSchemaWithResource({
        resources: languageData,
        schema: $CreateRefundPointDto.properties.telephone,
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
        schema: $CreateRefundPointDto.properties.address,
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
        schema: $CreateRefundPointDto.properties.email,
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
        ...{ "ui:disabled": typeCode === "REFUNDPOINT" && true },
        "ui:title": languageData["Form.RefundPoint.typeCode"],
      },
      vatNumber: {
        ...{ "ui:className": typeCode === "REFUNDPOINT" && "col-span-full" },
      },
      parentId: {
        "ui:className": "col-span-full",
        "ui:widget": "merchantWidget",
        ...{ "ui:disabled": typeCode === "REFUNDPOINT" && true },
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
    merchantWidget: CustomComboboxWidget<RefundPointDto>({
      list: refundPointList || list,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
    ...addressWidgets,
  }), [refundPointList, taxOfficeList, languageData, addressWidgets]);

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
      ...(typeCode === "REFUNDPOINT" ? ["vatNumber", "taxOfficeId"] : [])
    ],
  }), [typeCode]);

  const handleFormChange = useCallback(({ formData: editedFormData }: { formData?: CreateRefundPointDto }) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(({ formData: editedFormData }: { formData?: CreateRefundPointDto }) => {
    if (!editedFormData) return;

    startTransition(() => {
      void postRefundPointApi({
        ...editedFormData,
        typeCode: typeCode,
        parentId: typeCode === "REFUNDPOINT" ? mergedFormData.parentId : undefined,
      }).then((response) => {
        console.log(response);
        handlePostResponse(response, router, {
          prefix: getBaseLink("parties/refund-points", lang),
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
      <SchemaForm<CreateRefundPointDto>
        key={schemaFormKey}
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
        filter={filter}
        onChange={handleFormChange}
        formData={form}
        id="create-refund-point-form"
        locale={lang}
        onSubmit={handleFormSubmit}
        schema={$CreateRefundPointDto}
        submitText={languageData["Form.RefundPoint.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
      />
    </FormReadyComponent>
  );
}
