"use client";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/sonner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import type {UniRefund_CRMService_Merchants_MerchantDto} from "@repo/saas/CRMService";
import type {
  UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto,
  UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto,
} from "@repo/saas/FinanceService";
import {$UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto} from "@repo/saas/FinanceService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useParams, useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {
  postRebateStatementHeadersApi,
  postRebateStatementHeadersFormDraftApi,
} from "@repo/actions/unirefund/FinanceService/post-actions";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import RebateStatementInformation from "../../[rebateStatementId]/information/_components/rebate-statement-information";

export default function RebateStatementForm({
  languageData,
  merchantList,
}: {
  languageData: FinanceServiceResource;
  merchantList: UniRefund_CRMService_Merchants_MerchantDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("Form");
  const [_formData, set_FormData] =
    useState<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto>();
  const [rebateStatementData, setRebateStatementData] =
    useState<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto[]>();
  const {lang} = useParams<{lang: string}>();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto,
    resources: languageData,
    name: "Form.RebateStatement",
    extend: {
      merchantId: {
        "ui:widget": "Merchant",
      },
      yearMonthPairs: {
        "ui:className": "md:col-span-2",
        year: {
          "ui:className": "md:grid md:grid-cols-2 md:gap-2",
        },
        month: {
          "ui:className": "md:grid md:grid-cols-2 md:gap-2",
        },
      },
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
    },
  });

  return (
    <div className="mx-auto my-6 w-full rounded-lg border border-gray-200 ">
      <div className="overflow-hidden transition-all">
        <Tabs className="flex h-full flex-col" defaultValue="Form" onValueChange={setActiveTab} value={activeTab}>
          <div className="p-2 md:p-6">
            <TabsList className="mx-auto grid h-auto w-full max-w-xl grid-cols-2 items-center gap-2 rounded-lg bg-gray-50 p-1">
              <TabsTrigger className="rounded-md py-1 data-[state=active]:bg-white" value="Form">
                {languageData["Button.Form"]}
              </TabsTrigger>
              <TabsTrigger className="rounded-md py-1 data-[state=active]:bg-white" value="Preview">
                {languageData["Button.Preview"]}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-grow p-2 md:p-6">
            <TabsContent className="mt-0 h-full" value="Form">
              <div className="space-y-6 rounded-lg border border-gray-200 p-6">
                <SchemaForm<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto>
                  disabled={isPending}
                  formData={
                    _formData || {
                      merchantId: "",
                      rebateStatementDate: new Date().toISOString(),
                      yearMonthPairs: [
                        {
                          year: new Date().getFullYear(),
                          month: new Date().getMonth() + 1,
                        },
                      ],
                    }
                  }
                  locale={lang}
                  onChange={(e) => {
                    set_FormData(e.formData);
                  }}
                  onSubmit={({formData}) => {
                    if (!formData) return;
                    startTransition(() => {
                      void postRebateStatementHeadersApi({
                        requestBody: formData,
                      }).then((res) => {
                        handlePostResponse(res, router, "../rebate-statements");
                      });
                    });
                  }}
                  schema={$UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto}
                  uiSchema={{
                    ...uiSchema,
                    "ui:className": "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6",
                    yearMonthPairs: {
                      className: {
                        accordion: "col-span-full",
                        accordionContent: "!py-0  gap-0 w-full",
                      },
                      items: {
                        "ui:className": "border-0 border-b rounded-none !gap-4 [&>div]:grid grid-cols-2 [&>div]:gap-1 ",
                      },
                    },
                  }}
                  useDefaultSubmit={false}
                  widgets={{
                    Merchant: CustomComboboxWidget<UniRefund_CRMService_Merchants_MerchantDto>({
                      languageData,
                      list: merchantList,
                      selectIdentifier: "id",
                      selectLabel: "name",
                    }),
                  }}>
                  <div className=" flex w-full flex-col justify-end gap-3 sm:flex-row">
                    <Button
                      className="w-full sm:w-auto"
                      disabled={isPending}
                      onClick={() => {
                        if (!_formData) return;
                        startTransition(() => {
                          void postRebateStatementHeadersFormDraftApi({
                            requestBody: _formData,
                          }).then((res) => {
                            if (res.type === "success") {
                              const rebateStatementHeadersFormDraftData =
                                res.data as UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto[];
                              setRebateStatementData(rebateStatementHeadersFormDraftData);
                              setActiveTab("Preview");
                            } else {
                              toast.error(res.message || languageData["Fetch.Fail"]);
                            }
                          });
                        });
                      }}
                      type="button"
                      variant="outline">
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              fill="none"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              fill="currentColor"
                            />
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        languageData["Button.PreviewData"]
                      )}
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                      disabled={isPending}
                      type="submit">
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              fill="none"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              fill="currentColor"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        languageData["Button.Submit"]
                      )}
                    </Button>
                  </div>
                </SchemaForm>
              </div>
            </TabsContent>

            <TabsContent className="mt-0 h-full" value="Preview">
              <div className="min-h-[300px] rounded-lg bg-gray-50 p-4">
                {(() => {
                  if (isPending) {
                    return (
                      <div className="flex h-[300px] flex-col items-center justify-center">
                        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2" />
                        <p className="mt-4 text-gray-500">Loading...</p>
                      </div>
                    );
                  }

                  if (rebateStatementData && rebateStatementData.length > 0) {
                    return (
                      <div className="space-y-4">
                        {rebateStatementData.map((item, index) => (
                          <div className="rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md" key={index}>
                            <RebateStatementInformation
                              key={item.id}
                              languageData={languageData}
                              rebateStatementData={item}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div className="flex h-[300px] flex-col items-center justify-center">
                      <svg
                        className="h-16 w-16 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        />
                      </svg>
                      <p className="mt-4 text-gray-500">{languageData["VatStatement.Preview.NoData"]}</p>
                    </div>
                  );
                })()}
              </div>
              {rebateStatementData && rebateStatementData.length > 0 ? (
                <div className="mt-6 flex justify-end">
                  <Button
                    className="mr-2"
                    onClick={() => {
                      setActiveTab("Form");
                    }}
                    variant="outline">
                    Back
                  </Button>
                  <Button
                    disabled={isPending}
                    onClick={() => {
                      if (!_formData) return;
                      startTransition(() => {
                        void postRebateStatementHeadersApi({
                          requestBody: _formData,
                        }).then((res) => {
                          handlePostResponse(res, router, "../rebate-statements");
                        });
                      });
                    }}>
                    {languageData["Button.Submit"]}
                  </Button>
                </div>
              ) : null}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
