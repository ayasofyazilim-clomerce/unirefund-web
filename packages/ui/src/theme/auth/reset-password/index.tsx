"use client";

import {useState, useTransition} from "react";

import {Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto} from "@ayasofyazilim/core-saas/AccountService";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ayasofyazilim-ui/atoms/form";
import {Input} from "@repo/ayasofyazilim-ui/atoms/input";
import {toast} from "@repo/ayasofyazilim-ui/atoms/sonner";
import {z, zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {XIcon} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FormProvider, useForm} from "react-hook-form";

const formSchema = z.object({
  email: z.string().email(),
  tenant: z.string().optional(),
});

export interface ResetPasswordCredentials {
  tenantId: string;
  email: string;
}

export default function ResetPasswordForm({
  languageData,
  isTenantDisabled,
  defaultTenant = "",
  onTenantSearchAction,
  onSubmitAction,
}: {
  languageData: {
    Login: string;
    ResetPassword: string;
    Tenant: string;
  };
  isTenantDisabled: boolean;
  defaultTenant?: string;
  onTenantSearchAction?: (name: string) => Promise<{
    type: "success";
    data: Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto;
  }>;
  onSubmitAction: (values: ResetPasswordCredentials) => Promise<{
    type: "success" | "error" | "api-error";
    message?: string;
  }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tenantId, setTenantId] = useState<string>("");
  const form = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant: defaultTenant,
    },
  });

  function searchForTenant(name: string) {
    if (!onTenantSearchAction || name.length < 1) return;

    startTransition(() => {
      onTenantSearchAction(name).then((response) => {
        if (response.type !== "success" || !response.data.success) {
          form.setError("tenant", {type: "manual", message: "Tenant not found."}, {shouldFocus: true});
          return;
        }
        form.clearErrors("tenant");
        form.setValue("tenant", response.data.name || "");
        setTenantId(response.data.tenantId || "");
      });
    });
  }
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      onSubmitAction({
        tenantId,
        email: values.email,
      }).then((response) => {
        if (response.type !== "success") {
          toast.error(response?.message);
          return;
        }
        toast.success("Check your email to continue.");
        router.replace(`/login${location.search}`);
      });
    });
  }
  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 p-5 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{languageData.ResetPassword}</h1>
      </div>
      <div className="grid space-y-2">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {!isTenantDisabled && (
              <FormField
                control={form.control}
                name="tenant"
                disabled={isPending}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Tenant</FormLabel>
                    <FormControl>
                      <div className="relative w-full max-w-sm">
                        <Input
                          {...field}
                          onBlur={(e) => searchForTenant(e.target.value)}
                          placeholder="Logging in as host"
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          tabIndex={-1}
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 "
                          onClick={() => {
                            form.setValue("tenant", "");
                          }}>
                          <XIcon className="h-4 w-4" />
                          <span className="sr-only">Clear</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>Leave empty for host.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="user@example.com" autoComplete="true" />
                  </FormControl>
                  <FormDescription>User name or email address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button disabled={isPending} className="my-2 w-full">
                Reset Password
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      <div className="flex items-center justify-center">
        <span className="bg-muted h-px w-full"></span>
        <span className="text-muted-foreground whitespace-nowrap text-center text-xs uppercase">OR</span>
        <span className="bg-muted h-px w-full"></span>
      </div>
      <Link href="login" className="text-muted-foreground mt-1 text-xs hover:underline">
        <Button disabled={isPending} className=" w-full" variant={"outline"}>
          Login
        </Button>
      </Link>
      <Link href="register" className="text-muted-foreground mt-1 text-xs hover:underline">
        <Button disabled={isPending} className=" w-full" variant={"outline"}>
          Register
        </Button>
      </Link>
    </div>
  );
}
