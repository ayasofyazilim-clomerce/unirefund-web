"use client";

import {Card} from "@repo/ayasofyazilim-ui/atoms/card";
import type {TagListResponseDto_TagListItemDto} from "@repo/saas/TagService";
import type {ServerResponse} from "@repo/utils/api";
import {useSession} from "@repo/utils/auth";
import {LandPlot, MapPin, Store, User, Users} from "lucide-react";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";
import TagsTable from "./components/tags-table";

interface HomePageClientProps {
  languageData: SSRServiceResource;
  tagsResponse: ServerResponse<TagListResponseDto_TagListItemDto>;
}

export default function HomePageClient({languageData, tagsResponse}: HomePageClientProps) {
  const {session} = useSession();

  const userName = session?.user?.userName || "User";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Welcome Section */}
      <div className="relative mb-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              {languageData["Home.Welcome"]},
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-600">
            {languageData["Home.ManageAllInOnePlace"]}
          </p>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="mb-16 grid gap-8 md:grid-cols-2">
        <QuickActionCard
          description={languageData["Home.ExploreTaxFreeDesc"]}
          href="explore"
          icon={<MapPin className="h-12 w-12" />}
          primary
          title={languageData["Home.ExploreTaxFree"]}
        />
        <QuickActionCard
          description={languageData["Home.ProfileDesc"]}
          href="profile"
          icon={<User className="h-12 w-12" />}
          primary
          title={languageData["Home.Profile"]}
        />
      </div>

      {/* Tags Section */}
      <div className="mb-16">
        <TagsTable languageData={languageData} tagsResponse={tagsResponse} />
      </div>

      {/* Tax-Free Services Section */}
      <Card className="border border-gray-200 bg-white shadow-lg">
        <div className="p-8 lg:p-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              {languageData["Home.OurTaxFreeServices"]}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">{languageData["Home.OurTaxFreeServicesDesc"]}</p>
          </div>

          <div className="mb-8 grid items-stretch gap-8 md:grid-cols-3">
            <ServiceCard
              description={languageData["Home.RetailersDesc"]}
              features={[
                languageData["Home.PaymentSolutions"],
                languageData["Home.StreamlinedProcesses"],
                languageData["Home.InternationalSupport"],
              ]}
              icon={<Store className="h-10 w-10" />}
              languageData={languageData}
              link="https://unirefund.com/en/retailers"
              title={languageData["Home.Retailers"]}
            />
            <ServiceCard
              description={languageData["Home.ShoppersDesc"]}
              features={[
                languageData["Home.FastVATRefunds"],
                languageData["Home.MobileScanning"],
                languageData["Home.48HProcessing"],
              ]}
              icon={<Users className="h-10 w-10" />}
              languageData={languageData}
              link="https://unirefund.com/en/shoppers"
              title={languageData["Home.Shoppers"]}
            />
            <ServiceCard
              description={languageData["Home.StatesDesc"]}
              features={[
                languageData["Home.GovernmentPartnerships"],
                languageData["Home.ComplianceSolutions"],
                languageData["Home.RegulatorySupport"],
              ]}
              icon={<LandPlot className="h-10 w-10" />}
              languageData={languageData}
              link="https://unirefund.com/en/states"
              title={languageData["Home.States"]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link href={getBaseLink(href)}>
      <Card
        className={`group relative h-full overflow-hidden border-0 transition-all duration-500 hover:scale-105 ${
          primary
            ? "bg-gradient-to-br from-red-600 via-red-500 to-red-700 shadow-2xl shadow-red-500/25"
            : "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 hover:shadow-2xl hover:shadow-slate-500/25"
        }`}>
        <div className="bg-grid-white/[0.02] bg-grid-pattern absolute inset-0" />
        {primary ? (
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-bl from-white/20 to-transparent blur-2xl" />
        ) : null}

        <div className="relative p-8 text-center">
          <div
            className={`mb-6 flex transform justify-center transition-transform duration-300 group-hover:scale-110 ${
              primary ? "text-white" : "text-gray-300"
            }`}>
            <div
              className={`rounded-2xl p-4 ${
                primary
                  ? "bg-white/20 shadow-lg backdrop-blur-sm"
                  : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
              }`}>
              {icon}
            </div>
          </div>
          <h3 className={`mb-4 text-xl font-bold ${primary ? "text-white" : "text-white"}`}>{title}</h3>
          <p className={`text-sm leading-relaxed ${primary ? "text-red-100" : "text-gray-300"}`}>{description}</p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Card>
    </Link>
  );
}

function ServiceCard({
  title,
  description,
  icon,
  link,
  features,
  languageData,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  features: string[];
  languageData: SSRServiceResource;
}) {
  return (
    <div className="group relative h-full">
      <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="mb-6 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-red-50 to-red-100 text-red-600">
            {icon}
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900">{title}</h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">{description}</p>
        </div>

        <div className="mb-8 flex min-h-[120px] flex-1 flex-col justify-start space-y-3">
          {features.map((feature, featureIndex) => (
            <div className="flex items-center text-sm text-gray-700" key={`feature-${featureIndex}`}>
              <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-auto text-center">
          <a
            className="inline-flex items-center rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
            href={link}
            rel="noopener noreferrer"
            target="_blank">
            {languageData["Home.LearnMore"]}
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
