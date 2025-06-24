"use client";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@repo/ayasofyazilim-ui/atoms/table";
import {
  AreaChart,
  AreaChartProps,
  BarChart,
  BarChartProps,
  PieChart,
  PieChartProps,
  RadarChart,
  RadarChartProps,
} from "@repo/ayasofyazilim-ui/molecules/charts";
import {useState} from "react";
import {SortableLayout} from "../sortable-layout";
import {cn} from "../utils";
import {CustomizeDashboard} from "./customize-dashboard";

export type DashboardItemConfig = {
  id: string;
  order: number;
  className?: string;
  style?: React.CSSProperties;
  colSpan?: number;
} & (
  | DashboardPieChartItem
  | DashboardAreaChartItem
  | DashboardBarChartItem
  | DashboardRadarChartItem
  | DashboardTableItem
);

type DashboardPieChartItem = {
  type: "pie" | "donut";
} & PieChartProps;

type DashboardAreaChartItem = {
  type: "area";
} & AreaChartProps;

type DashboardBarChartItem = {
  type: "bar";
} & BarChartProps;

type DashboardRadarChartItem = {
  type: "radar";
} & RadarChartProps;

type DashboardTableItem = {
  type: "table";
  data: Array<Record<string, string | number>>;
  config: {
    headerKeys: Record<string, string>;
  };
};

const cardClassNames = {
  container: "p-0 shadow-none rounded-none border-0 bg-white flex flex-col h-full",
  header: "p-4 pb-2 items-start",
  content: "p-4 py-0 my-auto items-center",
  footer: "p-4 pt-2 justify-center",
};

export type DashboardProps = {
  layoutClassName?: string;
  items: DashboardItemConfig[];
  cols: number;
  customizeable?: boolean;
  onSave?: (items: DashboardItemConfig[], layout: Layout) => void;
};

export type Layout = {
  cols: number;
};
export function DashboardLayout({items: initialItems, layoutClassName, cols, onSave}: DashboardProps) {
  const [layout, setLayout] = useState<Layout>({cols});
  const [list, setList] = useState<DashboardItemConfig[]>(initialItems);
  return (
    <div className="flex h-full flex-col">
      <CustomizeDashboard
        layout={layout}
        setLayout={setLayout}
        saveLayout={
          onSave
            ? () => {
                return onSave(list, layout);
              }
            : undefined
        }
      />
      <SortableLayout<DashboardItemConfig>
        className={cn("bg-border gap-px", layoutClassName)}
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
        }}
        editMode={true}
        maxColSpan={layout.cols}
        items={initialItems}
        getLatestList={(latestItems) => setList(latestItems)}
        renderItem={(item) => {
          if (item.type === "area") {
            return <AreaChart classNames={{card: cardClassNames}} {...item} />;
          }
          if (item.type === "pie" || item.type === "donut") {
            return <PieChart classNames={{card: cardClassNames}} {...item} />;
          }
          if (item.type === "bar") {
            return <BarChart classNames={{card: cardClassNames}} {...item} />;
          }
          if (item.type === "radar") {
            return <RadarChart classNames={{card: cardClassNames}} {...item} />;
          }
          if (item.type === "table") {
            return (
              <Table wrapperClassName="p-4 bg-white h-full">
                <TableHeader>
                  <TableRow>
                    {Object.entries(item.config.headerKeys).map(([key, value]) => (
                      <TableHead key={key}>{value}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.data.map((items) => {
                    return (
                      <TableRow key={items.id}>
                        {Object.keys(item.config.headerKeys).map((key) => {
                          return <TableCell key={key}>{items[key]}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            );
          }
          return <div className="bg-red-500">Unknown item type</div>;
        }}
      />
    </div>
  );
}
