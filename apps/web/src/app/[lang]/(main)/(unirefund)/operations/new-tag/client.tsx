"use client";

import {searchMerchants} from "@repo/actions/unirefund/CrmService/search";
import type {FilterComponentSearchItem} from "@repo/ayasofyazilim-ui/molecules/filter-component";
import FilterComponent from "@repo/ayasofyazilim-ui/molecules/filter-component";
import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import type {GetApiCrmServiceMerchantsByIdProductGroupResponse} from "@ayasofyazilim/saas/CRMService";
import {getMerchantByIdApi, getMerchantsByIdProductGroupApi} from "@repo/actions/unirefund/CrmService/actions";
import {postTagApi} from "@repo/actions/unirefund/TagService/post-actions";
import {getTravellersDetailsApi} from "@repo/actions/unirefund/TravellerService/actions";
import {searchTravellers} from "@repo/actions/unirefund/TravellerService/search";
import {handlePostResponse} from "@repo/utils/api";
import {UserIcon, StoreIcon, TagsIcon, SearchIcon} from "lucide-react";
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

    void getMerchantsByIdProductGroupApi(merchantIds[0].id).then((res) => {
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

  const defaultFilterGuidanceContent = (
    <>
      <h3 className="mb-2 text-base font-medium text-black">Filtre Yönergeleri</h3>
      <p>Aradığınız sonuçlara daha hızlı ulaşmak için aşağıdaki filtre alanlarını kullanabilirsiniz:</p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        <li className="flex items-start gap-2">
          <UserIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Traveller Full Name:</strong> İlgili yolcunun adını yazarak arama yapabilirsiniz. Otomatik olarak
            eşleşen sonuçlar listelenecektir.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <StoreIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Merchant Title:</strong> İşlem yapılan mağaza/unvan bilgisini girerek filtreleyebilirsiniz. Birden
            fazla seçim yapılabilir.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <TagsIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Product Groups:</strong> İlgili ürün gruplarını seçerek yalnızca belirli kategorilerdeki işlemleri
            görüntüleyebilirsiniz.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <SearchIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            Tüm filtre seçimlerinizi tamamladıktan sonra <strong>&quot;Apply&quot;</strong> butonuna tıklayarak
            filtrelenmiş sonuçları görebilirsiniz.
          </span>
        </li>
      </ul>
    </>
  );

  function onSubmit() {
    startTransition(async () => {
      const totalAmount = Object.values(invoiceLines).reduce((acc, curr) => acc + curr.amount, 0);
      const totalTaxAmount = Object.values(invoiceLines).reduce((acc, curr) => acc + curr.taxAmount, 0);

      const merchantInfoResponse = await getMerchantByIdApi(merchantIds[0].id);
      const travellerInfoResponse = await getTravellersDetailsApi(travellerIds[0].id);
      const data = {
        merchant: {
          vatNumber: merchantInfoResponse.data.taxpayerId || "",
          countryCode: "TR",
          branchId: merchantInfoResponse.data.customerNumber || "",
        },
        traveller: {
          travelDocumentNumber: travellerInfoResponse.data.personalIdentifications[0].travelDocumentNumber,
          nationalityCountryCode2: travellerInfoResponse.data.personalIdentifications[0].nationalityCountryCode2,
          firstName: travellerInfoResponse.data.personalIdentifications[0].firstName,
          lastName: travellerInfoResponse.data.personalIdentifications[0].lastName,
          residenceCountryCode2: travellerInfoResponse.data.personalIdentifications[0].residenceCountryCode2,
          expirationDate: travellerInfoResponse.data.personalIdentifications[0].expirationDate,
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
      const response = await postTagApi({
        requestBody: data,
      });
      handlePostResponse(response, router, {
        prefix: getBaseLink("operations/tax-free-tags"),
        identifier: "id",
      });
    });
  }

  const filterData = {
    dateSelect: [],
    multiSelect: [
      {
        title: languageData.ProductGroups,
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
        title: languageData.TravellerFullName,
        fetchAction: searchTravellers,
        onChange: setTravellerIds,
        value: travellerIds,
        multiple: false,
      },
      {
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
      asyncSelect={filterData.asyncSelect}
      className={className}
      customField={filterData.customFields}
      dateSelect={filterData.dateSelect}
      defaultOpen={defaultOpen}
      disabled={isPending}
      filterGuidanceContent={defaultFilterGuidanceContent}
      isCollapsible={false}
      multiSelect={filterData.multiSelect}
      onSubmit={onSubmit}
    />
  );
}
