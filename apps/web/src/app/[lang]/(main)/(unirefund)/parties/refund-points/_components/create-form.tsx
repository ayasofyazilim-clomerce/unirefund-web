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
import {
  $UniRefund_CRMService_Addresses_AddressDto as $AddressDto,
  $UniRefund_CRMService_RefundPoints_CreateRefundPointDto as $CreateRefundPointDto,
} from "@repo/saas/CRMService";
import {AddressField} from "@repo/ui/components/address/field";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useMemo, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {EmailWithTypeField} from "../../_components/contact/email-with-type";
import {PhoneWithTypeField} from "../../_components/contact/phone-with-type";
import {CheckIsFormReady} from "../../_components/is-form-ready";

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
    adminAreaLevel1Id: "",
    adminAreaLevel2Id: "",
    countryId: "",
  },
};
export default function CreateRefundPointForm({
  taxOfficeList,
  refundPointList,
  languageData,
  typeCode,
  formData,
  parentDetails,
}: {
  taxOfficeList: TaxOfficeDto[];
  refundPointList?: RefundPointDto[];
  languageData: CRMServiceServiceResource;
  formData?: Partial<CreateRefundPointDto>;
  parentDetails?: RefundPointDto;
  typeCode?: "HEADQUARTER" | "REFUNDPOINT";
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mergedFormData = useMemo(() => ({...DEFAULT_FORMDATA, ...formData}), []);
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.RefundPoint",
    schema: $CreateRefundPointDto,
    extend: {
      "ui:className": "grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto",
      taxOfficeId: {
        ...{"ui:disabled": typeCode === "REFUNDPOINT" && true},
        "ui:widget": "taxOfficeWidget",
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
        schema: $AddressDto,
        name: "CRM.address",
        extend: {"ui:field": "address"},
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
        ...{"ui:disabled": typeCode === "REFUNDPOINT" && true},
        "ui:title": languageData["Form.RefundPoint.typeCode"],
      },
      vatNumber: {
        "ui:className": "col-span-full",
      },
      parentId: {
        "ui:className": "col-span-full",
        "ui:widget": "refundPointWidget",
        ...{"ui:disabled": typeCode === "REFUNDPOINT" && true},
      },
      "ui:order": [
        "name",
        "taxOfficeId",
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
      list: taxOfficeList,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
    refundPointWidget: CustomComboboxWidget<RefundPointDto>({
      list: refundPointList || list,
      selectLabel: "name",
      selectIdentifier: "id",
      languageData,
    }),
  };

  const isFormReady = CheckIsFormReady({
    lang,
    languageData,
    taxOfficeListLength: taxOfficeList.length,
  });
  return (
    <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
      <SchemaForm<CreateRefundPointDto>
        defaultSubmitClassName="max-w-2xl mx-auto [&>button]:w-full"
        disabled={isPending}
        fields={fields}
        filter={{
          type: "exclude",
          keys: ["email.id", "email.isPrimary", "telephone.id", "telephone.isPrimary", "typeCode", "parentId"],
        }}
        formData={{
          ...mergedFormData,
          taxOfficeId: mergedFormData.taxOfficeId || taxOfficeList[0]?.id,
        }}
        id="create-refund-point-form"
        locale={lang}
        onSubmit={({formData: editedFormData}) => {
          if (!editedFormData) return;
          startTransition(() => {
            void postRefundPointApi({...editedFormData, typeCode: "HEADQUARTER"}).then((response) => {
              handlePostResponse(response, router, {
                prefix: getBaseLink("parties/refund-points"),
                suffix: "details",
              });
            });
          });
        }}
        schema={$CreateRefundPointDto}
        submitText={languageData["Form.RefundPoint.Create"]}
        uiSchema={uiSchema}
        widgets={widgets}
      />
    </FormReadyComponent>
  );
}
