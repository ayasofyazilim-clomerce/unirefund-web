"use client";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
import {getTenantByNameApi} from "@repo/actions/core/AccountService/actions";
import {Edit} from "lucide-react";
import {useState, type TransitionStartFunction} from "react";
import type {LanguageData} from "./schema";

export function TenantSelection({
  isPending,
  startTransition,
  onTenantChange,
  languageData,
}: {
  isPending: boolean;
  startTransition: TransitionStartFunction;
  onTenantChange: (tenantId: string) => void;
  languageData: LanguageData;
}) {
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [tenantSearchValue, setTenantSearchValue] = useState("");
  const [tenantName, setTenantName] = useState("");
  function handleSaveTenant() {
    startTransition(() => {
      if (tenantSearchValue.length === 0) {
        onTenantChange("");
        setTenantName("");
        setTenantDialogOpen(false);
      } else {
        void getTenantByNameApi(tenantSearchValue).then((res) => {
          if (res.data.isActive) {
            onTenantChange(res.data.tenantId || "");
            setTenantName(res.data.name || "");
            setTenantDialogOpen(false);
          } else {
            toast.error(languageData["Auth.tenant.error"]);
          }
        });
      }
    });
  }
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!isPending) setTenantDialogOpen(open);
      }}
      open={tenantDialogOpen}>
      <DialogTrigger className="w-full text-left" data-testid="open-tenant-form" disabled={isPending}>
        <span className="text-sm font-medium leading-none">{languageData["Auth.tenant"]}</span>
        <div className="flex h-9 items-center justify-between rounded-md border px-2">
          <span className={cn("max-w-full truncate text-sm", !tenantName && "text-muted-foreground")}>
            {tenantName ? tenantName : languageData["Auth.tenant.placeholder"]}
          </span>
          <Edit className="w-4 min-w-4" />
        </div>
      </DialogTrigger>
      <DialogContent
        onKeyDown={(e) => {
          if (e.code === "Enter") handleSaveTenant();
        }}>
        <DialogHeader>
          <DialogTitle>{languageData["Auth.tenant.switch"]}</DialogTitle>
          <DialogDescription>{languageData["Auth.tenant.placeholder"]}</DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5">
          <Label data-testid="tenantName-label" htmlFor="tenantName">
            {languageData["Auth.tenant.label"]}
          </Label>
          <Input
            data-testid="tenantName-input"
            defaultValue={tenantSearchValue || tenantName}
            disabled={isPending}
            id="tenantName"
            onChange={(e) => {
              setTenantSearchValue(e.currentTarget.value);
            }}
          />
        </div>
        <DialogFooter>
          <Button data-testid="save-tenant" disabled={isPending} onClick={handleSaveTenant} type="button">
            {languageData["Auth.tenant.save"]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
