"use client";

import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import type {
  UniRefund_TravellerService_TravellerDocuments_TravellerDocumentProfileDto as TravellerDocumentProfileDto,
  UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
  UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto as UpdateTravellerDocumentDto,
} from "@ayasofyazilim/unirefund-saas-dev/TravellerService";
import {
  $UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto as $CreateTravellerDocumentDto,
  $UniRefund_TravellerService_TravellerDocuments_TravellerDocumentProfileDto as $TravellerDocumentProfileDto,
  $UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto as $UpdateTravellerDocumentDto,
} from "@ayasofyazilim/unirefund-saas-dev/TravellerService";
import {deleteTravellerDocumentApi} from "@repo/actions/unirefund/TravellerService/delete-actions";
import {postTravellerDocumentApi} from "@repo/actions/unirefund/TravellerService/post-actions";
import {putTravellerDocumentApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handleDeleteResponse, handlePostResponse, handlePutResponse} from "@repo/utils/api";
import {FileBadge2Icon, IdCardIcon} from "lucide-react";
import {useParams} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useTransition} from "react";
import type {CountryDto} from "@/utils/address-hook/types";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

export function TravellerDocumentsForm({
  languageData,
  travellerDocuments,
  travellerDetails,
  countryList,
}: {
  languageData: TravellerServiceResource;
  travellerDocuments: TravellerDocumentProfileDto[];
  travellerDetails: UniRefund_TravellerService_Travellers_TravellerDetailProfileDto;
  countryList: CountryDto[];
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
      travelDocumentNumber: {
        showHeader: true,
        content: (row) => DocumentNumberCell({row, languageData}),
      },
    },
    expandRowTrigger: "travelDocumentNumber",
  });
  const tableActions: TanstackTableTableActionsType<TravellerDocumentProfileDto>[] = [
    {
      actionLocation: "table",
      cta: languageData["Travellers.New.Document"],
      type: "schemaform-dialog",
      schema: $CreateTravellerDocumentDto,
      uiSchema: createUiSchemaWithResource({
        resources: languageData,
        schema: $CreateTravellerDocumentDto,
        name: "Form",
        extend: {
          residenceCountryCode2: {
            "ui:widget": "countryWidget",
          },
          nationalityCountryCode2: {
            "ui:widget": "countryWidget",
          },
        },
      }),
      widgets: {
        countryWidget: CustomComboboxWidget<CountryDto>({
          languageData,
          list: countryList,
          selectIdentifier: "code2",
          selectLabel: "name",
        }),
      },
      formData: travellerDetails,
      disabled: isPending,
      submitText: languageData["Travellers.New.Document"],
      title: languageData["Travellers.New.Document"],
      onSubmit: (formData) => {
        if (!formData) return;
        startTransition(() => {
          void postTravellerDocumentApi({
            id: partyId,
            requestBody: {
              ...(formData as UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto),
            },
          }).then((response) => {
            handlePostResponse(response);
          });
        });
      },
    },
  ];

  return (
    <TanstackTable
      columnOrder={["travelDocumentNumber", "fullName"]}
      columnVisibility={{
        type: "show",
        columns: ["travelDocumentNumber", "fullName", "issueDate", "expirationDate"],
      }}
      columns={columns}
      data={travellerDocuments}
      expandedRowComponent={(row) => EditForm({row, languageData, partyId, isPending, startTransition, countryList})}
      fillerColumn="fullName"
      showPagination={false}
      tableActions={tableActions}
    />
  );
}
function DocumentNumberCell({
  row,
  languageData,
}: {
  row: TravellerDocumentProfileDto;
  languageData: TravellerServiceResource;
}) {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger>
          {row.identificationType === "IdCard" ? (
            <IdCardIcon className="size-4" />
          ) : (
            <FileBadge2Icon className="size-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {languageData[`Form.identificationType.${row.identificationType}` as keyof typeof languageData]}
        </TooltipContent>
      </Tooltip>
      {row.travelDocumentNumber}
    </div>
  );
}
function EditForm({
  row,
  partyId,
  languageData,
  isPending,
  startTransition,
  countryList,
}: {
  row: TravellerDocumentProfileDto;
  partyId: string;
  languageData: TravellerServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  countryList: CountryDto[];
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
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $UpdateTravellerDocumentDto,
        name: "Form",
        extend: {
          "ui:className": "grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-2",
          residenceCountryCode2: {
            "ui:widget": "countryWidget",
          },
          nationalityCountryCode2: {
            "ui:widget": "countryWidget",
          },
        },
      })}
      useDefaultSubmit={false}
      widgets={{
        countryWidget: CustomComboboxWidget<CountryDto>({
          languageData,
          list: countryList,
          selectIdentifier: "code2",
          selectLabel: "name",
        }),
      }}
      withScrollArea={false}>
      <div className="flex justify-end gap-2 bg-white p-2 pt-0">
        <ConfirmDialog
          closeProps={{
            children: languageData.Cancel,
          }}
          confirmProps={{
            children: languageData.Delete,
            onConfirm: () => {
              startTransition(() => {
                void deleteTravellerDocumentApi(row.id || "").then((response) => {
                  handleDeleteResponse(response);
                });
              });
            },
          }}
          description={languageData["Delete.Assurance"]}
          title={languageData.Delete}
          triggerProps={{
            type: "button",
            variant: "outline",
            children: languageData.Delete,
          }}
          type="with-trigger"
        />
        <Button>{languageData.Save}</Button>
      </div>
    </SchemaForm>
  );
}
