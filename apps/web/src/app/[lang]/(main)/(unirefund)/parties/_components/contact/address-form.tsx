"use client";

import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {
  UniRefund_CRMService_Addresses_AddressDto as AddressDto,
  UniRefund_CRMService_Addresses_AddressUpSertDto as AddressUpSertDto,
} from "@repo/saas/CRMService";
import {
  $UniRefund_CRMService_Addresses_AddressDto as $AddressDto,
  $UniRefund_CRMService_Addresses_AddressUpSertDto as $AddressUpSertDto,
} from "@repo/saas/CRMService";
import {createAddressWidgets} from "@repo/ui/components/address/address-form-widgets";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useCallback, useState, useTransition} from "react";
import type {DefaultResource} from "@/language-data/core/Default";
import type {PartyType} from "../party-header";
import {addressActionByPartyType} from "./utils";

export function AddressForm({
  languageData,
  addresses,
  partyType,
}: {
  languageData: DefaultResource;
  addresses: AddressDto[];
  partyType: PartyType;
}) {
  const router = useRouter();
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const [isPending, startTransition] = useTransition();

  const columns = tanstackTableCreateColumnsByRowData<AddressDto>({
    rows: $AddressDto.properties,
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "Form.address",
    },
    custom: {
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({
            row,
            partyId,
            partyType,
            isPending,
            startTransition,
            languageData,
            isActive: addresses.length === 1 && row.isPrimary,
            router,
          }),
      },
      type: {
        showHeader: true,
        content: (row) => TypeRow({row, languageData}),
      },
    },
    expandRowTrigger: "addressLine",
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddressUpSertDto>();
  const {widgets, schemaFormKey} = createAddressWidgets({languageData})();
  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: AddressUpSertDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: AddressUpSertDto}) => {
      if (!editedFormData) return;
      startTransition(() => {
        addressActionByPartyType({requestBody: {...editedFormData, isPrimary: false}, partyType, partyId, router});
      });
    },
    [partyType, partyId, router, startTransition],
  );

  const tableActions: TanstackTableTableActionsType<AddressDto>[] = [
    {
      type: "simple",
      cta: languageData["Form.address.create"],
      actionLocation: "table",
      onClick: () => {
        setOpen(true);
      },
    },
  ];
  return (
    <>
      <TanstackTable
        columnOrder={["addressLine", "type", "isPrimary"]}
        columnVisibility={{
          columns: ["addressLine", "type", "isPrimary"],
          type: "show",
        }}
        columns={columns}
        data={addresses}
        expandedRowComponent={(row) => EditForm({row, languageData, partyId, partyType, isPending, startTransition})}
        fillerColumn="addressLine"
        showPagination={false}
        tableActions={tableActions}
        title={languageData["Form.addresses"]}
      />
      <Dialog modal onOpenChange={setOpen} open={open}>
        <DialogContent>
          <SchemaForm<AddressUpSertDto>
            className="pr-0"
            disabled={isPending}
            filter={{
              type: "exclude",
              keys: ["addressId", "partyType", "partyId", "placeId", "latitude", "longitude", "isPrimary"],
            }}
            formData={form}
            id="create-address-form"
            key={schemaFormKey}
            locale={lang}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            schema={$AddressUpSertDto}
            submitText={languageData["Form.address.create"]}
            uiSchema={createUiSchemaWithResource({
              resources: languageData,
              schema: $AddressUpSertDto,
              name: "Form.address",
              extend: {
                "ui:className": "border-none rounded-none p-0 h-full p-px",
                displayLabel: false,
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
            })}
            widgets={widgets}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function TypeRow({row, languageData}: {row: AddressDto; languageData: DefaultResource}) {
  return <div> {languageData[`Form.address.type.${row.type}`]}</div>;
}

function EditForm({
  row,
  partyId,
  partyType,
  languageData,
  isPending,
  startTransition,
}: {
  row: AddressDto;
  partyId: string;
  partyType: PartyType;
  languageData: DefaultResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  const router = useRouter();
  const [form, setForm] = useState<AddressUpSertDto>(row);
  const {widgets, schemaFormKey} = createAddressWidgets({languageData})({initialValue: row});

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: AddressUpSertDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);
  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: AddressUpSertDto}) => {
      if (!editedFormData) return;
      startTransition(() => {
        addressActionByPartyType({requestBody: {...editedFormData, addressId: row.id}, partyType, partyId, router});
      });
    },
    [partyType, partyId, router, startTransition],
  );
  return (
    <SchemaForm<AddressUpSertDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
      filter={{
        type: "exclude",
        keys: ["addressId", "partyType", "partyId", "placeId", "latitude", "longitude", "isPrimary"],
      }}
      formData={form}
      id="edit-address-form"
      key={schemaFormKey}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
      schema={$AddressUpSertDto}
      submitText={languageData["Form.address.update"]}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressUpSertDto,
        name: "Form.address",
        extend: {
          displayLabel: false,
          "ui:className": "border-none rounded-none p-2",
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
      })}
      widgets={widgets}
      withScrollArea={false}
    />
  );
}

function IsPrimaryAction({
  row,
  partyId,
  partyType,
  isActive,
  isPending,
  startTransition,
  languageData,
  router,
}: {
  row: AddressDto;
  partyId: string;
  partyType: PartyType;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: DefaultResource;
  router: AppRouterInstance;
}) {
  const switchComponent = (
    <Switch
      checked={row.isPrimary}
      data-testid="address-is-primary"
      disabled={isActive || isPending}
      onCheckedChange={(value) => {
        startTransition(() => {
          addressActionByPartyType({requestBody: {isPrimary: value, addressId: row.id}, partyType, partyId, router});
        });
      }}
    />
  );

  if (isActive) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex size-full items-center justify-center">{switchComponent}</div>
        </TooltipTrigger>
        <TooltipContent>{languageData["Messages.address.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
