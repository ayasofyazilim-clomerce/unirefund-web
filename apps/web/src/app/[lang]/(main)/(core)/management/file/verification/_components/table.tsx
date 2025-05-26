"use client";
import type {UniRefund_FileService_Files_FileForHumanValidationDto} from "@ayasofyazilim/saas/FileService";
import {$UniRefund_FileService_Files_FileForHumanValidationDto} from "@ayasofyazilim/saas/FileService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {ExternalLinkIcon} from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {getBaseLink} from "@/utils";

type TableType = UniRefund_FileService_Files_FileForHumanValidationDto;
export function Table({data}: {data: TableType[]}) {
  const {lang} = useParams<{lang: string}>();
  const columns = tableColumns(lang);
  return (
    <TanstackTable<TableType, TableType>
      columnVisibility={{
        type: "hide",
        columns: ["validatorUser"],
      }}
      columns={columns}
      data={data}
    />
  );
}

function tableColumns(lang: string) {
  return tanstackTableCreateColumnsByRowData<TableType>({
    rows: $UniRefund_FileService_Files_FileForHumanValidationDto.properties,
    links: {
      id: {
        prefix: getBaseLink("management/file/verification", lang),
        targetAccessorKey: "id",
      },
    },
    custom: {
      fileLink: {
        content: (row) => {
          return (
            <Link className="flex gap-2 text-blue-600" href={row.fileLink} target="_blank">
              <ExternalLinkIcon className=" size-4" />
              {row.fileLink.split("/").at(-1)}
            </Link>
          );
        },
      },
    },
  });
}
