"use client";

import type {
  GetApiCrmServiceMerchantsByIdResponse,
  UniRefund_CRMService_Merchants_MerchantProfileDto,
  UniRefund_CRMService_Merchants_UpdateMerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_Merchants_UpdateMerchantDto } from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {
  AutoFormInputComponentProps,
  DependenciesType,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {
  AutoFormSubmit,
  CustomCombobox,
  DependencyType,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putMerchantBaseApi } from "src/actions/unirefund/CrmService/put-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

function MerchantForm({
  languageData,
  partyId,
  taxOfficeList,
  merchantList,
  merchantDetail,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  merchantList: UniRefund_CRMService_Merchants_MerchantProfileDto[];
  merchantDetail: GetApiCrmServiceMerchantsByIdResponse;
}) {
  const router = useRouter();
  const schema = createZodObject(
    $UniRefund_CRMService_Merchants_UpdateMerchantDto,
    ["typeCode", "taxOfficeId", "parentId", "taxpayerId"],
  );
  const dependencies: DependenciesType = [
    {
      sourceField: "typeCode",
      type: DependencyType.HIDES,
      targetField: "parentId",
      when: (typeCode: string) => typeCode !== "STORE",
    },
    {
      sourceField: "typeCode",
      type: DependencyType.REQUIRES,
      targetField: "parentId",
      when: (typeCode: string) => typeCode === "STORE",
    },
  ];

  function handleSubmit(
    formData: UniRefund_CRMService_Merchants_UpdateMerchantDto,
  ) {
    void putMerchantBaseApi({
      requestBody: formData,
      id: partyId,
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }
  return (
    <AutoForm
      dependencies={dependencies}
      fieldConfig={{
        taxOfficeId: {
          renderer: (props: AutoFormInputComponentProps) => {
            return (
              <CustomCombobox<UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto>
                childrenProps={props}
                list={taxOfficeList}
                selectIdentifier="id"
                selectLabel="name"
              />
            );
          },
        },
        parentId: {
          renderer: (props: AutoFormInputComponentProps) => {
            return (
              <CustomCombobox<UniRefund_CRMService_Merchants_MerchantProfileDto>
                childrenProps={props}
                list={merchantList}
                selectIdentifier="id"
                selectLabel="name"
              />
            );
          },
        },
      }}
      formClassName="pb-40"
      formSchema={schema}
      onSubmit={(values) => {
        if (values.typeCode === "STORE" && !values.parentId) {
          return;
        }
        handleSubmit(
          values as UniRefund_CRMService_Merchants_UpdateMerchantDto,
        );
      }}
      values={merchantDetail}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default MerchantForm;
