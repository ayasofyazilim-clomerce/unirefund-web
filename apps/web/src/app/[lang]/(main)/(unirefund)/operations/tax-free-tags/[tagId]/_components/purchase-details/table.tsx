import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

function PurchaseDetailsTable({
  tagDetail,
  languageData,
  tagNo,
  productGroups,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
  tagNo: string;
  productGroups: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
}) {
  const invoiceNo = tagDetail.invoices?.[0]?.id || tagNo;
  const productGroup =
    productGroups.find(
      (i) => i.id === tagDetail.invoices?.[0]?.invoiceLines?.[0]?.productGroup,
    ) ||
    productGroups.find(
      (i) => i.id === "df3e6569-10ec-aa18-e086-3a17581cf79b",
    ) ||
    productGroups[0];

  const totals = tagDetail.totals || [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>{languageData.FacturaNo}</TableHead>
          <TableHead>{languageData.ProductGroups}</TableHead>
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
            {invoiceNo}
          </TableCell>
          <TableCell className="font-medium" rowSpan={4}>
            {`(%10) ${productGroup.name || "Unkown Product Group"}`}
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
