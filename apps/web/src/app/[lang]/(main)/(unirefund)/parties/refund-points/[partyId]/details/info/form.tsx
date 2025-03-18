"use client";

import {$UniRefund_CRMService_RefundPoints_UpdateRefundPointDto} from "@ayasofyazilim/saas/CRMService";
import type {
  UniRefund_CRMService_RefundPoints_UpdateRefundPointDto,
  GetApiCrmServiceRefundPointsByIdResponse,
  UniRefund_CRMService_RefundPoints_RefundPointProfileDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps, DependenciesType} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {AutoFormSubmit, CustomCombobox, DependencyType} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putRefundPointBaseApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function RefundPointForm({
  languageData,
  partyId,
  taxOfficeList,
  refundPointList,
  refundPointDetail,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  refundPointList: UniRefund_CRMService_RefundPoints_RefundPointProfileDto[];
  refundPointDetail: GetApiCrmServiceRefundPointsByIdResponse;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const schema = createZodObject($UniRefund_CRMService_RefundPoints_UpdateRefundPointDto, [
    "typeCode",
    "taxOfficeId",
    "parentId",
    "taxpayerId",
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

  function handleSubmit(formData: UniRefund_CRMService_RefundPoints_UpdateRefundPointDto) {
    startTransition(() => {
      void putRefundPointBaseApi({
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
              <CustomCombobox<UniRefund_CRMService_RefundPoints_RefundPointProfileDto>
                childrenProps={props}
                list={refundPointList}
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
        handleSubmit(values as UniRefund_CRMService_RefundPoints_UpdateRefundPointDto);
      }}
      values={{
        ...refundPointDetail,
        typeCode: refundPointDetail.parentId ? "REFUNDPOINT" : "HEADQUARTER",
      }}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default RefundPointForm;
