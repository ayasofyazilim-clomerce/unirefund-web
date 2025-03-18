"use client";

import type {
  GetApiCrmServiceMerchantsByIdResponse,
  UniRefund_CRMService_Merchants_MerchantProfileDto,
  UniRefund_CRMService_Merchants_UpdateMerchantDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_Merchants_UpdateMerchantDto} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps, DependenciesType} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {AutoFormSubmit, CustomCombobox, DependencyType} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putMerchantBaseApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function MerchantForm({
  languageData,
  partyId,
  taxOfficeList,
  merchantList,
  merchantDetail,
  taxOfficeId,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  merchantList: UniRefund_CRMService_Merchants_MerchantProfileDto[];
  merchantDetail: GetApiCrmServiceMerchantsByIdResponse;
  taxOfficeId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const schema = createZodObject($UniRefund_CRMService_Merchants_UpdateMerchantDto, [
    "typeCode",
    "taxOfficeId",
    "parentId",
    "taxpayerId",
    "customerNumber",
  ]);
  const dependencies: DependenciesType = [
    {
      sourceField: "typeCode",
      type: DependencyType.HIDES,
      targetField: "parentId",
      when: (typeCode: string) => typeCode === "HEADQUARTER",
    },
    {
      sourceField: "typeCode",
      type: DependencyType.HIDES,
      targetField: "taxOfficeId",
      when: (typeCode: string) => typeCode !== "HEADQUARTER",
    },
    {
      sourceField: "typeCode",
      type: DependencyType.HIDES,
      targetField: "taxpayerId",
      when: (typeCode: string) => typeCode !== "HEADQUARTER",
    },
    {
      sourceField: "typeCode",
      type: DependencyType.REQUIRES,
      targetField: "parentId",
      when: (typeCode: string) => typeCode !== "HEADQUARTER",
    },
  ];

  function handleSubmit(formData: UniRefund_CRMService_Merchants_UpdateMerchantDto) {
    startTransition(() => {
      void putMerchantBaseApi({
        requestBody: formData,
        id: partyId,
      }).then((response) => {
        handlePutResponse(response, router);
      });
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
        if (values.typeCode !== "HEADQUARTER") {
          if (!values.parentId) return;
          values.taxOfficeId = null;
          values.taxpayerId = null;
        } else {
          values.parentId = null;
        }
        handleSubmit(values as UniRefund_CRMService_Merchants_UpdateMerchantDto);
      }}
      values={{...merchantDetail, taxOfficeId}}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default MerchantForm;
