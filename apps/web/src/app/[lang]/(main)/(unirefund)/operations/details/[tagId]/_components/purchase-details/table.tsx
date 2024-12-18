import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

function PurchaseDetailsTable({
  tagDetail,
  languageData,
  tagNo,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
  tagNo: string;
}) {
  const totals = tagDetail.totals || [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>{languageData.FacturaNo}</TableHead>
          <TableHead className="w-[100px]" />
          <TableHead className="w-[300px] text-right">
            {languageData.Amount}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium" rowSpan={4}>
            {languageData.Totals}
          </TableCell>
          <TableCell className="font-medium" rowSpan={4}>
            {tagNo}
          </TableCell>
        </TableRow>
        {totals.map((invoice) => (
          <TableRow key={invoice.totalType}>
            <TableCell className="font-medium">{invoice.totalType}</TableCell>
            <TableCell className="text-right">
              {invoice.amount} {invoice.currency}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell>{languageData.Totals}</TableCell>
          <TableCell className="text-right">
            {totals.find((item) => item.totalType === "GrossRefund")?.amount ||
              0}{" "}
            {totals[0]?.currency}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default PurchaseDetailsTable;
