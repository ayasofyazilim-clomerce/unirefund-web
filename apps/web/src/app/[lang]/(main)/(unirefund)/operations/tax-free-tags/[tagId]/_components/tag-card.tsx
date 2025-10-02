"use client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import DateTooltip from "@repo/ayasofyazilim-ui/molecules/date-tooltip";
import Link from "next/link";
import {Fragment} from "react";
import {useTenant} from "@/providers/tenant";

function TagCardList({
  title,
  icon,
  rows,
  className = "",
}: {
  title: string;
  icon: string | React.ReactNode;
  rows: {name: string; value: string; link?: string; className?: string; type?: "date"}[];
  className?: string;
}) {
  const {localization} = useTenant();
  return (
    <TagCard className={className} icon={icon} title={title}>
      <div className="grid grid-cols-6 2xl:gap-2">
        {rows.map((row, index) => {
          let valueElement: React.ReactNode = row.value;

          if (row.link) {
            valueElement = (
              <Link className="text-blue-700" data-testid={`tag-link-${index}`} href={row.link} key={row.name}>
                {row.value}
              </Link>
            );
          } else if (row.type === "date") {
            valueElement = <DateTooltip date={row.value} localization={localization} />;
          }

          return (
            <Fragment key={row.name}>
              <div className="col-span-2">
                <div className="overflow-hidden text-ellipsis text-nowrap text-sm text-gray-500 hover:absolute hover:z-10 hover:overflow-visible hover:bg-white hover:pr-1">
                  {row.name}
                </div>
              </div>
              <div className="col-span-4">
                <div className={`${row.className} text-sm font-semibold`}>{valueElement}</div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </TagCard>
  );
}

export function TagCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("col-span-2 h-full flex-1 rounded-none", className)}>
      <CardHeader className="h-full py-4">
        <CardTitle className=" flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        {children}
      </CardHeader>
    </Card>
  );
}

export default TagCardList;
