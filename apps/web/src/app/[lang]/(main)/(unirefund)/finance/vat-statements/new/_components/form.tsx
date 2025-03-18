"use client";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/sonner";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto,
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDto,
} from "@ayasofyazilim/saas/FinanceService";
import {$UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto} from "@ayasofyazilim/saas/FinanceService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {
  postVatStatementHeaderApi,
  postVatStatementHeadersFormDraftApi,
} from "@repo/actions/unirefund/FinanceService/post-actions";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import VatStatementInformation from "../../[vatStatementId]/information/_components/vat-statement-information";
import TaxFreeTagTable from "../../[vatStatementId]/tax-free-tags/_components/table";

export default function VatStatementForm({
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
    useState<UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto>();
  const [vatStatementData, setVatStatementData] =
    useState<UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDto[]>();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto,
    resources: languageData,
    name: "Form.VatStatement",
    extend: {
      merchantId: {
        "ui:widget": "Merchant",
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
      <TabsContent value="Form">
        <SchemaForm<UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto>
          disabled={isPending}
          formData={
            _formData || {
              merchantId: "",
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              vatStatementDate: new Date().toISOString(),
            }
          }
          onChange={(e) => {
            set_FormData(e.formData);
          }}
          onSubmit={({formData}) => {
            if (!formData) return;
            startTransition(() => {
              void postVatStatementHeaderApi({
                requestBody: formData,
              }).then((res) => {
                handlePostResponse(res, router, "../vat-statements");
              });
            });
          }}
          schema={$UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto}
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
          <div className="flex w-full justify-end gap-4 pt-8">
            <Button
              disabled={isPending}
              onClick={() => {
                if (!_formData) return;
                startTransition(() => {
                  void postVatStatementHeadersFormDraftApi({
                    requestBody: _formData,
                  }).then((res) => {
                    if (res.type === "success") {
                      const vatStatementHeadersFormDraftData =
                        res.data as UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDto[];
                      setVatStatementData(vatStatementHeadersFormDraftData);
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
      <TabsContent value="Preview">
        {!isPending && vatStatementData?.length ? (
          <div className="flex max-h-[450px] w-full flex-col overflow-y-auto">
            {vatStatementData.map((item, index) => (
              <div className="flex w-full flex-col pb-3" key={index}>
                <VatStatementInformation VatStatementData={item} languageData={languageData} />
                <TaxFreeTagTable languageData={languageData} taxFreeTagsData={item} />
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
