"use client";

import {toast} from "@/components/ui/sonner";
import {DashboardLayout} from "@repo/ui/dashboard-layout";
import {
  issuedTagsByRefundMethod,
  issuedTagsByTimeOfDay,
  issuedTagsByTimeOfWeekday,
  issuingNationalities,
  topChains,
} from "./data";

const formatCurrency = (value: unknown) => `${Intl.NumberFormat("tr").format(Number(value)).toString()}₺`;

export default function Page() {
  return (
    <DashboardLayout
      cols={4}
      items={[
        {
          id: "b1a7c9e3-4f2d-4c9e-9c1a-3f8e6e1a7c9e",
          order: 0,
          colSpan: 1,
          type: "area",
          data: issuedTagsByTimeOfDay,
          config: {
            tags: {label: "Tags", color: "var(--chart-1)"},
          },
          title: "Tags by Time of Day",
        },
        {
          id: "c2b8d4f5-5e3f-4d8f-9d2b-4f9e7e2b8d4f",
          order: 1,
          colSpan: 1,
          type: "bar",
          config: {tags: {label: "Tags", color: "var(--chart-1)"}},
          xAxisKey: "label",
          title: "Tags by Weekday",
          layout: "horizontal",
          data: issuedTagsByTimeOfWeekday,
        },
        {
          id: "d3c9e5f6-6f4g-5e9g-9e3c-5g0f8e3c9e5f",
          order: 2,
          colSpan: 1,
          type: "radar",
          data: topChains,
          config: {
            tags: {label: "Tags", color: "var(--chart-1)"},
            sales: {label: "Sales", color: "var(--chart-2)"},
            vat: {label: "VAT", color: "var(--chart-3)"},
            atv: {label: "ATV", color: "var(--chart-4)"},
          },
          valueSuffix: "TL",
          polarKey: "name",
          title: "Top 10 Chains",
        },
        {
          id: "e4d0f6g7-7g5h-6f0h-9d4e-6h1g9d4e0f6g",
          order: 3,
          colSpan: 1,
          type: "pie",
          innerRadius: 60,
          data: issuingNationalities,
          title: "Issuing Nationalities",
          totalLabel: "Tags",
          chartStyle: "pie",
        },
        {
          id: "f5e1g7h8-8h6i-7g1i-9e5f-7i2h9e5f1g7h",
          order: 4,
          colSpan: 1,
          type: "pie",
          chartStyle: "donut",
          innerRadius: 60,
          data: issuedTagsByRefundMethod,
          valuePrefix: "%",
          title: "Refunded Tags by Refund Method",
        },
        {
          id: "g6f2h8i9-9i7j-8h2j-9f6g-8j3i9f6g2h8i",
          order: 5,
          colSpan: 3,
          type: "table",
          data: topChains,
          config: {
            headerKeys: {
              name: "Chain Name",
              tags: "Tags",
              sales: "Sales",
              vat: "VAT",
              atv: "ATV",
            },
            format: {
              sales: formatCurrency,
              vat: formatCurrency,
              atv: formatCurrency,
            },
          },
        },
      ]}
      layoutClassName="h-full"
      onSave={() => {
        toast.success("Saved");
      }}
    />
  );
}
