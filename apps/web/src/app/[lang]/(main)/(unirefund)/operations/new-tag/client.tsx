"use client";

import {searchMerchants} from "@repo/actions/unirefund/CrmService/search";
import type {FilterComponentSearchItem} from "@repo/ayasofyazilim-ui/molecules/filter-component";
import FilterComponent from "@repo/ayasofyazilim-ui/molecules/filter-component";
import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import {toast} from "@/components/ui/sonner";
import type {GetApiCrmServiceMerchantsByIdProductGroupResponse} from "@repo/saas/CRMService";
import {getMerchantByIdApi, getMerchantProductGroupByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {postTagApi} from "@repo/actions/unirefund/TagService/post-actions";
import {getTravellersDetailsApi} from "@repo/actions/unirefund/TravellerService/actions";
import {searchTravellers} from "@repo/actions/unirefund/TravellerService/search";
import {handlePostResponse} from "@repo/utils/api";
import type {UniRefund_TagService_Tags_CreateTagRequestDto} from "@repo/saas/TagService";
import {getBaseLink} from "@/utils";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import ProductGroupAmountInput from "./_components/product-group-amount-input";

function generateInvoiceNumber() {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate().toString().padStart(2, "0");
  const year = dateObj.getUTCFullYear();
  const hour = dateObj.getUTCHours();
  const minute = dateObj.getUTCMinutes();
  const second = dateObj.getUTCSeconds();
  const millisecond = dateObj.getUTCMilliseconds();
  return `TXF${year}${month}${day}${hour}${minute}${second}${millisecond}`;
}
function generateGuid() {
  function S4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${S4() + S4()}-${S4()}-4${S4().substr(0, 3)}-${S4()}-${S4()}${S4()}${S4()}`.toLowerCase();
}
export default function ClientPage({
  languageData,
  className,
  defaultOpen,
}: {
  languageData: TagServiceResource;
  className?: string;
  defaultOpen?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [productGroupList, setProductGroupList] = useState<GetApiCrmServiceMerchantsByIdProductGroupResponse>([]);
  const [merchantIds, setMerchantIds] = useState<FilterComponentSearchItem[]>([]);
  const [travellerIds, setTravellerIds] = useState<FilterComponentSearchItem[]>([]);
  const [productGroupIds, setProductGroupIds] = useState<string[]>([]);
  const [invoiceLines, setInvoiceLines] = useState<
    Record<string, {taxRate: number; taxAmount: number; amount: number; taxBase: number}>
  >({});

  useEffect(() => {
    if (merchantIds.length === 0) {
      setProductGroupList([]);
      setProductGroupIds([]);
      return;
    }

    void getMerchantProductGroupByIdApi(merchantIds[0].id).then((res) => {
      setProductGroupList(res.data);
    });
  }, [merchantIds]);

  useEffect(() => {
    if (productGroupIds.length === 0) {
      setInvoiceLines({});
      return;
    }
    setInvoiceLines((prev) => {
      const newInvoiceLines = Object.fromEntries(Object.entries(prev).filter(([key]) => productGroupIds.includes(key)));

      return newInvoiceLines;
    });
  }, [productGroupIds]);

  function onSubmit() {
    if (merchantIds.length === 0 || travellerIds.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    startTransition(async () => {
      const totalAmount = Object.values(invoiceLines).reduce((acc, curr) => acc + curr.amount, 0);
      const totalTaxAmount = Object.values(invoiceLines).reduce((acc, curr) => acc + curr.taxAmount, 0);
      console.time("MerchantDetailsForTagCreate");
      const merchantInfoResponse = await getMerchantByIdApi(merchantIds[0].id);
      console.timeEnd("MerchantDetailsForTagCreate");
      console.time("TravellerDetailsForTagCreate");
      const travellerInfoResponse = await getTravellersDetailsApi(travellerIds[0].id);
      console.timeEnd("TravellerDetailsForTagCreate");
      const data: UniRefund_TagService_Tags_CreateTagRequestDto = {
        merchant: {
          vatNumber: merchantInfoResponse.data.vatNumber || "",
          countryCode: "TR",
          externalIdentifier: merchantInfoResponse.data.externalIdentifier || "0",
        },
        traveller: {
          travellerDocumentNumber: travellerInfoResponse.data.travellerDocuments?.[0].travellerDocumentNumber || "",
          nationalityCountryCode2: travellerInfoResponse.data.travellerDocuments?.[0].nationalityCountryCode2 || "",
          firstName: travellerInfoResponse.data.firstName || "",
          lastName: travellerInfoResponse.data.lastName || "",
          residenceCountryCode2: travellerInfoResponse.data.travellerDocuments?.[0].residenceCountryCode2 || "",
          expirationDate: travellerInfoResponse.data.travellerDocuments?.[0].expirationDate,
        },
        invoices: [
          {
            uuid: generateGuid(),
            invoiceNumber: generateInvoiceNumber(),
            issueDate: new Date().toISOString(),
            totalAmount,
            vatAmount: totalTaxAmount,
            invoiceLines: Object.keys(invoiceLines).map((key) => ({
              productGroupId: key,
              taxRate: invoiceLines[key].taxRate,
              taxBase: invoiceLines[key].taxBase,
              amount: invoiceLines[key].amount,
              taxAmount: invoiceLines[key].taxAmount,
            })),
          },
        ],
      };
      console.log("Creating tag with data", data);
      console.time("CreateTag");
      const response = await postTagApi({
        requestBody: data,
      });
      handlePostResponse(response, router, {
        prefix: getBaseLink("operations/tax-free-tags"),
        identifier: "id",
      });
      console.timeEnd("CreateTag");
    });
  }

  const filterData = {
    dateSelect: [],
    multiSelect: [
      {
        id: "product_groups_multi",
        title: languageData.ProductGroups,
        placeholder: languageData["ProductGroups.Select"],
        value: productGroupIds,
        options: productGroupList.map((pg) => ({
          value: pg.productGroupId,
          label: `${pg.productGroupName} (%${pg.vatRate})`,
        })),
        onChange: setProductGroupIds,
        order: 2,
      },
    ],
    asyncSelect: [
      {
        id: "traveller_async",
        title: languageData.TravellerFullName,
        fetchAction: searchTravellers,
        onChange: setTravellerIds,
        value: travellerIds,
        multiple: false,
      },
      {
        id: "merchant_async",
        title: languageData.MerchantTitle,
        fetchAction: searchMerchants,
        onChange: setMerchantIds,
        value: merchantIds,
        multiple: false,
      },
    ],
    customFields: [
      {
        order: 3,
        component: (
          <ProductGroupAmountInput
            isPending={isPending}
            languageData={languageData}
            productGroupIds={productGroupIds}
            productGroupList={productGroupList}
            setInvoiceLines={setInvoiceLines}
          />
        ),
      },
    ],
  };

  return (
    <FilterComponent
      applyFilterText={languageData.Apply}
      asyncSelect={filterData.asyncSelect}
      className={className}
      customField={filterData.customFields}
      dateSelect={filterData.dateSelect}
      defaultOpen={defaultOpen}
      disabled={isPending}
      filtersText={languageData.Filters}
      isCollapsible={false}
      multiSelect={filterData.multiSelect}
      onSubmit={onSubmit}
      searchText={languageData.Search}
    />
  );
}
