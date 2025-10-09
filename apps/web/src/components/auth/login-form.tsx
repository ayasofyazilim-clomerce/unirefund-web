"use client";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/sonner";
import {signInServerApi} from "@repo/actions/core/AccountService/actions";
import {type z, zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import Link from "next/link";
import {useEffect, useTransition} from "react";
import {useParams, useSearchParams} from "next/navigation";
import {createAuthSchemas, type LanguageData} from "./schema";
import {TenantSelection} from "./tenant";

export function LoginForm({
  languageData,
  defaultTenantId,
  signUpPath = "register",
  resetPasswordPath = "reset-password",
}: {
  languageData: LanguageData;
  defaultTenantId: string | undefined;
  signUpPath?: string;
  resetPasswordPath?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const {lang} = useParams<{lang: string}>();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const {loginSchema} = createAuthSchemas({languageData, defaultTenantId});
  const form = useForm<z.infer<typeof loginSchema>>({resolver: zodResolver(loginSchema)});
  function onSubmit(data: z.infer<typeof loginSchema>) {
    startTransition(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirectTo");
      const defaultRedirect = `/${lang}/home`;
      const redirectTo = redirect ? decodeURIComponent(redirect) : defaultRedirect;
      void signInServerApi({
        ...data,
        redirectTo,
      }).then((response) => {
        if (response.type !== "success") {
          toast.error(response.message);
        }
      });
    });
  }
  useEffect(() => {
    if (error) {
      toast.error(languageData["Auth.ResetPasswordError"]);
    }
  }, []);
  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        data-testid="login-form"
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div className="flex flex-col items-center gap-0 text-center">
          <h1 className="text-2xl font-bold">{languageData["Auth.LoginTitle"]}</h1>
          <p className="text-muted-foreground text-balance">{languageData["Auth.LoginMessage"]}</p>
        </div>
        <TenantSelection
          isPending={isPending}
          languageData={languageData}
          onTenantChange={(tenantId) => {
            form.setValue("tenantId", tenantId);
          }}
          startTransition={startTransition}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({field}) => (
            <FormItem className="space-y-0.5">
              <FormLabel>{languageData["Auth.userNameOrEmail.label"]}</FormLabel>
              <FormControl>
                <Input
                  data-testid="userName-input"
                  placeholder={languageData["Auth.userNameOrEmail.placeholder"]}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem className="space-y-0.5">
              <div className="flex items-center">
                <FormLabel>{languageData["Auth.password.label"]}</FormLabel>
                <Link
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                  data-testid="password-link"
                  href={resetPasswordPath}>
                  {languageData["Auth.password.forgot"]}
                </Link>
              </div>
              <FormControl>
                <Input
                  data-testid="password-input"
                  placeholder={languageData["Auth.password.placeholder"]}
                  type="password"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" data-testid="submit-button" disabled={isPending} type="submit">
          {languageData["Auth.signIn"]}
        </Button>
        <p className="text-muted-foreground !mt-10 text-center text-sm">
          {languageData["Auth.dontHaveAnAccount"]}{" "}
          <Link className="underline" data-testid="signup-link" href={signUpPath}>
            {languageData["Auth.signUp"]}
          </Link>
        </p>
      </form>
    </Form>
  );
}
