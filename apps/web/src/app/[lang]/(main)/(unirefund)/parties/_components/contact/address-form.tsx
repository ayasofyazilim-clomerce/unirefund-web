"use client";

import {Dialog, DialogContent} from "@/components/ui/dialog";
import {toast} from "@/components/ui/sonner";
import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
  putCustomAddressesByCustomIdApi,
  putIndividualAddressesByIndividualIdApi,
  putMerchantAddressesByMerchantIdApi,
  putRefundPointAddressesByRefundPointIdApi,
  putTaxFreeAddressesByTaxFreeIdApi,
  putTaxOfficeAddressesByTaxOfficeIdApi,
} from "@repo/actions/unirefund/CrmService/put-actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TanstackTableTableActionsType} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {
  UniRefund_CRMService_Addresses_AddressDto as AddressDto,
  UniRefund_CRMService_Addresses_UpdateAddressDto,
} from "@repo/saas/CRMService";
import {$UniRefund_CRMService_Addresses_AddressDto as $AddressDto} from "@repo/saas/CRMService";
import {createAddressWidgets} from "@repo/ui/components/address/address-form-widgets";
import {handlePutResponse} from "@repo/utils/api";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useParams, useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useCallback, useState, useTransition} from "react";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

export function AddressForm({
  languageData,
  addresses,
  partyType,
}: {
  languageData: CRMServiceServiceResource;
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
        content: (row) => TypeRow({row, languageData}),
      },
    },
    expandRowTrigger: "addressLine",
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddressDto>();
  const {widgets, schemaFormKey} = createAddressWidgets({languageData})();
  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: AddressDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);

  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: AddressDto}) => {
      if (!editedFormData) return;
      startTransition(() => {
        actionByPartyType({requestBody: editedFormData, partyType, partyId, router});
      });
    },
    [partyType, partyId, router, startTransition],
  );

  const tableActions: TanstackTableTableActionsType<AddressDto>[] = [
    {
      type: "simple",
      cta: languageData["CRM.address.create"],
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
        title={languageData["CRM.addresses"]}
      />
      <Dialog modal onOpenChange={setOpen} open={open}>
        <DialogContent>
          <SchemaForm<AddressDto>
            className="pr-0"
            disabled={isPending}
            filter={{
              type: "exclude",
              keys: ["id", "partyType", "partyId", "placeId", "latitude", "longitude", "isPrimary"],
            }}
            formData={form}
            id="create-address-form"
            key={schemaFormKey}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            schema={$AddressDto}
            submitText={languageData["CRM.address.create"]}
            uiSchema={createUiSchemaWithResource({
              resources: languageData,
              schema: $AddressDto,
              name: "CRM.address",
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

function TypeRow({row, languageData}: {row: AddressDto; languageData: CRMServiceServiceResource}) {
  return <div> {languageData[`CRM.address.type.${row.type}`]}</div>;
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
  languageData: CRMServiceServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) {
  const router = useRouter();
  const [form, setForm] = useState<AddressDto>(row);
  const {widgets, schemaFormKey} = createAddressWidgets({languageData})({initialValue: row});

  const handleFormChange = useCallback(({formData: editedFormData}: {formData?: AddressDto}) => {
    if (editedFormData) {
      setForm(editedFormData);
    }
  }, []);
  const handleFormSubmit = useCallback(
    ({formData: editedFormData}: {formData?: AddressDto}) => {
      if (!editedFormData) return;
      startTransition(() => {
        actionByPartyType({requestBody: editedFormData, partyType, partyId, router});
      });
    },
    [partyType, partyId, router, startTransition],
  );
  return (
    <SchemaForm<AddressDto>
      defaultSubmitClassName="p-2 pt-0"
      disabled={isPending}
      filter={{
        type: "exclude",
        keys: ["id", "partyType", "partyId", "placeId", "latitude", "longitude", "isPrimary"],
      }}
      formData={form}
      id="edit-address-form"
      key={schemaFormKey}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
      schema={$AddressDto}
      submitText={languageData["CRM.address.update"]}
      uiSchema={createUiSchemaWithResource({
        resources: languageData,
        schema: $AddressDto,
        name: "CRM.address",
        extend: {
          displayLabel: false,
          "ui:className": "border-none rounded-none",
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
  // partyId,
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
      checked={row.isPrimary === true}
      data-testid="address-is-primary"
      disabled={isActive || isPending}
      onCheckedChange={() => {
        startTransition(() => {
          toast.error(languageData.NotImplemented);
          // void putMerchantAddressesByMerchantIdApi({
          //   merchantId: partyId,
          //   requestBody: {
          //     id: row.id,
          //     isPrimary: !row.isPrimary,
          //   },
          // }).then((response) => {
          //   handlePutResponse(response);
          // });
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

type PartyType = "merchants" | "refund-points" | "tax-free" | "tax-offices" | "customs" | "individuals";
function actionByPartyType({
  partyId,
  partyType,
  requestBody,
  router,
}: {
  partyId: string;
  partyType: PartyType;
  requestBody: UniRefund_CRMService_Addresses_UpdateAddressDto;
  router: AppRouterInstance;
}) {
  switch (partyType) {
    case "merchants":
      console.log("Updating merchant's address with; ", partyId, requestBody);
      void putMerchantAddressesByMerchantIdApi({
        merchantId: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "refund-points":
      void putRefundPointAddressesByRefundPointIdApi({
        refundPointId: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-free":
      void putTaxFreeAddressesByTaxFreeIdApi({
        taxFreeId: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-offices":
      void putTaxOfficeAddressesByTaxOfficeIdApi({
        taxOfficeId: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "customs":
      void putCustomAddressesByCustomIdApi({
        customId: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "individuals":
      void putIndividualAddressesByIndividualIdApi({
        individualId: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    default:
      toast.error("Unknown party type");
      break;
  }
}
