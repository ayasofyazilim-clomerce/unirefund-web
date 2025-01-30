"use client";

import type {
  UniRefund_CRMService_TaxOffices_TaxOfficeDto,
  UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto } from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {
  AutoFormInputComponentProps,
  DependenciesType,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {
  AutoFormSubmit,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putRefundPointBaseApi } from "src/actions/unirefund/CrmService/put-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

function TaxOfficeForm({
  languageData,
  partyId,
  taxOfficeList,
  taxOfficeDetail,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  taxOfficeDetail: UniRefund_CRMService_TaxOffices_TaxOfficeDto;
}) {
  const router = useRouter();
  const schema = createZodObject(
    $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
    ["taxpayerId"],
  );
  const dependencies: DependenciesType = [
    // {
    //   sourceField: "typeCode",
    //   type: DependencyType.HIDES,
    //   targetField: "parentId",
    //   when: (typeCode: string) => typeCode === "HEADQUARTER",
    // },
    // {
    //   sourceField: "typeCode",
    //   type: DependencyType.HIDES,
    //   targetField: "taxOfficeId",
    //   when: (typeCode: string) => typeCode !== "HEADQUARTER",
    // },
    // {
    //   sourceField: "typeCode",
    //   type: DependencyType.HIDES,
    //   targetField: "taxpayerId",
    //   when: (typeCode: string) => typeCode !== "HEADQUARTER",
    // },
    // {
    //   sourceField: "typeCode",
    //   type: DependencyType.REQUIRES,
    //   targetField: "parentId",
    //   when: (typeCode: string) => typeCode !== "HEADQUARTER",
    // },
  ];

  function handleSubmit(
    formData: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
  ) {
    void putRefundPointBaseApi({
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
              <CustomCombobox<UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto>
                childrenProps={props}
                list={taxOfficeList}
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
        // if (values.typeCode !== "HEADQUARTER" && !values.parentId) {
        //   return;
        // }
        // if (values.typeCode !== "HEADQUARTER") {
        //   values.taxOfficeId = null;
        //   values.parentId = null;
        //   values.taxpayerId = null;
        // }
        handleSubmit(
          values as UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
        );
      }}
      values={{
        ...taxOfficeDetail,
        typeCode: taxOfficeDetail.parentId ? "REFUNDPOINT" : "HEADQUARTER",
      }}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default TaxOfficeForm;
