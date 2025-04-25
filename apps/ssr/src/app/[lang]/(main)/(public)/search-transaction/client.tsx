"use client";

import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";
import {useParams} from "next/navigation";
import {getResourceDataClient} from "src/language-data/core/Default";
import {getBaseLink} from "src/utils";
import SearchTransactionForm from "../_components/search-transaction-form";

export default function SearchTransactionClient() {
  // URL'den dil parametresini al
  const params = useParams();
  const lang = params.lang as string;

  // Dil kaynaklarını istemci tarafında al
  const languageData = getResourceDataClient(lang);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 ">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {languageData.FindYourTransaction || "Find Your Transaction"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {languageData.SearchForYourTaxFreeRefunds || "Search for your tax-free refunds using your form details"}
          </p>
        </div>

        <Card className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
          <CardHeader className="w-full pt-0 text-center">
            <CardTitle className="text-xl font-semibold">
              {languageData.EnterFormDetails || "Enter Form Details"}
            </CardTitle>
            <CardDescription>
              {languageData.ProvideYourTaxFreeFormInfo || "Provide your tax free form information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
            <SearchTransactionForm />
          </CardContent>
        </Card>
        <Link
          className="text-primary hover:text-primary/90 flex items-center justify-center gap-2 text-center text-sm font-medium"
          href={getBaseLink("home", lang)}>
          <ArrowLeft className="h-5 w-5" />
          {languageData.GoHomePage || "Go Home Page"}
        </Link>
      </div>
    </div>
  );
}
