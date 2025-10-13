"use client";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/sonner";
import {sendPasswordResetCodeApi} from "@repo/actions/core/AccountService/actions";
import {type z, zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {Logo} from "@repo/ui/logo";
import {createAuthSchemas, type LanguageData} from "./schema";
import {TenantSelection} from "./tenant";

export function ResetPasswordForm({
  languageData,
  defaultTenantId,
  signInPath = "login",
}: {
  languageData: LanguageData;
  defaultTenantId: string | undefined;
  signInPath?: string;
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {resetPasswordSchema} = createAuthSchemas({languageData, defaultTenantId});
  const form = useForm<z.infer<typeof resetPasswordSchema>>({resolver: zodResolver(resetPasswordSchema)});
  function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    startTransition(() => {
      void sendPasswordResetCodeApi(data).then((res) => {
        if (res.type !== "success") {
          toast.error(res.message);
          return;
        }
        toast.success(languageData["Auth.RegisterSuccess"]);
        router.replace(`/${lang}/${signInPath}`);
      });
    });
  }
  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        data-testid="reset-password-form"
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <Logo
          iconProps={{
            className: "max-w-20 mx-auto",
            fill: "#DB0000",
          }}
          variant="icon"
        />
        <div className="flex flex-col items-center gap-0 text-center">
          <h1 className="text-2xl font-bold">{languageData["Auth.ResetPasswordTitle"]}</h1>
          <p className="text-muted-foreground text-balance">{languageData["Auth.ResetPasswordMessage"]}</p>
        </div>
        {!defaultTenantId && (
          <TenantSelection
            isPending={isPending}
            languageData={languageData}
            onTenantChange={(tenantId) => {
              form.setValue("tenantId", tenantId);
            }}
            startTransition={startTransition}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem className="space-y-0.5">
              <FormLabel>{languageData["Auth.email.label"]}</FormLabel>
              <FormControl>
                <Input
                  data-testid="email-input"
                  placeholder={languageData["Auth.email.placeholder"]}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" data-testid="submit-button" disabled={isPending} type="submit">
          {languageData["Auth.resetPassword"]}
        </Button>
        <Button
          asChild
          className="w-full text-black"
          data-testid="signin-button"
          disabled={isPending}
          type="button"
          variant="link">
          <Link data-testid="signin-link" href={`${lang}/${signInPath}`}>
            {languageData["Auth.signIn"]}
          </Link>
        </Button>
      </form>
    </Form>
  );
}
