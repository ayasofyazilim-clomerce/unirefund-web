"use client";

import {
  $UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantDto,
  type UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantDto,
  type UniRefund_SettingService_ProductGroups_ProductGroupDto,
} from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { AutoFormInputComponentProps } from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { CustomCombobox } from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postProductGroupsToMerchantsApi } from "src/actions/unirefund/CrmService/post-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./product-group-table-data";

export interface AutoFormValues {
  productGroup: UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantDto;
}

export default function ProductGroups({
  productGroups,
  languageData,
  merchantId,
  productGroupList = [],
}: {
  productGroups: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
  productGroupList: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
  languageData: CRMServiceServiceResource;
  merchantId: string;
}) {
  const router = useRouter();
  const productGroupsSchema = createZodObject(
    {
      type: "object",
      properties: {
        productGroup:
          $UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantDto,
      },
    },
    undefined,
    undefined,
    {
      productGroup: ["productGroupId"],
    },
  );
  const fieldConfig = {
    productGroup: {
      productGroupId: {
        displayName: languageData["ProductGroups.New"],
        renderer: (props: AutoFormInputComponentProps) => {
          "use client";
          return (
            <CustomCombobox<UniRefund_SettingService_ProductGroups_ProductGroupDto>
              childrenProps={props}
              list={productGroupList}
              selectIdentifier="id"
              selectLabel="name"
            />
          );
        },
      },
    },
  };
  function handleSubmit(formData: AutoFormValues) {
    const requestBody: UniRefund_SettingService_ProductGroupMerchants_CreateProductGroupMerchantDto =
      {
        merchantId,
        productGroupId: formData.productGroup.productGroupId,
      };
    void postProductGroupsToMerchantsApi({
      requestBody: [requestBody],
    }).then((res) => {
      handlePostResponse(res, router);
    });
  }
  const columns = tableData.productGroups.columns(languageData, "en");
  const table = tableData.productGroups.table(
    languageData,
    productGroupsSchema,
    handleSubmit,
    fieldConfig,
  );

  return (
    <SectionLayoutContent sectionId="product-groups">
      <TanstackTable
        {...table}
        columns={columns}
        data={productGroups}
        rowCount={productGroups.length}
      />
    </SectionLayoutContent>
  );
}
