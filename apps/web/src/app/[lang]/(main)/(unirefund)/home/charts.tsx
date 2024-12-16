/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- TODO: we need to fix this*/
"use client";
import { Button } from "@repo/ayasofyazilim-ui/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@repo/ayasofyazilim-ui/atoms/card";
import { AreaChart } from "@repo/ayasofyazilim-ui/molecules/area-chart";
import { BarChart } from "@repo/ayasofyazilim-ui/molecules/bar-chart";
import { BarList } from "@repo/ayasofyazilim-ui/molecules/bar-list";
import { CategoryBar } from "@repo/ayasofyazilim-ui/molecules/category-bar";
import { LineChart } from "@repo/ayasofyazilim-ui/molecules/line-chart";
import ScrollArea from "@repo/ayasofyazilim-ui/molecules/scroll-area";
import DataTable from "@repo/ayasofyazilim-ui/molecules/tables";
import { SortableLayout } from "@repo/ui/sortable-layout";
import { Grid2X2, SaveAll } from "lucide-react";
import { useState } from "react";

const issuingNationalities = [
  {
    name: "Saudi Arabia",
    value: 126,
    className: "bg-green-500 text-white group-hover:bg-green-600",
  },
  {
    name: "Iran",
    value: 107,
    className: "bg-green-400 text-white group-hover:bg-green-500",
  },
  {
    name: "Russian Federation",
    value: 98,
    className: "bg-green-300 text-green-600 group-hover:bg-green-400",
  },
  {
    name: "Egypt",
    value: 79,
    className: "bg-orange-300 text-orange-600 group-hover:bg-orange-400",
  },
  {
    name: "United States of America",
    value: 27,
    className: "bg-orange-200 text-orange-600 group-hover:bg-orange-300",
  },
];
const issuedTagsByTimeOfDay = [
  {
    date: "00:00",
    Tags: 336,
  },
  {
    date: "01:00",
    Tags: 0,
  },
  {
    date: "02:00",
    Tags: 0,
  },
  {
    date: "03:00",
    Tags: 0,
  },
  {
    date: "04:00",
    Tags: 0,
  },
  {
    date: "05:00",
    Tags: 3,
  },
  {
    date: "06:00",
    Tags: 3,
  },
  {
    date: "07:00",
    Tags: 40,
  },
  {
    date: "08:00",
    Tags: 98,
  },
  {
    date: "09:00",
    Tags: 180,
  },
  {
    date: "10:00",
    Tags: 226,
  },
  {
    date: "11:00",
    Tags: 272,
  },
  {
    date: "12:00",
    Tags: 225,
  },
  {
    date: "13:00",
    Tags: 225,
  },
  {
    date: "14:00",
    Tags: 216,
  },
  {
    date: "15:00",
    Tags: 164,
  },
  {
    date: "16:00",
    Tags: 198,
  },
  {
    date: "17:00",
    Tags: 166,
  },
  {
    date: "18:00",
    Tags: 156,
  },
  {
    date: "19:00",
    Tags: 48,
  },
  {
    date: "20:00",
    Tags: 19,
  },
  {
    date: "21:00",
    Tags: 31,
  },
  {
    date: "22:00",
    Tags: 17,
  },
  {
    date: "23:00",
    Tags: 2,
  },
];
const issuedTagsByTimeOfWeekday = [
  {
    weekday: "Monday",
    Tags: "781",
  },
  {
    weekday: "Tuesday",
    Tags: "763",
  },
  {
    weekday: "Wednesday",
    Tags: "252",
  },
  {
    weekday: "Thursday",
    Tags: "0",
  },
  {
    weekday: "Friday",
    Tags: "0",
  },
  {
    weekday: "Saturday",
    Tags: "19",
  },
  {
    weekday: "Sunday",
    Tags: "840",
  },
];
const top5Chains = [
  {
    id: "m5gr84i9",
    tags: 405,
    sales: `${Intl.NumberFormat("tr").format(17478068881).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(2891490255).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(43155726).toString()}₺`,
    result: "Bulgari Turkey Lüks Ürün Ticaret Limited Şirketi",
  },
  {
    id: "3u1reuv4",
    tags: 106,
    sales: `${Intl.NumberFormat("tr").format(16223005648).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(2703834268).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(1530472223).toString()}₺`,
    result: "Times Mağazacılık ve Dış Ticaret Anonim Şirketi",
  },
  {
    id: "derv1ws0",
    tags: 4055,
    sales: `${Intl.NumberFormat("tr").format(12793641609).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(158076342).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(3155029).toString()}₺`,
    result:
      "Doğuş Perakende Satış Giyim ve Aksesuar Dış Ticaret Anonim Şirketi",
  },
  {
    id: "5kma53ae",
    tags: 5660,
    sales: `${Intl.NumberFormat("tr").format(4166799674).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(379476978).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(736184).toString()}₺`,
    result: "Barçın Spor Malzemeleri Ticaret ve Sanayi Anonim Şirketi",
  },
  {
    id: "bhqecj4p",
    tags: 16307,
    sales: `${Intl.NumberFormat("tr").format(4007679453).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(373066609).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(245764).toString()}₺`,
    result: "Defacto Perakende Ticaret Anonim Şirketi",
  },
];
const top5Stores = [
  {
    id: "m5gr84i9",
    tags: 102,
    "%ofTotal": `0,20 %`,
    sis: `${Intl.NumberFormat("tr").format(17478068881).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(2891490255).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(43155726).toString()}₺`,
    result: "Bulgari Turkey Lüks Ürün Ticaret Limited Şirketi",
  },
  {
    id: "3u1reuv4",
    tags: 106,
    "%ofTotal": `0,41 %`,
    sis: `${Intl.NumberFormat("tr").format(17478068881).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(2891490255).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(43155726).toString()}₺`,
    result: "Times Mağazacılık ve Dış Ticaret Anonim Şirketi",
  },
  {
    id: "derv1ws0",
    tags: 4055,
    "%ofTotal": `0,37 %`,
    sis: `${Intl.NumberFormat("tr").format(17478068881).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(2891490255).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(43155726).toString()}₺`,
    result:
      "Doğuş Perakende Satış Giyim ve Aksesuar Dış Ticaret Anonim Şirketi",
  },
  {
    id: "5kma53ae",
    tags: 5660,
    "%ofTotal": `0,29 %`,
    sis: `${Intl.NumberFormat("tr").format(17478068881).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(2891490255).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(43155726).toString()}₺`,
    result: "Barçın Spor Malzemeleri Ticaret ve Sanayi Anonim Şirketi",
  },
  {
    id: "bhqecj4p",
    tags: 16307,
    "%ofTotal": `98,73 %`,
    sis: `${Intl.NumberFormat("tr").format(17478068881).toString()}₺`,
    vat: `${Intl.NumberFormat("tr").format(2891490255).toString()}₺`,
    atv: `${Intl.NumberFormat("tr").format(43155726).toString()}₺`,
    result: "Diğerleri",
  },
];
const DashboardJson = {
  layout: "grid",
  items: [
    {
      id: 1,
      order: 1,
      type: "barChart",
      title: "Issues tags by weekday",
      description: "Issues tags by weekday",
      categories: ["Tags"],
      index: "date",
      data: issuedTagsByTimeOfDay,
    },
    {
      id: 2,
      order: 2,
      type: "barChart",
      title: "Issues tags by time of week",
      description: "Issues tags by time of week",
      categories: ["Tags"],
      index: "weekday",
      data: issuedTagsByTimeOfWeekday,
    },
    {
      id: 3,
      order: 3,
      type: "barList",
      title: "Top 5 issuing nationalities",
      description: "Bar list description",
      data: issuingNationalities,
      className: "col-span-2",
    },
    {
      id: 4,
      order: 4,
      type: "component",
      title: "Top 5 Chains",
      description: "Bar list description",
      data: top5Chains,
      component: (
        <DataTable
          columnsData={{
            type: "Custom",
            data: {
              columns: [
                {
                  id: "select",
                  enableSorting: false,
                  enableHiding: false,
                },
                {
                  accessorKey: "result",
                  header: "Result",
                },
                {
                  accessorKey: "tags",
                  header: "Tags",
                },
                {
                  accessorKey: "sales",
                  header: "Sales",
                },
                {
                  accessorKey: "vat",
                  header: "VAT",
                },
                {
                  accessorKey: "atv",
                  header: "ATV",
                },
              ],
            },
          }}
          data={top5Chains}
        />
      ),
      className: "",
    },
    {
      id: 5,
      order: 5,
      type: "component",
      title: "Top 5 Stores",
      description: "Bar list description",
      data: top5Stores,
      component: (
        <DataTable
          columnsData={{
            type: "Custom",
            data: {
              columns: [
                {
                  id: "select",
                  enableSorting: false,
                  enableHiding: false,
                },
                {
                  accessorKey: "result",
                  header: "Result",
                },
                {
                  accessorKey: "tags",
                  header: "Tags",
                },
                {
                  accessorKey: "%ofTotal",
                  header: "% Of Total",
                },
                {
                  accessorKey: "sis",
                  header: "SIS",
                },
                {
                  accessorKey: "vat",
                  header: "VAT",
                },
                {
                  accessorKey: "atv",
                  header: "ATV",
                },
              ],
            },
          }}
          data={top5Stores}
        />
      ),
      className: "",
    },
  ],
};

export default function Charts() {
  const [sortableEditMode, setSortableEditMode] = useState(false);
  const [listOrder, setListOrder] = useState(DashboardJson.items);
  function getLatestList(list: typeof DashboardJson.items) {
    setListOrder(
      list.map((item, index: number) => {
        return { ...item, order: index + 1 };
      }),
    );
  }
  function handleEditMode() {
    setSortableEditMode(!sortableEditMode);
    if (sortableEditMode) {
      setListOrder(listOrder);
    }
  }

  return (
    <ScrollArea className="flex h-full [&>div>div]:h-full">
      <div className="flex h-full grow flex-col-reverse">
        <SortableLayout
          className="h-full grid-cols-2 p-4"
          editMode={sortableEditMode}
          getLatestList={getLatestList}
          items={DashboardJson.items}
          renderItem={(item: any) => {
            return (
              <Card className="h-full rounded-md shadow-none">
                <CardHeader>{item.title}</CardHeader>
                <CardContent>
                  {item.type === "barChart" && <BarChartHero item={item} />}
                  {item.type === "areaChart" && <AreaChartHero item={item} />}
                  {item.type === "barList" && <BarListHero item={item} />}
                  {item.type === "categoryBar" && (
                    <CategoryBarHero item={item} />
                  )}
                  {item.type === "lineChart" && <LineChartHero item={item} />}
                  {item.type === "component" && item.component}
                </CardContent>
              </Card>
            );
          }}
        />
        <div className="sticky top-0 flex h-16 w-full items-center border-b bg-white px-4">
          <Button
            className="h-8 w-8 bg-white p-0 text-slate-900 shadow"
            onClick={handleEditMode}
            variant="secondary"
          >
            {sortableEditMode ? (
              <SaveAll className="w-4" />
            ) : (
              <Grid2X2 className="w-4" />
            )}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

function AreaChartHero({ item }: any) {
  return (
    <AreaChart
      categories={["SolarPanels", "Inverters"]}
      className="h-80"
      data={item.data}
      index="date"
      valueFormatter={(number: number) =>
        `$${Intl.NumberFormat("us").format(number).toString()}`
      }
    />
  );
}
function BarChartHero({ item }: any) {
  return (
    <BarChart
      categories={item.categories}
      className="h-80"
      colors={["emerald"]}
      data={item.data}
      index={item.index}
      valueFormatter={(number: number) =>
        Intl.NumberFormat("us").format(number).toString()
      }
    />
  );
}
function BarListHero({ item }: any) {
  return <BarList data={item.data} />;
}
function CategoryBarHero({ item }: any) {
  return (
    <CategoryBar
      className="mx-auto w-full p-4"
      colors={["pink", "amber", "emerald"]}
      marker={{ value: 99, tooltip: "68", showAnimation: true }}
      values={item.data}
    />
  );
}
function LineChartHero({ item }: any) {
  return (
    <LineChart
      categories={["SolarPanels", "Inverters"]}
      className="h-80"
      data={item.data}
      index="date"
      valueFormatter={(number: number) =>
        `$${Intl.NumberFormat("us").format(number).toString()}`
      }
      xAxisLabel="Month"
      yAxisLabel="Spend Category"
    />
  );
}
