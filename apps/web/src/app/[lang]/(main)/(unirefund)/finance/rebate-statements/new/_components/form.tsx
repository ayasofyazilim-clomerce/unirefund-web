"use client";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/sonner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {
  UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto,
  UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto,
} from "@ayasofyazilim/saas/FinanceService";
import {$UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto} from "@ayasofyazilim/saas/FinanceService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
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
  merchantList: UniRefund_CRMService_Merchants_MerchantProfileDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("Form");
  const [_formData, set_FormData] =
    useState<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderCreateDto>();
  const [rebateStatementData, setRebateStatementData] =
    useState<UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto[]>();

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
    <Tabs defaultValue="Form" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Form">{languageData["Button.Form"]}</TabsTrigger>
        <TabsTrigger value="Preview">{languageData["Button.Preview"]}</TabsTrigger>
      </TabsList>
      <div className="max-h-[450px] w-full overflow-y-auto pt-4">
        <TabsContent value="Form">
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
            uiSchema={uiSchema}
            useDefaultSubmit={false}
            widgets={{
              Merchant: CustomComboboxWidget<UniRefund_CRMService_Merchants_MerchantProfileDto>({
                languageData,
                list: merchantList,
                selectIdentifier: "id",
                selectLabel: "name",
              }),
            }}>
            <div className="flex w-full justify-end gap-4 py-4">
              <Button
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
                {languageData["Button.PreviewData"]}
              </Button>
              <Button disabled={isPending} type="submit">
                {languageData["Button.Submit"]}
              </Button>
            </div>
          </SchemaForm>
        </TabsContent>
      </div>

      <TabsContent value="Preview">
        {!isPending && rebateStatementData?.length ? (
          <div className="flex max-h-[450px] w-full flex-col overflow-y-auto">
            {rebateStatementData.map((item, index) => (
              <div className="flex w-full flex-col pb-3" key={index}>
                <RebateStatementInformation key={item.id} languageData={languageData} rebateStatementData={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center pt-16 text-xl text-red-500">
            {languageData["VatStatement.Preview.NoData"]}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
