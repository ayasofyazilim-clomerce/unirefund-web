"use client";

import {XIcon} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import {FormProvider, useForm} from "react-hook-form";
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
import {PasswordInput} from "@repo/ayasofyazilim-ui/molecules/password-input";
import {LanguageData} from "../types";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  tenant: z.string().optional(),
});

export interface LoginCredentials {
  tenantId: string;
  userName: string;
  password: string;
  redirectTo: string;
}
export default function LoginForm({
  languageData,
  isTenantDisabled,
  defaultTenant = "",
  onTenantSearchAction,
  onSubmitAction,
}: {
  languageData: LanguageData;
  isTenantDisabled: boolean;
  defaultTenant?: string;
  onTenantSearchAction?: (name: string) => Promise<{
    type: "success";
    data: Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto;
  }>;
  onSubmitAction: (values: LoginCredentials) => Promise<{
    type: "success" | "error";
    message?: string;
    data?: string;
  }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tenantData, setTenantData] = useState<Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto>({});
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
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
        setTenantData(response.data);
        setSubmitDisabled(false);
      });
    });
  }
  function onSubmit(values: z.infer<typeof formSchema>) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirectTo");

    // Improved default redirect logic - use home page instead of just language code
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const language = pathParts[0] || "en";
    const defaultRedirect = `/${language}/home`;
    const redirectTo = redirect ? decodeURIComponent(redirect) : defaultRedirect;

    startTransition(() => {
      onSubmitAction({
        tenantId: tenantData.tenantId || "",
        userName: values.username,
        password: values.password,
        redirectTo: redirectTo,
      }).then((response) => {
        if (response && response.type !== "success") {
          toast.error(response?.message);
          return;
        }
      });
    });
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get("error") as keyof typeof languageData | null;
    if (error) {
      toast.error(error);
    }
  }, [typeof location !== "undefined"]);

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 p-5 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{languageData["Auth.Login"]}</h1>
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
                    <FormLabel>{languageData["Auth.Tenant"]}</FormLabel>
                    <FormControl>
                      <div className="relative w-full max-w-sm">
                        <Input
                          {...field}
                          onBlur={(e) => searchForTenant(e.target.value)}
                          onChange={(e) => {
                            if (!isSubmitDisabled) setSubmitDisabled(true);

                            form.setValue("tenant", e.target.value);
                          }}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") searchForTenant(form.getValues("tenant") || "");
                          }}
                          placeholder={languageData["Auth.TenantPlaceholder"]}
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
                          <span className="sr-only">{languageData["Auth.Clear"]}</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>{languageData["Auth.LeaveOrEmpty"]}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="username"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{languageData["Auth.UsernameOrEmailLabel"]}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="user@example.com" autoComplete="true" />
                  </FormControl>
                  <FormDescription>{languageData["Auth.UsernameOrEmailDescription"]}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{languageData["Auth.PasswordLabel"]}</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
              <Link href="reset-password" className="text-muted-foreground mt-1 text-xs hover:underline">
                {languageData["Auth.ForgotPassword"]}
              </Link>
            </div>
            <div>
              <Button disabled={isPending || isSubmitDisabled} className="my-2 w-full">
                {languageData["Auth.Login"]}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      <div className="flex items-center justify-center">
        <span className="bg-muted h-px w-full"></span>
        <span className="text-muted-foreground whitespace-nowrap text-center text-xs uppercase">
          {languageData["Auth.HaveAnAccount"]}
        </span>
        <span className="bg-muted h-px w-full"></span>
      </div>
      <Link href="register" className="text-muted-foreground mt-1 text-xs hover:underline">
        <Button disabled={isPending} className=" w-full" variant={"outline"}>
          {languageData["Auth.Register"]}
        </Button>
      </Link>
    </div>
  );
}
