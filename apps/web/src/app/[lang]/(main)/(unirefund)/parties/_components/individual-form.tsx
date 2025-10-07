"use client";
import {cn} from "@/lib/utils";
import {postIndividualApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualDto} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Individuals_CreateIndividualDto as $CreateIndividualDto} from "@repo/saas/CRMService";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useMemo, useState, type TransitionStartFunction} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {NewUserField} from "@/app/[lang]/(main)/(unirefund)/parties/_components/new-user";
import {PhoneWithTypeField} from "./contact/phone-with-type";

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

  const [form, setForm] = useState<CreateIndividualDto>();
  const uiSchema = useMemo(
    () =>
      createUiSchemaWithResource({
        resources: languageData,
        name: "Form.Individual",
        schema: $CreateIndividualDto,
        extend: {
          displayLabel: false,
          "ui:className": cn("border-none grid md:grid-cols-2 gap-4 items-end max-w-2xl mx-auto", className),
          isPersonalCompany: {
            "ui:widget": "switch",
            "ui:className": "border px-2 rounded-md",
          },
          telephone: {
            "ui:field": "telephone",
            "ui:className": "grid grid-cols-2 col-span-full",
          },
          email: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateIndividualDto.properties.email,
            name: "Form.email",
            extend: {
              "ui:className":
                "col-span-full border-none grid grid-cols-2 p-0 border-0 gap-y-2 gap-x-4 [&_*:is(input,button)]:h-9",
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
          newUser: {
            "ui:field": "newUser",
            username: {
              "ui:autocomplete": "off",
              "ui:disabled": true,
            },
            password: {
              "ui:widget": "password",
              "ui:autocomplete": "off",
              "ui:showGenerator": true,
            },
          },
          "ui:order": [
            "firstname",
            "lastname",
            "gender",
            "identificationNumber",
            "birthDate",
            "notes",
            "telephone",
            "email",
            "address",
            "newUser",
          ],
        },
      }),
    [languageData],
  );

  const fields = useMemo(
    () => ({
      newUser: (props: FieldProps) => NewUserField({...props, label: languageData["Form.Individual.createAccount"]}),
      telephone: PhoneWithTypeField({
        languageData,
        typeOptions: $CreateIndividualDto.properties.telephone.properties.type.enum,
      }),
    }),
    [],
  );

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: CreateIndividualDto}) => {
    if (editedFormData) {
      setForm({
        ...editedFormData,
        newUser: {
          username:
            editedFormData.email?.emailAddress && editedFormData.email.emailAddress.includes("@")
              ? editedFormData.email.emailAddress.split("@")[0]
              : "",
          password: editedFormData.newUser?.password || "",
        },
      });
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: CreateIndividualDto}) => {
      if (!editedFormData) return;

      startTransition(() => {
        void postIndividualApi({
          ...editedFormData,
          ...(editedFormData.telephone && {
            telephone: {
              ...editedFormData.telephone,
              isPrimary: true,
            },
          }),
          ...(editedFormData.email && {
            email: {
              ...editedFormData.email,
              isPrimary: true,
            },
          }),
          ...(editedFormData.address && {
            address: {
              ...editedFormData.address,
              isPrimary: true,
            },
          }),
        }).then((response) => {
          if (onSubmit) {
            onSubmit({
              data: {
                ...editedFormData,
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
    },
    [router],
  );

  return (
    <SchemaForm<CreateIndividualDto>
      className="p-0"
      disabled={isPending}
      fields={fields}
      filter={{
        type: "exclude",
        keys: ["id", "email.id", "email.isPrimary", "telephone.id", "telephone.isPrimary", "address"],
      }}
      formData={form}
      id="create-individual-form"
      locale={lang}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
      schema={$CreateIndividualDto}
      uiSchema={uiSchema}
      useDefaultSubmit={useDefaultSubmit}>
      {children}
    </SchemaForm>
  );
}
