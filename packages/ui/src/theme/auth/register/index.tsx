"use client";

import {useEffect, useState, useTransition} from "react";

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
import {XIcon} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FormProvider, useForm} from "react-hook-form";
import {LanguageData} from "../types";

const formSchema = z.object({
  username: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(4).max(32),
  tenant: z.string().optional(),
});

export interface RegisterCredentials {
  tenantId: string;
  userName: string;
  email: string;
  password: string;
}

export default function RegisterForm({
  languageData,
  defaultTenant = "",
  onSubmitAction,
  isTenantDisabled,
  onTenantSearchAction,
}: {
  languageData: LanguageData;
  defaultTenant?: string;
  isTenantDisabled: boolean;
  onSubmitAction: (values: RegisterCredentials) => Promise<{
    type: "success" | "error";
    message?: string;
    data?: string;
  }>;
  onTenantSearchAction?: (name: string) => Promise<{
    type: "success";
    data: Volo_Abp_AspNetCore_Mvc_MultiTenancy_FindTenantResultDto;
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
          form.setError("tenant", {type: "manual", message: languageData["Auth.TenantNotFound"]}, {shouldFocus: true});
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
    startTransition(() => {
      onSubmitAction({
        tenantId: tenantData.tenantId || "",
        userName: values.username,
        email: values.email,
        password: values.password,
      }).then((response) => {
        if (response.type !== "success") {
          toast.error(response?.message);
          return;
        }
        toast.success(languageData["Auth.RegisterSuccess"]);
        router.replace(`/${location.pathname.split("/").slice(1, 3).join("/")}/login${location.search}`);
      });
    });
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get("error") as keyof typeof languageData | null;
    if (error) {
      toast.error(languageData[error] || "Something went wrong. Please try again.");
    }
  }, [typeof location !== "undefined"]);

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 p-5 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{languageData["Auth.Register"]}</h1>
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
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{languageData["Auth.EmailAddressLabel"]}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{languageData["Auth.UsernameLabel"]}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="user@example.com" autoComplete="true" />
                  </FormControl>
                  <FormDescription>{languageData["Auth.UsernameDescription"]}</FormDescription>
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

            <div>
              <Button disabled={isPending || isSubmitDisabled} className="my-2 w-full">
                {languageData["Auth.Register"]}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      <div className="flex items-center justify-center">
        <span className="bg-muted h-px w-full"></span>
        <span className="text-muted-foreground whitespace-nowrap text-center text-xs uppercase">
          {languageData["Auth.DoYouHaveAccount"]}
        </span>
        <span className="bg-muted h-px w-full"></span>
      </div>
      <Link href="login" className="text-muted-foreground mt-1 text-xs hover:underline">
        <Button disabled={isPending} className=" w-full" variant={"outline"}>
          {languageData["Auth.Login"]}
        </Button>
      </Link>
    </div>
  );
}
