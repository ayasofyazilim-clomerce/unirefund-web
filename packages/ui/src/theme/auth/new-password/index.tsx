"use client";

import {useTransition} from "react";

import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@repo/ayasofyazilim-ui/atoms/form";
import {toast} from "@repo/ayasofyazilim-ui/atoms/sonner";
import {z, zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {PasswordInput} from "@repo/ayasofyazilim-ui/molecules/password-input";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FormProvider, useForm} from "react-hook-form";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export interface ResetPasswordCredentials {
  tenantId: string;
  userId: string;
  password: string;
  resetToken: string;
}

export default function NewPasswordForm({
  languageData,
  tenantId,
  userId,
  resetToken,
  onSubmitAction,
}: {
  languageData: {
    Login: string;
    ResetPassword: string;
    Tenant: string;
  };
  tenantId: string;
  userId: string;
  resetToken: string;
  onSubmitAction: (values: ResetPasswordCredentials) => Promise<{
    type: "success" | "error" | "api-error";
    message?: string;
  }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      onSubmitAction({
        tenantId: tenantId,
        userId: userId,
        resetToken: resetToken,
        password: values.password,
      }).then((response) => {
        if (response.type !== "success") {
          toast.error(response?.message);
          return;
        }
        toast.success("Password reset successfully");
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
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="*******" type="password" autoComplete="true" {...field} />
                  </FormControl>
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
