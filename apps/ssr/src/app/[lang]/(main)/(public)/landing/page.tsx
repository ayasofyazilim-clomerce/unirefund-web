import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {CheckCircle, Shield, Globe, FileText, ArrowRight, CreditCard, Smartphone} from "lucide-react";
import {auth} from "@repo/utils/auth/next-auth";
import {redirect} from "next/navigation";
import {getResourceData} from "@/language-data/unirefund/SSRService";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const session = await auth();
  if (session) {
    redirect(`/${lang}/home`);
  }

  const {languageData} = await getResourceData(lang);
  return (
    <div className="h-full w-full bg-gradient-to-br from-red-50 via-white to-indigo-50">
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-100">
            {languageData["Landing.WelcomeBadge"]}
          </Badge>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            {languageData["Landing.MainTitle"]}{" "}
            <span className="text-red-600">{languageData["Landing.MainTitleHighlight"]}</span>{" "}
            {languageData["Landing.MainTitleEnd"]}
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
            {languageData["Landing.MainDescription"]}
          </p>
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/evidence-new">
              <Button className="w-full bg-red-600 px-8 py-3 text-lg hover:bg-red-700 sm:w-auto" size="lg">
                {languageData["Landing.StartRefundProcess"]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* <Link href="/evidence/login">
              <Button
                className="w-full border-red-600 bg-transparent px-8 py-3 text-lg text-red-600 hover:bg-red-50 sm:w-auto"
                size="lg"
                variant="outline">
                {languageData["Landing.AlreadyHaveAccount"]}
              </Button>
            </Link> */}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              {languageData["Landing.NoProcessingFees"]}
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              {languageData["Landing.QuickVerification"]}
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              {languageData["Landing.SecureReliable"]}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">150K+</div>
              <div className="text-gray-600">{languageData["Landing.RefundsProcessed"]}</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">€50M+</div>
              <div className="text-gray-600">{languageData["Landing.TotalRefunded"]}</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">24h</div>
              <div className="text-gray-600">{languageData["Landing.AverageProcessing"]}</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">180+</div>
              <div className="text-gray-600">{languageData["Landing.CountriesSupported"]}</div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-20" id="features">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">{languageData["Landing.HowItWorks"]}</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">{languageData["Landing.HowItWorksDescription"]}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>{languageData["Landing.SubmitDocuments"]}</CardTitle>
                <CardDescription>{languageData["Landing.SubmitDocumentsDescription"]}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>{languageData["Landing.QuickVerificationTitle"]}</CardTitle>
                <CardDescription>{languageData["Landing.QuickVerificationDescription"]}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>{languageData["Landing.ReceiveRefund"]}</CardTitle>
                <CardDescription>{languageData["Landing.ReceiveRefundDescription"]}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">{languageData["Landing.WhoCanApply"]}</h2>
            <p className="text-xl text-gray-600">{languageData["Landing.WhoCanApplyDescription"]}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{languageData["Landing.NonEUTourists"]}</h3>
              <p className="text-gray-600">{languageData["Landing.NonEUTouristsDescription"]}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{languageData["Landing.ValidDocumentation"]}</h3>
              <p className="text-gray-600">{languageData["Landing.ValidDocumentationDescription"]}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{languageData["Landing.MinimumPurchase"]}</h3>
              <p className="text-gray-600">{languageData["Landing.MinimumPurchaseDescription"]}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-20" id="testimonials">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">{languageData["Landing.WhatCustomersSay"]}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {Array.from({length: 5}).map((_, i) => (
                    <CheckCircle className="h-5 w-5 text-yellow-400" key={i} />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">&quot;{languageData["Landing.Testimonial1"]}&quot;</p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-semibold">{languageData["Landing.TestimonialAuthor1"]}</div>
                    <div className="text-sm text-gray-500">{languageData["Landing.TestimonialRole1"]}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {Array.from({length: 5}).map((_, i) => (
                    <CheckCircle className="h-5 w-5 text-yellow-400" key={i} />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">&quot;{languageData["Landing.Testimonial2"]}&quot;</p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-semibold">{languageData["Landing.TestimonialAuthor2"]}</div>
                    <div className="text-sm text-gray-500">{languageData["Landing.TestimonialRole2"]}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {Array.from({length: 5}).map((_, i) => (
                    <CheckCircle className="h-5 w-5 text-yellow-400" key={i} />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">&quot;{languageData["Landing.Testimonial3"]}&quot;</p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-semibold">{languageData["Landing.TestimonialAuthor3"]}</div>
                    <div className="text-sm text-gray-500">{languageData["Landing.TestimonialRole3"]}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-red-600 px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">{languageData["Landing.ReadyToClaim"]}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-red-100">
            {languageData["Landing.ReadyToClaimDescription"]}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/evidence/register">
              <Button className="w-full bg-white px-8 py-3 text-lg text-red-600 hover:bg-gray-100 sm:w-auto" size="lg">
                {languageData["Landing.StartRefund"]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* <Link href="/evidence/login">
              <Button
                className="w-full border-white bg-transparent px-8 py-3 text-lg text-white hover:bg-white hover:text-red-600 sm:w-auto"
                size="lg"
                variant="outline">
                {languageData["Landing.LoginToAccount"]}
              </Button>
            </Link> */}
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 px-4 py-12 text-white">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Unirefund</span>
              </div>
              <p className="text-gray-400">{languageData["Landing.Footer.Description"]}</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">{languageData["Landing.Footer.Services"]}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{languageData["Landing.Footer.VATRefund"]}</li>
                <li>{languageData["Landing.Footer.TaxFreeShopping"]}</li>
                <li>{languageData["Landing.Footer.TouristServices"]}</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">{languageData["Landing.Footer.Support"]}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{languageData["Landing.Footer.HelpCenter"]}</li>
                <li>{languageData["Landing.Footer.ContactUs"]}</li>
                <li>{languageData["Landing.Footer.FAQ"]}</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">{languageData["Landing.Footer.Legal"]}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{languageData["Landing.Footer.PrivacyPolicy"]}</li>
                <li>{languageData["Landing.Footer.TermsOfService"]}</li>
                <li>{languageData["Landing.Footer.CookiePolicy"]}</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{languageData["Landing.Footer.Copyright"]}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
