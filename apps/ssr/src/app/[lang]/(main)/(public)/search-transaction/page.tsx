import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import SearchTransactionForm from "../_components/search-transaction-form";

export default function SearchTransaction() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 ">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Find Your Transaction</h1>
          <p className="mt-2 text-sm text-gray-600">Search for your tax-free refunds using your form details</p>
        </div>

        <Card className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
          <CardHeader className="w-full pt-0 text-center">
            <CardTitle className="text-xl font-semibold">Enter Form Details</CardTitle>
            <CardDescription>Provide your tax free form information</CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
            <SearchTransactionForm />
          </CardContent>
        </Card>
        <Link
          className="text-primary hover:text-primary/90 flex items-center justify-center gap-2 text-center text-sm font-medium"
          href="/home">
          <ArrowLeft className="h-5 w-5" />
          Go Home Page
        </Link>
      </div>
    </div>
  );
}
