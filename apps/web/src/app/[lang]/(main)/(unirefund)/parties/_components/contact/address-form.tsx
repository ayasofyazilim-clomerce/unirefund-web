"use client";

import {toast} from "@/components/ui/sonner";
import {AddressField} from "@repo/ui/components/address/field";

import {Switch} from "@/components/ui/switch";
import {
  $UniRefund_CRMService_Addresses_AddressDto as $AddressDto,
  UniRefund_CRMService_Addresses_AddressDto as AddressDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {putMerchantAddressesByMerchantIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";

import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams} from "next/navigation";
import {TransitionStartFunction, useTransition} from "react";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
export function AddressForm({
  languageData,
  addresses,
}: {
  languageData: CRMServiceServiceResource;
  addresses: AddressDto[];
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const [isPending, startTransition] = useTransition();

  const columns = tanstackTableCreateColumnsByRowData<AddressDto>({
    rows: $AddressDto.properties,
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "CRM.address",
    },
    custom: {
      isPrimary: {
        showHeader: true,
        content: (row) =>
          IsPrimaryAction({row, partyId, isPending, startTransition, languageData, isActive: addresses.length === 1}),
      },
      type: {
        showHeader: true,
        content: (row) => <div> {(row.type && languageData[`CRM.address.type.${row.type}`]) || row.type}</div>,
      },
    },
    expandRowTrigger: "addressLine",
  });
  const tableActions: TanstackTableTableActionsType<AddressDto>[] = [
    {
      actionLocation: "table",
      cta: languageData["CRM.address.create"],
      type: "schemaform-dialog",
      schema: $AddressDto,

      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressDto,
        name: "CRM.address",
        extend: {"ui:field": "address"},
      }),
      fields: {
        address: AddressField({
          className: "col-span-full p-4 border rounded-md",
          languageData: languageData,
          hiddenFields: ["latitude", "longitude", "placeId", "isPrimary"],
        }),
      },
      formData: {
        type: "WORK",
      },
      disabled: isPending,
      filter: {type: "exclude", keys: ["id", "isPrimary"]},
      submitText: languageData["CRM.address.create"],
      title: languageData["CRM.address.create"],
      onSubmit: () => {
        startTransition(() => {
          toast.error(languageData.NotImplemented);
        });
      },
    },
  ];

  return (
    <TanstackTable
      title={languageData["CRM.addresses"]}
      columnVisibility={{
        columns: ["addressLine", "type", "isPrimary"],
        type: "show",
      }}
      columns={columns}
      data={addresses}
      columnOrder={["addressLine", "type", "isPrimary"]}
      expandedRowComponent={(row) => EditForm({row, languageData, partyId, isPending, startTransition})}
      fillerColumn="addressLine"
      showPagination={false}
      tableActions={tableActions}
    />
  );
}

function EditForm({
  row,
  partyId,
  languageData,
  isPending,
  startTransition,
}: {
  row: AddressDto;
  partyId: string;
  languageData: CRMServiceServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  return (
    <SchemaForm<AddressDto>
      key={JSON.stringify(row)}
      schema={$AddressDto}
      fields={{
        address: AddressField({
          className: "col-span-full p-2 bg-white",
          languageData: languageData,
          hiddenFields: ["latitude", "longitude", "placeId", "isPrimary"],
        }),
      }}
      withScrollArea={false}
      defaultSubmitClassName="p-2 pt-0"
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressDto,
        name: "CRM.address",
        extend: {
          "ui:field": "address",
        },
      })}
      disabled={isPending}
      filter={{type: "exclude", keys: ["id", "isPrimary"]}}
      formData={row}
      submitText={languageData["CRM.address.update"]}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putMerchantAddressesByMerchantIdApi({
            merchantId: partyId,
            requestBody: formData,
          }).then((response) => {
            handlePutResponse(response);
          });
        });
      }}
    />
  );
}

function IsPrimaryAction({
  row,
  partyId,
  isActive,
  isPending,
  startTransition,
  languageData,
}: {
  row: AddressDto;
  partyId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: CRMServiceServiceResource;
}) {
  const switchComponent = (
    <Switch
      disabled={isActive || isPending}
      checked={row.isPrimary === true}
      onCheckedChange={() => {
        startTransition(() => {
          void putMerchantAddressesByMerchantIdApi({
            merchantId: partyId,
            requestBody: {
              id: row.id,
              isPrimary: !row.isPrimary,
            },
          }).then((response) => {
            handlePutResponse(response);
          });
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
        <TooltipContent>{languageData["CRM.Messages.address.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
