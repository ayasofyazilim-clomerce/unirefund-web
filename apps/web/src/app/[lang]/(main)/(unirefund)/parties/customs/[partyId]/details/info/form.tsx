"use client";

import type {
  UniRefund_CRMService_Customss_CustomsProfileDto,
  UniRefund_CRMService_Customss_UpdateCustomsDto,
  // UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_Customss_UpdateCustomsDto} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps, DependenciesType} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {AutoFormSubmit, CustomCombobox, DependencyType} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putCustomBaseApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function CustomForm({
  languageData,
  partyId,
  // taxOfficeList,
  customList,
  customDetail,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  // taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  customList: UniRefund_CRMService_Customss_CustomsProfileDto[];
  customDetail: UniRefund_CRMService_Customss_CustomsProfileDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const schema = createZodObject($UniRefund_CRMService_Customss_UpdateCustomsDto, [
    "typeCode",
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
    // {
    //   sourceField: "typeCode",
    //   type: DependencyType.HIDES,
    //   targetField: "taxOfficeId",
    //   when: (typeCode: string) => typeCode !== "HEADQUARTER",
    // },
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

  function handleSubmit(formData: UniRefund_CRMService_Customss_UpdateCustomsDto) {
    startTransition(() => {
      void putCustomBaseApi({
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
        // taxOfficeId: {
        //   renderer: (props: AutoFormInputComponentProps) => {
        //     return (
        //       <CustomCombobox<UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto>
        //         childrenProps={props}
        //         list={taxOfficeList}
        //         selectIdentifier="id"
        //         selectLabel="name"
        //       />
        //     );
        //   },
        // },
        parentId: {
          renderer: (props: AutoFormInputComponentProps) => {
            return (
              <CustomCombobox<UniRefund_CRMService_Customss_CustomsProfileDto>
                childrenProps={props}
                list={customList}
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
        if (values.typeCode !== "HEADQUARTER" && !values.parentId) {
          return;
        }
        if (values.typeCode !== "HEADQUARTER") {
          // values.taxOfficeId = null;
          values.parentId = null;
          values.taxpayerId = null;
        }
        handleSubmit(values as UniRefund_CRMService_Customss_UpdateCustomsDto);
      }}
      values={{
        ...customDetail,
        typeCode: customDetail.parentId ? "CUSTOMS" : "HEADQUARTER",
      }}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default CustomForm;
