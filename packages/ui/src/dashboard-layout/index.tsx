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
import {SortableLayout} from "../sortable-layout";
import {cn} from "../utils";

type DashboardItemConfig = {
  id: string;
  order: number;
  size: "small" | "medium" | "large"; //grid-cols-1, grid-cols-2, grid-cols-3
  className?: string;
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
  data: any[];
};

const cardClassNames = {
  container: "p-0 shadow-none rounded-none border-0 bg-white flex flex-col h-full",
  header: "p-4 pb-2",
  content: "p-4 py-0 my-auto items-center",
  footer: "p-4 pt-2 justify-center",
};

export type DashboardProps = {
  layoutClassName?: string;
  items: DashboardItemConfig[];
  cols: number;
};

export function DashboardLayout({items, layoutClassName, cols}: DashboardProps) {
  const modifiedItems = items.map((item) => {
    return {
      ...item,
      className: cn(
        item.size === "small" && "col-span-1",
        item.size === "medium" && "col-span-2",
        item.size === "large" && "col-span-3",
        item.className,
      ),
    };
  });
  return (
    <SortableLayout<DashboardItemConfig>
      className={cn("bg-border gap-px", layoutClassName, `grid-cols-${cols}`)}
      editMode={true}
      items={modifiedItems}
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
          return <></>;
        }
        return <div className="bg-red-500">Unknown item type</div>;
      }}
    />
  );
}
