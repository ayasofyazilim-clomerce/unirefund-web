"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Fragment } from "react";

function TagCardList({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: string | React.ReactNode;
  rows: { name: string; value: string; link?: string; className?: string }[];
}) {
  return (
    <TagCard icon={icon} title={title}>
      <div className="grid grid-cols-6 gap-2">
        {rows.map((row) => {
          const valueElement = row.link ? (
            <Link className="text-blue-700" href={row.link} key={row.name}>
              {row.value}
            </Link>
          ) : (
            row.value
          );
          return (
            <Fragment key={row.name}>
              <div className="col-span-2">
                <div className="text-sm text-gray-500">{row.name}</div>
              </div>
              <div className="col-span-4">
                <div className={`${row.className} text-sm font-semibold`}>
                  {valueElement}
                </div>
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
}: {
  title: string;
  icon: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="min-h-0 flex-1 rounded-none">
      <CardHeader className="py-4">
        <CardTitle className=" mb-4 flex items-center gap-2 text-2xl">
          {icon}
          {title}
        </CardTitle>
        {children}
      </CardHeader>
    </Card>
  );
}

export default TagCardList;
