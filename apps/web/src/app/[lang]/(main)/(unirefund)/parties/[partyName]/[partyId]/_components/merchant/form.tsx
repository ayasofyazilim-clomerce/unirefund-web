"use client";

import type {
  UniRefund_CRMService_Merchants_MerchantProfileDto,
  UniRefund_CRMService_Merchants_UpdateMerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_Merchants_MerchantBaseDto } from "@ayasofyazilim/saas/CRMService";
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
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { putMerchantBaseApi } from "src/actions/unirefund/CrmService/put-actions";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

function MerchantForm({
  languageData,
  partyId,
  taxOfficeList,
  merchantList,
  merchantBaseData,
}: {
  languageData: CRMServiceServiceResource;
  partyName: "merchants";
  partyId: string;
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  merchantList: UniRefund_CRMService_Merchants_MerchantProfileDto[];
  merchantBaseData: UniRefund_CRMService_Merchants_UpdateMerchantDto;
}) {
  const router = useRouter();
  const schema = createZodObject(
    $UniRefund_CRMService_Merchants_MerchantBaseDto,
    ["typeCode", "taxOfficeId", "parentId"],
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
    <SectionLayoutContent sectionId="merchant-base">
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
        values={merchantBaseData}
      >
        <AutoFormSubmit className="float-right">
          {languageData.Save}
        </AutoFormSubmit>
      </AutoForm>
    </SectionLayoutContent>
  );
}

export default MerchantForm;
