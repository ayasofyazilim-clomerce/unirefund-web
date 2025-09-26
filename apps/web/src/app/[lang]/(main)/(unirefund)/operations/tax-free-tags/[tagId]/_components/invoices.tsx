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
              <Label data-testid="factura-no-label" htmlFor="factura-no">
                {languageData.FacturaNo}
              </Label>
              <Input
                data-testid="factura-no-input"
                disabled
                name="factura-no"
                placeholder={languageData.FacturaNo}
                value={invoice.number || ""}
              />
            </div>
          </div>
          <div />
          <div className="ml-auto mt-auto">
            <Button data-testid="save-factura-no" disabled variant="outline">
              {languageData.Save}
            </Button>
          </div>
          <Separator className="col-span-full" />
          <div>
            <Label data-testid="product-group-label" htmlFor="product-group">
              {languageData.ProductGroups}
            </Label>
            <Select defaultValue={line.productGroup?.id} disabled={tagDetail.status !== "Issued"} name="product-group">
              <SelectTrigger data-testid="product-group-trigger">
                <SelectValue placeholder={languageData["ProductGroups.Select"]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{languageData.ProductGroups}</SelectLabel>
                  {tagDetail.merchant?.productGroups?.length ? (
                    tagDetail.merchant.productGroups.map((productGroup, index) => {
                      return (
                        <SelectItem
                          data-testid={`product-group-item-${index}`}
                          key={productGroup.id || ""}
                          value={productGroup.id || ""}>
                          {productGroup.name || ""}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem
                      data-testid="product-group-item"
                      key={line.productGroup?.id || ""}
                      value={line.productGroup?.id || ""}>
                      {line.productGroup?.name || ""}
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <div className="ml-auto grid w-full max-w-sm items-center gap-1.5">
              <Label data-testid="amount-label" htmlFor="amount">
                {languageData.Amount}
              </Label>
              <Input
                data-testid="amount-input"
                disabled
                placeholder={languageData.Amount}
                type="amount"
                value={line.amount}
              />
            </div>
          </div>

          <div className="col-span-full flex justify-end">
            <Button data-testid="save-line" disabled variant="outline">
              {languageData.Save}
            </Button>
          </div>
        </div>
      ))}
    </div>
  ));
}
