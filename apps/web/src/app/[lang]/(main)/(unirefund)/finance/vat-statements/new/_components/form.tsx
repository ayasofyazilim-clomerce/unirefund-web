"use client";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
import {
  postVatStatementHeaderApi,
  postVatStatementHeadersFormDraftApi,
} from "@repo/actions/unirefund/FinanceService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {UniRefund_CRMService_Merchants_MerchantDto} from "@repo/saas/CRMService";
import type {
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto as VATStatementHeaderCreateDto,
  UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDraftDto as VATStatementHeaderDraftDto,
} from "@repo/saas/FinanceService";
import {$UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto} from "@repo/saas/FinanceService";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import {VatStatements} from "../../_components/vat-statements";

export default function VatStatementForm({
  languageData,
  merchantList,
}: {
  languageData: FinanceServiceResource;
  merchantList: UniRefund_CRMService_Merchants_MerchantDto[];
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const [isPending, startTransition] = useTransition();
  const [draftVATStatements, setDraftVATStatements] = useState<VATStatementHeaderDraftDto[]>();
  const [emptyMessage, setEmptyMessage] = useState(languageData["Finance.vatStatements.empty"]);
  const [formData, setFormData] = useState<VATStatementHeaderCreateDto | undefined>({
    merchantId: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    vatStatementDate: new Date().toISOString(),
  });
  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto,
    resources: languageData,
    name: "Finance.Form",
    extend: {
      merchantId: {
        "ui:widget": "Merchant",
      },
      year: {
        "ui:options": {
          inputType: "number",
        },
      },
      month: {
        "ui:options": {
          inputType: "number",
        },
      },
    },
  });

  function handleDraftStatement() {
    if (!formData) return;
    startTransition(() => {
      void postVatStatementHeadersFormDraftApi({
        requestBody: formData,
      }).then((res) => {
        if (res.type === "success") {
          const vatStatementHeadersFormDraftData = res.data;
          setDraftVATStatements(vatStatementHeadersFormDraftData);
        } else {
          setDraftVATStatements(undefined);
          setEmptyMessage(res.message || languageData["Fetch.Fail"]);
          toast.error(res.message || languageData["Fetch.Fail"]);
        }
      });
    });
  }

  function handleCreateStatement() {
    if (!formData) return;
    startTransition(() => {
      void postVatStatementHeaderApi({
        requestBody: formData,
      }).then((res) => {
        handlePostResponse(
          res,
          router,
          res.type === "success" ? getBaseLink(`finance/vat-statements/${res.data[0].id}`, lang) : undefined,
        );
      });
    });
  }

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <div className="flex h-full w-full max-w-xs flex-col overflow-hidden border-r pr-4">
        <SchemaForm<VATStatementHeaderCreateDto>
          disabled={isPending}
          formData={formData}
          key={JSON.stringify(formData)}
          locale={lang}
          onChange={({formData: editedFormData}) => {
            setFormData(editedFormData);
          }}
          schema={$UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderCreateDto}
          uiSchema={uiSchema}
          useDefaultSubmit={false}
          widgets={{
            Merchant: CustomComboboxWidget<UniRefund_CRMService_Merchants_MerchantDto>({
              languageData,
              list: merchantList,
              selectIdentifier: "id",
              selectLabel: "name",
            }),
          }}
          withScrollArea={false}
        />
        <Button
          className="mt-4 w-full"
          data-testid="draft-button"
          disabled={isPending}
          onClick={handleDraftStatement}
          type="button"
          variant="outline">
          {languageData["Finance.Preview"]}
        </Button>
      </div>
      <VatStatements emptyMessage={emptyMessage} languageData={languageData} statements={draftVATStatements}>
        <div
          className={cn(
            draftVATStatements?.length === 1
              ? "ml-auto w-full max-w-xs border-l border-t pl-2 pt-2"
              : "mx-auto w-full max-w-lg",
          )}>
          <Button
            className="bg-primary hover:bg-primary/90 w-full"
            data-testid="submit-button"
            disabled={isPending}
            onClick={handleCreateStatement}
            type="button">
            {languageData["Finance.Submit"]}
          </Button>
        </div>
      </VatStatements>
    </div>
  );
}
