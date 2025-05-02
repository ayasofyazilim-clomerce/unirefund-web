"use client";

import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";
import {useParams} from "next/navigation";
import {getBaseLink} from "src/utils";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import SearchTransactionForm from "../_components/search-transaction-form";

export default function SearchTransactionClient({languageData}: {languageData: SSRServiceResource}) {
  // URL'den dil parametresini al
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 sm:gap-6">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
            {languageData.FindYourTransaction}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{languageData.SearchForYourTaxFreeRefunds}</p>
        </div>

        <Card className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md sm:p-6">
          <CardHeader className="w-full pt-0 text-center">
            <CardTitle className="text-lg font-semibold sm:text-xl">{languageData.EnterFormDetails}</CardTitle>
            <CardDescription>{languageData.ProvideYourTaxFreeFormInfo}</CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
            <SearchTransactionForm languageData={languageData} />
          </CardContent>
        </Card>
        <Link
          className="text-primary hover:text-primary/90 flex items-center justify-center gap-2 text-center text-sm font-medium"
          href={getBaseLink("home", lang)}>
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          {languageData.GoHomePage}
        </Link>
      </div>
    </div>
  );
}
