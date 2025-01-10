"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDto,
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto as VATStatementHeaderCreateDto,
} from "@ayasofyazilim/saas/FinanceService";
import { $UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto as $VATStatementHeaderCreateDto } from "@ayasofyazilim/saas/FinanceService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type { UniRefund_CRMService_Merchants_MerchantProfileDto } from "@ayasofyazilim/saas/CRMService";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import {
  postVatStatementHeaderApi,
  postVatStatementHeadersFormDraftApi,
} from "src/actions/unirefund/FinanceService/post-actions";
import VatStatementInformation from "../../[vatStatementId]/information/_components/vat-statement-information";

export default function VatStatementForm({
  languageData,
  merchantList,
}: {
  languageData: FinanceServiceResource;
  merchantList: UniRefund_CRMService_Merchants_MerchantProfileDto[];
}) {
  const router = useRouter();
  const uiSchema = createUiSchemaWithResource({
    schema: $VATStatementHeaderCreateDto,
    resources: languageData,
    name: "Form.VatStatement",
    extend: {
      merchantId: {
        "ui:widget": "Merchant",
      },
    },
  });
  const [vatStatementData] =
    useState<
      UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDto[]
    >();
  const [_formData, set_FormData] = useState<VATStatementHeaderCreateDto>();
  const [activeTab, setActiveTab] = useState("Form");
  const [loading, setLoading] = useState(false);

  return (
    <Tabs defaultValue="Form" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Form">{languageData["Button.Form"]}</TabsTrigger>
        <TabsTrigger value="Preview">
          {languageData["Button.Preview"]}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Form">
        <SchemaForm<VATStatementHeaderCreateDto>
          disabled={loading}
          formData={_formData}
          onChange={(e) => {
            set_FormData(e.formData);
          }}
          onSubmit={(e) => {
            if (!e.formData) return;
            setLoading(true);
            void postVatStatementHeaderApi({
              requestBody: e.formData,
            })
              .then((res) => {
                handlePostResponse(res, router);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          schema={$VATStatementHeaderCreateDto}
          uiSchema={uiSchema}
          useDefaultSubmit={false}
          widgets={{
            Merchant:
              CustomComboboxWidget<UniRefund_CRMService_Merchants_MerchantProfileDto>(
                {
                  languageData,
                  list: merchantList,
                  selectIdentifier: "id",
                  selectLabel: "name",
                },
              ),
          }}
        >
          <div className="flex w-full justify-end gap-4 pt-8">
            <Button
              disabled={loading}
              onClick={() => {
                if (!_formData) return;
                setLoading(true);
                void postVatStatementHeadersFormDraftApi({
                  requestBody: _formData,
                })
                  .then((res) => {
                    if (res.type === "success") {
                      setActiveTab("Preview");
                    } else {
                      toast.error(res.message || languageData["Fetch.Fail"]);
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
              type="button"
              variant="outline"
            >
              {languageData["Button.PreviewData"]}
            </Button>
            <Button disabled={loading} type="submit">
              {languageData["Button.Submit"]}
            </Button>
          </div>
        </SchemaForm>
      </TabsContent>
      <TabsContent value="Preview">
        {!loading && vatStatementData?.length ? (
          <div className="flex w-full flex-col gap-4">
            {vatStatementData.map((item) => (
              <VatStatementInformation
                VatStatementData={item}
                key={item.id}
                languageData={languageData}
              />
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
