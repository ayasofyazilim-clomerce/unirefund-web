"use client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getPaymentMethodRequirementsApi, type ApiMethod} from "@repo/actions/unirefund/RefundService/actions";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import wiseCurrencies from "@/data/wise-currencies.json";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import PaymentForm from "./_components/payment-form";

type PaymentMethodOption = {
  value: string;
  label: string;
  description: string;
  icon: string;
};

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: "bank_account",
    label: "PaymentMethods.BankAccount.Label",
    description: "PaymentMethods.BankAccount.Description",
    icon: "🏦",
  },
  {
    value: "credit_card",
    label: "PaymentMethods.CreditCard.Label",
    description: "PaymentMethods.CreditCard.Description",
    icon: "💳",
  },
  {
    value: "paypal",
    label: "PaymentMethods.PayPal.Label",
    description: "PaymentMethods.PayPal.Description",
    icon: "🟦",
  },
  {
    value: "wechat",
    label: "PaymentMethods.WeChat.Label",
    description: "PaymentMethods.WeChat.Description",
    icon: "💬",
  },
];

type WiseApiResponse = {
  ok: boolean;
  status: number;
  data: ApiMethod[];
  error?: string | {message: string};
};

export default function PaymentMethodsClient(languageData: SSRServiceResource) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [currencyId, setCurrencyId] = useState<string>("");
  const [methodType, setMethodType] = useState<string>("");
  const [availableMethods, setAvailableMethods] = useState<ApiMethod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const selectedMethod = useMemo(
    () => availableMethods.find((m) => m.type === methodType) || null,
    [availableMethods, methodType],
  );

  const fetchRequirements = useCallback(async () => {
    if (!paymentMethod || !currencyId) return;

    setError(null);

    const response: WiseApiResponse = await getPaymentMethodRequirementsApi(paymentMethod);

    if (!response.ok) {
      let msg = `Error ${response.status}`;
      if (response.error === "authentication_required") {
        msg = "Lütfen önce giriş yapın.";
      } else if (typeof response.error === "string") {
        msg = response.error;
      } else if (response.error && typeof response.error === "object" && "message" in response.error) {
        msg = response.error.message;
      }
      throw new Error(msg);
    }

    const data = response.data;
    setAvailableMethods(data);
    setMethodType(data.length > 0 ? data[0].type : "");
  }, [paymentMethod, currencyId]);

  useEffect(() => {
    if (paymentMethod && currencyId) {
      void fetchRequirements();
    } else {
      setAvailableMethods([]);
      setMethodType("");
    }
  }, [fetchRequirements, paymentMethod, currencyId]);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    setCurrencyId("");
    setMethodType("");
    setAvailableMethods([]);
    // Scroll to Step 2 after short delay (wait for render)
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({behavior: "smooth", block: "start"});
    }, 100);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrencyId(value);
    // Scroll to Step 3 after short delay
    setTimeout(() => {
      step3Ref.current?.scrollIntoView({behavior: "smooth", block: "start"});
    }, 100);
  };

  const handleMethodTypeChange = (value: string) => {
    setMethodType(value);
    // Scroll to Step 4 after short delay
    setTimeout(() => {
      step4Ref.current?.scrollIntoView({behavior: "smooth", block: "start"});
    }, 100);
  };

  const requiresCurrency = useMemo(() => paymentMethod !== "", [paymentMethod]);

  return (
    <div className="mx-auto space-y-8 p-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{languageData["PaymentMethods.Title"]}</h1>
        <p className="mt-2 text-gray-600">{languageData["PaymentMethods.Subtitle"]}</p>
      </div>

      {/* Step 1: Payment Method Selection */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{languageData["PaymentMethods.Step1.Title"]}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PAYMENT_METHODS.map((method) => (
            <button
              className={`rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                paymentMethod === method.value
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              key={method.value}
              onClick={() => {
                handlePaymentMethodChange(method.value);
              }}>
              <div className="mb-2 text-2xl">{method.icon}</div>
              <h3 className="mb-1 font-semibold text-gray-900">
                {(languageData as Record<string, string>)[method.label]}
              </h3>
              <p className="text-sm text-gray-600">{(languageData as Record<string, string>)[method.description]}</p>
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-4 ${paymentMethod && currencyId ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {/* Step 2: Currency Selection */}
        {paymentMethod && requiresCurrency ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6" ref={step2Ref}>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">{languageData["PaymentMethods.Step2.Title"]}</h2>
            <div className="max-w-md">
              <Select onValueChange={handleCurrencyChange} value={currencyId}>
                <SelectTrigger className="h-12 w-full rounded-lg border border-gray-300 px-4 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200">
                  <SelectValue placeholder={languageData["PaymentMethods.CurrencyPlaceholder"]} />
                </SelectTrigger>
                <SelectContent>
                  {wiseCurrencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        {/* Step 3: Method Type Selection */}
        {paymentMethod && currencyId ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6" ref={step3Ref}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{languageData["PaymentMethods.Step3.Title"]}</h2>
            </div>

            {error ? (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                <p>{error}</p>
              </div>
            ) : null}

            {availableMethods.length > 0 && (
              <div className="space-y-3">
                {availableMethods.map((method) => (
                  <button
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                      methodType === method.type
                        ? "border-red-500 bg-red-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    key={method.type}
                    onClick={() => {
                      handleMethodTypeChange(method.type);
                    }}>
                    <h3 className="font-semibold text-gray-900">
                      {(languageData as Record<string, string>)[method.title] || method.title}
                    </h3>
                    {method.usageInfo ? (
                      <p className="mt-1 text-sm text-gray-600">
                        {(languageData as Record<string, string>)[method.usageInfo] || method.usageInfo}
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Step 4: Form */}
      {selectedMethod && methodType ? (
        <div ref={step4Ref}>
          <PaymentForm languageData={languageData} method={selectedMethod} />
        </div>
      ) : null}
    </div>
  );
}
