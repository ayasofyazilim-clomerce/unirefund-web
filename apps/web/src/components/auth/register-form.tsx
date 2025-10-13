"use client";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/sonner";
import {signUpServerApi} from "@repo/actions/core/AccountService/actions";
import {type z, zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {Logo} from "@repo/ui/logo";
import {createAuthSchemas, type LanguageData} from "./schema";
import {TenantSelection} from "./tenant";

export function RegisterForm({
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
  const {lang} = useParams<{lang: string}>();

  const {registerSchema} = createAuthSchemas({languageData, defaultTenantId});
  const form = useForm<z.infer<typeof registerSchema>>({resolver: zodResolver(registerSchema)});
  function onSubmit(data: z.infer<typeof registerSchema>) {
    startTransition(() => {
      void signUpServerApi(data).then((response) => {
        if (response.type !== "success") {
          toast.error(response.message);
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
        data-testid="register-form"
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <Logo
          iconProps={{
            className: "max-w-20 mx-auto",
            fill: "#DB0000",
          }}
          variant="icon"
        />
        <div className="flex flex-col items-center gap-0 text-center">
          <h1 className="text-2xl font-bold">{languageData["Auth.RegisterTitle"]}</h1>
          <p className="text-muted-foreground text-balance">{languageData["Auth.RegisterMessage"]}</p>
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
        <FormField
          control={form.control}
          name="userName"
          render={({field}) => (
            <FormItem className="space-y-0.5">
              <FormLabel>{languageData["Auth.userName.label"]}</FormLabel>
              <FormControl>
                <Input
                  data-testid="userName-input"
                  placeholder={languageData["Auth.userName.placeholder"]}
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
          {languageData["Auth.signUp"]}
        </Button>
        <p className="text-muted-foreground !mt-10 text-center text-sm">
          {languageData["Auth.alreadyHaveAnAccount"]}{" "}
          <Link className="underline" data-testid="signin-link" href={signInPath}>
            {languageData["Auth.signIn"]}
          </Link>
        </p>
      </form>
    </Form>
  );
}
