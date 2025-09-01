"use client";

import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type {
  UniRefund_TravellerService_Addresses_AddressUpSertDto as AddressUpSertDto,
  UniRefund_TravellerService_Addresses_AddressDto as AddressDto
} from "@repo/saas/TravellerService";
import {
  $UniRefund_TravellerService_Addresses_AddressUpSertDto as $AddressUpSertDto,
  $UniRefund_TravellerService_Addresses_AddressDto as $AddressDto
} from "@repo/saas/TravellerService";
import { putTravellerAddressesByTravellerIdApi } from "@repo/actions/unirefund/TravellerService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { TanstackTableTableActionsType } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { handlePutResponse } from "@repo/utils/api";
import { useParams, useRouter } from "next/navigation";
import type { TransitionStartFunction } from "react";
import { useTransition } from "react";
import type { TravellerServiceResource } from "@/language-data/unirefund/TravellerService";

export function AddressForm({ languageData, addresses }: { languageData: TravellerServiceResource; addresses: AddressDto[] }) {
  const { lang, travellerId } = useParams<{ lang: string; travellerId: string }>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
          IsPrimaryAction({ row, travellerId, isPending, startTransition, languageData, isActive: addresses.length === 1 }),
      },
      type: {
        showHeader: true,
        content: (row) => TypeRow({ row, languageData }),
      },
    },
    expandRowTrigger: "fullAddress",
  });
  const tableActions: TanstackTableTableActionsType<AddressDto>[] = [
    {
      actionLocation: "table",
      cta: languageData["Form.address.create"],
      type: "schemaform-dialog",
      schema: $AddressUpSertDto,
      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressUpSertDto,
        name: "Form.address",
      }),
      formData: {
        type: "HOME",
      },
      withScrollArea: false,
      disabled: isPending,
      filter: { type: "exclude", keys: ["addressId", "isPrimary"] },
      submitText: languageData["Form.address.create"],
      title: languageData["Form.address.create"],
      onSubmit: (formData) => {
        if (!formData) return;
        const data = {
          id: travellerId,
          requestBody: {
            isPrimary: addresses.length === 0,
            ...formData,
          },
        };
        startTransition(() => {
          void putTravellerAddressesByTravellerIdApi(data).then((response) => {
            handlePutResponse(response, router);
          });
        });
      },
    },
  ];
  return (
    <TanstackTable
      columnVisibility={{
        columns: ["fullAddress", "isPrimary", "type"],
        type: "show",
      }}
      columns={columns}
      data={addresses}
      expandedRowComponent={(row) => EditForm({ row, lang, languageData, travellerId, isPending, startTransition })}
      fillerColumn="fullAddress"
      showPagination={false}
      tableActions={tableActions}
      title={languageData["Form.addresses"]}
    />
  );
}

function TypeRow({ row, languageData }: { row: AddressUpSertDto; languageData: TravellerServiceResource }) {
  return <div> {(row.type && languageData[`Form.address.type.${row.type}`]) || row.type}</div>;
}

function EditForm({
  row,
  lang,
  travellerId,
  languageData,
  isPending,
  startTransition,
}: {
  row: AddressUpSertDto;
  lang: string;
  travellerId: string;
  languageData: TravellerServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  const router = useRouter();
  return (
    <SchemaForm<AddressUpSertDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
      filter={{ type: "exclude", keys: ["addressId", "isPrimary"] }}
      formData={row}
      key={JSON.stringify(row)}
      locale={lang}
      onSubmit={({ formData }) => {
        if (!formData) return;
        const data = {
          id: travellerId,
          requestBody: {
            addressId: row.addressId,
            ...formData,
          },
        };
        startTransition(() => {
          void putTravellerAddressesByTravellerIdApi(data).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$AddressUpSertDto}
      submitText={languageData["Form.address.update"]}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressUpSertDto,
        name: "Form.address",
        extend: {
          "ui:className": "p-2 bg-white border-none rounded-none",
          displayLabel: false,
        },
      })}
      withScrollArea={false}
    />
  );
}

function IsPrimaryAction({
  row,
  travellerId,
  isActive,
  isPending,
  startTransition,
  languageData,
}: {
  row: AddressUpSertDto;
  travellerId: string;
  isActive: boolean;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: TravellerServiceResource;
}) {
  const switchComponent = (
    <Switch
      checked={row.isPrimary === true}
      disabled={isActive || isPending}
      onCheckedChange={() => {
        startTransition(() => {
          void putTravellerAddressesByTravellerIdApi({
            id: travellerId,
            requestBody: {
              addressId: row.addressId,
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
        <TooltipContent>{languageData["Messages.address.isPrimary.atLeastOnePrimaryRequired"]}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="flex items-center justify-center">{switchComponent}</div>;
}
