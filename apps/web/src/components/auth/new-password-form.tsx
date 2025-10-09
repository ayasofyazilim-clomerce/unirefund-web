"use client";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/sonner";
import {resetPasswordApi} from "@repo/actions/core/AccountService/actions";
import {type z, zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {LanguageData} from "./schema";
import {createAuthSchemas} from "./schema";

export function NewPasswordForm({
  languageData,
  defaultTenantId,
  signInPath = "login",
}: {
  languageData: LanguageData;
  defaultTenantId: string | undefined;
  signInPath?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams<{lang: string; userId: string; resetToken: string}>();

  const {newPasswordSchema} = createAuthSchemas({languageData, defaultTenantId});
  const form = useForm<z.infer<typeof newPasswordSchema>>({resolver: zodResolver(newPasswordSchema)});
  function onSubmit(data: z.infer<typeof newPasswordSchema>) {
    startTransition(() => {
      void resetPasswordApi({
        ...data,
        ...params,
      }).then((response) => {
        if (response.type !== "success") {
          toast.error(response.message);
          return;
        }
        toast.success("Password reset successfully");
        router.replace(`/${params.lang}/${signInPath}${location.search}`);
      });
    });
  }

  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        data-testid="new-password-form"
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div className="flex flex-col items-center gap-0 text-center">
          <h1 className="text-2xl font-bold">{languageData["Auth.NewPasswordTitle"]}</h1>
          <p className="text-muted-foreground text-balance">{languageData["Auth.NewPasswordMessage"]}</p>
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem className="space-y-0.5">
              <FormLabel>{languageData["Auth.password.label"]}</FormLabel>
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
          {languageData["Auth.newPassword"]}
        </Button>
        <Button
          asChild
          className="w-full text-black"
          data-testid="signin-button"
          disabled={isPending}
          type="button"
          variant="link">
          <Link data-testid="signin-link" href={`${params.lang}/${signInPath}`}>
            {languageData["Auth.signIn"]}
          </Link>
        </Button>
      </form>
    </Form>
  );
}
