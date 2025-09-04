import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import type {UniRefund_TagService_Tags_TagDetailDto} from "@repo/saas/TagService";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

export default function Invoices({
  tagDetail,
  languageData,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
}) {
  return tagDetail.invoices?.map((invoice) => (
    <div className="flex flex-col gap-4 overflow-auto" key={invoice.id || ""}>
      {invoice.invoiceLines?.map((line) => (
        <div className="grid grid-cols-3 items-center gap-4" key={line.id || ""}>
          <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="factura-no">{languageData.FacturaNo}</Label>
              <Input disabled name="factura-no" placeholder={languageData.FacturaNo} value={invoice.number || ""} />
            </div>
          </div>
          <div />
          <div className="ml-auto mt-auto">
            <Button disabled variant="outline">
              {languageData.Save}
            </Button>
          </div>
          <Separator className="col-span-full" />
          <div>
            <Label htmlFor="product-group">{languageData.ProductGroups}</Label>
            <Select defaultValue={line.productGroup?.id} name="product-group">
              <SelectTrigger>
                <SelectValue placeholder={languageData["ProductGroups.Select"]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{languageData.ProductGroups}</SelectLabel>
                  {tagDetail.merchant?.productGroups?.map((productGroup) => {
                    return (
                      <SelectItem key={productGroup.id || ""} value={productGroup.id || ""}>
                        {productGroup.name || ""}
                      </SelectItem>
                    );
                  }) || (
                    <SelectItem key={line.id || ""} value={line.id || ""}>
                      {line.description || ""}
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <div className="ml-auto grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="factura-no">{languageData.Amount}</Label>
              <Input disabled placeholder={languageData.Amount} type="amount" value={line.amount} />
            </div>
          </div>

          <div className="col-span-full flex justify-end">
            <Button disabled variant="outline">
              {languageData.Save}
            </Button>
          </div>
        </div>
      ))}
    </div>
  ));
}
