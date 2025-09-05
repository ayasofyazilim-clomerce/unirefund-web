import {cn} from "@/lib/utils";
import type {UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualDto} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Individuals_CreateIndividualDto as $CreateIndividualDto} from "@repo/saas/CRMService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {AddressField} from "@repo/ui/components/address/field";
import {useParams, useRouter} from "next/navigation";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import type {TransitionStartFunction} from "react";
import {postIndividualApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {handlePostResponse} from "@repo/utils/api";
import {NewUserField} from "@/app/[lang]/(main)/(unirefund)/parties/_components/new-user";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {PhoneWithTypeField} from "./contact/phone-with-type";
import {EmailWithTypeField} from "./contact/email-with-type";

export function CreateIndividualForm({
  languageData,
  children,
  className,
  isPending,
  startTransition,
  onSubmit,
  useDefaultSubmit = false,
}: {
  languageData: CRMServiceServiceResource;
  children?: React.ReactNode;
  className?: string;
  isPending?: boolean;
  startTransition: TransitionStartFunction;
  onSubmit?: (response: {data: CreateIndividualDto; type: "success" | "api-error"; message?: string}) => void;
  useDefaultSubmit?: boolean;
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    name: "Form.Individual",
    schema: $CreateIndividualDto,
    extend: {
      "ui:className": cn("grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto", className),
      isPersonalCompany: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md",
      },
      telephone: {
        "ui:className": "col-span-full",
        "ui:field": "phone",
      },
      address: createUiSchemaWithResource({
        resources: languageData,
        schema: $CreateIndividualDto.properties.address,
        name: "CRM.address",
        extend: {"ui:field": "address"},
      }),
      email: {
        "ui:className": "col-span-full",
        "ui:field": "email",
        "ui:autocomplete": "off",
      },
      newUser: {
        "ui:field": "newUser",
        username: {
          "ui:autocomplete": "off",
        },
        password: {
          "ui:widget": "password",
          "ui:autocomplete": "off",
          "ui:showGenerator": true,
        },
      },
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
    newUser: (props: FieldProps) => NewUserField({...props, label: languageData["Form.Individual.createAccount"]}),
  };

  return (
    <SchemaForm<CreateIndividualDto>
      className="p-0"
      disabled={isPending}
      fields={fields}
      filter={{
        type: "exclude",
        keys: ["id", "email.id", "email.isPrimary", "telephone.id", "telephone.isPrimary"],
      }}
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void postIndividualApi(formData).then((response) => {
            if (onSubmit) {
              onSubmit({
                data: {
                  ...formData,
                  id: response.data,
                },
                type: response.type,
                message: response.message,
              });
            } else {
              handlePostResponse(response, router);
            }
          });
        });
      }}
      schema={$CreateIndividualDto}
      uiSchema={uiSchema}
      useDefaultSubmit={useDefaultSubmit}>
      {children}
    </SchemaForm>
  );
}
