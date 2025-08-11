"use client";

import {toast} from "@/components/ui/sonner";
import type {
  UniRefund_TravellerService_TravellerDocuments_TravellerDocumentProfileDto as TravellerDocumentProfileDto,
  UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto as UpdateTravellerDocumentDto,
} from "@ayasofyazilim/saas/TravellerService";
import {
  $UniRefund_TravellerService_TravellerDocuments_TravellerDocumentProfileDto as $TravellerDocumentProfileDto,
  $UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto as $UpdateTravellerDocumentDto,
} from "@ayasofyazilim/saas/TravellerService";
import {putTravellerDocumentApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

export function TravellerDocumentsForm({
  languageData,
  travellerDocuments,
}: {
  languageData: TravellerServiceResource;
  travellerDocuments: TravellerDocumentProfileDto[];
}) {
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const [isPending, startTransition] = useTransition();

  const columns = tanstackTableCreateColumnsByRowData<TravellerDocumentProfileDto>({
    rows: $TravellerDocumentProfileDto.properties,
    config: {
      locale: lang,
    },
    languageData: {
      languageData,
      constantKey: "Form",
    },
    custom: {
      identificationType: {
        showHeader: true,
        content: (row) =>
          languageData[`Form.identificationType.${row.identificationType}` as keyof typeof languageData],
      },
    },
    expandRowTrigger: "travelDocumentNumber",
  });
  const tableActions: TanstackTableTableActionsType<TravellerDocumentProfileDto>[] = [
    {
      actionLocation: "table",
      cta: languageData["Travellers.New.Document"],
      type: "schemaform-dialog",
      schema: $TravellerDocumentProfileDto,

      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $TravellerDocumentProfileDto,
        name: "Travellers",
        extend: {"ui:field": "address"},
      }),
      disabled: isPending,
      filter: {type: "exclude", keys: ["travellerId", "firstName", "lastName"]},
      submitText: languageData["Travellers.New.Document"],
      title: languageData["Travellers.New.Document"],
      onSubmit: () => {
        startTransition(() => {
          toast.error(languageData.NotImplemented);
        });
      },
    },
  ];

  return (
    <TanstackTable
      columnOrder={["travelDocumentNumber", "fullName"]}
      columnVisibility={{
        type: "hide",
        columns: ["id", "firstName", "lastName", "birthDate", "residenceCountryCode2", "nationalityCountryCode2"],
      }}
      columns={columns}
      data={travellerDocuments}
      expandedRowComponent={(row) => EditForm({row, languageData, partyId, isPending, startTransition})}
      fillerColumn="travelDocumentNumber"
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
  row: TravellerDocumentProfileDto;
  partyId: string;
  languageData: TravellerServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  return (
    <SchemaForm<UpdateTravellerDocumentDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
      filter={{type: "exclude", keys: ["id"]}}
      formData={row}
      key={JSON.stringify(row)}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putTravellerDocumentApi({
            id: partyId,
            requestBody: {
              id: row.id || "",
              ...formData,
            },
          }).then((response) => {
            handlePutResponse(response);
          });
        });
      }}
      schema={$UpdateTravellerDocumentDto}
      submitText={languageData.Save}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $UpdateTravellerDocumentDto,
        name: "Form",
        extend: {
          "ui:className": "grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-2",
        },
      })}
      withScrollArea={false}
    />
  );
}
