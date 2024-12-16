"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_CRMService_Merchants_MerchantDetailDto as MerchantDetailDto,
  PagedResultDto_MerchantProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import DataTable from "@repo/ayasofyazilim-ui/molecules/tables";
import AutoForm from "@repo/ayasofyazilim-ui/organisms/auto-form";
import Stepper, {
  StepperContent,
} from "@repo/ayasofyazilim-ui/organisms/stepper";
import SelectMerchant from "@repo/ui/select-merchant";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { columnsGenerator } from "node_modules/@repo/ayasofyazilim-ui/src/molecules/tables/columnsGenerator";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getTableDataDetail } from "src/actions/api-requests";
import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceDataClient } from "src/language-data/unirefund/ContractService";
import { createTag } from "../actions";

interface Payment {
  name: string;
  tax: number;
  minimum?: number;
  Sales?: number;
}
const payments: Payment[] = [
  { name: "Income Tax", tax: 15 },
  { name: "Sales Tax", tax: 8.5, minimum: 100 },
  { name: "Luxury Tax", tax: 25 },
];

const tableType = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Payment",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "The name of the payment",
    },
    tax: {
      type: "number",
      description: "The tax rate for the payment",
    },
    minimum: {
      type: "number",
      description: "The optional minimum amount for the payment",
    },
  },
  required: ["name", "tax"],
  additionalProperties: false,
};

function Cell({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<Payment, unknown>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      onBlur={onBlur}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      type="number"
      value={value as number}
    />
  );
}

const salesColumn: ColumnDef<Payment> = {
  accessorKey: "Sales",
  header: () => <div className="text-center">Sales</div>,
  cell: (data) => Cell(data),
};

export default function Page() {
  const columns = columnsGenerator<typeof tableType>({
    data: {
      tableType,
      selectable: false,
    },
  });
  const customColumns = [...columns, salesColumn] as ColumnDef<Payment>[];
  const languageData = getResourceDataClient("en");
  const [paymentData, setPaymentData] = useState<Payment[]>(payments);

  const [merchantList, setMerchantList] =
    useState<PagedResultDto_MerchantProfileDto>();
  const [merchantDetails, setMerchantDetails] = useState<MerchantDetailDto>();
  const [selectedMerchant, setSelectedMerchant] = useState<string>("");
  const [traveller, setTraveller] = useState<Record<string, string>>();
  const [travellerNext, setTravellerNext] = useState<boolean>(false);

  useEffect(() => {
    void getMerchantsApi().then((response) => {
      if (response.type === "success") {
        setMerchantList(response.data);
      } else if (response.type === "api-error") {
        toast.error(response.message || "Merchant loading failed");
      } else {
        toast.error("Fatal error");
      }
    });
  }, []);
  const handleMerchantChange = (value: string) => {
    setSelectedMerchant(value);
    setMerchantDetails(undefined);
    void getTableDataDetail("merchants", value).then((response) => {
      if (response.type === "success") {
        setMerchantDetails(response.data as MerchantDetailDto);
      } else if (response.type === "api-error") {
        toast.error(response.message || "Merchant loading failed");
      } else {
        toast.error("Fatal error");
      }
    });
  };

  // const [isSubmitStarted, setIsSubmitStarted] = useState(false);
  const [step, setStep] = useState(0);

  // const steps: Step[] = [
  //   {
  //     title: "Merchant information",
  //     autoformArgs: {
  //       formSchema: z.object({
  //         VatNumber: z.string(),
  //         CountryCode: z.string(),
  //         BranchId: z.string(),
  //       }),
  //     },
  //   },
  //   {
  //     title: "Traveller information",
  //     autoformArgs: {
  //       formSchema: z.object({
  //         documentNumber: z.string(),
  //         name: z.string(),
  //         lastName: z.string(),
  //         residency: z.string(),
  //         nationality: z.string(),
  //         expirationDate: z.string(),
  //         BirthDate: z.string(),
  //       }),
  //     },
  //   },
  //   {
  //     title: "Tax information",
  //     autoformArgs: {
  //       formSchema: z.object({
  //         storeName: z.string(),
  //         facturaNo: z.string(),
  //         taxes: z.array(
  //           z.object({
  //             taxName: z.string(),
  //             taxAmount: z.number(),
  //           }),
  //         ),
  //       }),
  //       fieldConfig: {
  //         all: {
  //           withoutBorder: false,
  //           inputProps: {
  //             showLabel: true,
  //             className: "w-full",
  //           },
  //         },
  //         taxes: {
  //           withoutBorder: false,
  //           inputProps: {
  //             showLabel: true,
  //             className: "bg-red-500",
  //           },
  //         },
  //       },
  //     },
  //   },
  // ];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex w-full flex-col items-center justify-start">
        <div className="w-10/12 flex-row p-4 ">
          <Card className="cantainer h-full p-6">
            <Stepper
              activeTabIndex={step}
              className="flex h-full flex-col gap-4 px-4"
              headerProps={{
                containerClassName: "mb-0",
              }}
              nextButtonText={languageData["Contracts.Create.Step.Next"]}
              onIndexChange={setStep}
              previousButtonText={
                languageData["Contracts.Create.Step.Previous"]
              }
            >
              <StepperContent
                canGoBack={false}
                canGoNext={Boolean(selectedMerchant)}
                className="relative size-full"
                controlsClassName=""
                title={languageData["Contracts.Create.Step.Merchant"]}
              >
                <SelectMerchant
                  handleMerchantChange={handleMerchantChange}
                  merchantDetails={merchantDetails}
                  merchantList={merchantList}
                />
              </StepperContent>

              <StepperContent
                canGoNext={travellerNext}
                className="size-full  overflow-hidden pb-16"
                controlsClassName=""
                title="Traveller Information"
              >
                <AutoForm
                  formSchema={z.object({
                    nationality: z.string().min(2),
                    documentNumber: z.string().min(2),
                    name: z.string().min(2),
                    lastName: z.string().min(2),
                    residency: z.string().min(2),
                    expirationDate: z.string().min(2),
                    BirthDate: z.string().min(2),
                  })}
                  onParsedValuesChange={(values) => {
                    setTraveller(values);
                    setTravellerNext(true);
                  }}
                  onValuesChange={() => {
                    setTravellerNext(false);
                  }}
                  values={traveller}
                />
              </StepperContent>
              <StepperContent
                canGoBack
                canGoNext={false}
                className="ize-full overflow-auto"
                title="Final Step"
              >
                <DataTable
                  columnsData={{
                    type: "Custom",
                    data: { columns: customColumns },
                  }}
                  data={payments}
                  onDataUpdate={(data) => {
                    setPaymentData(data);
                  }}
                  showView={false}
                />
                {paymentData.map((payment) => (
                  <div key={payment.name}>
                    <p>
                      {payment.name}/{payment.tax}% ={" "}
                      {(payment.Sales || 0) * (payment.tax / 100)}
                    </p>
                  </div>
                ))}
                <Button
                  className="float-right"
                  disabled={false}
                  onClick={() => {
                    const merchantInfo =
                      merchantDetails?.merchant?.entityInformations?.[0]
                        .organizations?.[0];
                    if (!merchantInfo) return;
                    const { branchId, taxpayerId, countryCode } = merchantInfo;
                    if (!branchId || !taxpayerId || !countryCode) return;

                    void createTag({
                      merchant: {
                        branchId,
                        vatNumber: taxpayerId,
                        countryCode,
                      },
                      traveller: {
                        nationalityCountryCode2: traveller?.nationality || "",
                        firstName: traveller?.name || "",
                        lastName: traveller?.lastName || "",
                        residenceCountryCode2: traveller?.residency || "",
                        birthDate: traveller?.BirthDate || "",
                        travelDocumentNumber: traveller?.documentNumber || "",
                        expirationDate: traveller?.expirationDate || "",
                      },
                      // invoices: paymentData.map((payment) => ({
                      //   taxName: payment.name,
                      //   taxAmount: (payment.Sales || 0) * (payment.tax / 100),
                      // })),
                    });
                  }}
                  type="button"
                >
                  {languageData["Contracts.Create.Step.Submit"]}
                </Button>
              </StepperContent>
            </Stepper>
          </Card>
        </div>
      </div>
    </div>
  );
}
