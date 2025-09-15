import {cn} from "@/lib/utils";
import {postIndividualApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualDto} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Individuals_CreateIndividualDto as $CreateIndividualDto} from "@repo/saas/CRMService";
import {createAddressWidgets} from "@repo/ui/components/address/address-form-widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useMemo, useState, type TransitionStartFunction} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {NewUserField} from "@/app/[lang]/(main)/(unirefund)/parties/_components/new-user";

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
  const AddressWidgets = createAddressWidgets({languageData});
  const {widgets, schemaFormKey} = AddressWidgets();

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
          telephone: createUiSchemaWithResource({
            resources: languageData,
            schema: $CreateIndividualDto.properties.telephone,
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
            schema: $CreateIndividualDto.properties.address,
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
            schema: $CreateIndividualDto.properties.email,
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
      }),
    [languageData],
  );

  const fields = useMemo(
    () => ({
      newUser: (props: FieldProps) => NewUserField({...props, label: languageData["Form.Individual.createAccount"]}),
    }),
    [],
  );

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: CreateIndividualDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: CreateIndividualDto}) => {
      if (!editedFormData) return;

      startTransition(() => {
        void postIndividualApi(editedFormData).then((response) => {
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
        keys: [
          "id",
          "email.id",
          "email.isPrimary",
          "telephone.id",
          "telephone.isPrimary",
          "address.partyType",
          "address.partyId",
          "address.placeId",
          "address.latitude",
          "address.longitude",
          "address.isPrimary",
        ],
      }}
      formData={form}
      id="create-individual-form"
      key={schemaFormKey}
      locale={lang}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
      schema={$CreateIndividualDto}
      uiSchema={uiSchema}
      useDefaultSubmit={useDefaultSubmit}
      widgets={widgets}>
      {children}
    </SchemaForm>
  );
}
