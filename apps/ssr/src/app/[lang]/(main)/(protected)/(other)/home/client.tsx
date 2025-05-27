"use client";

import {Card} from "@repo/ayasofyazilim-ui/atoms/card";
import {CircleDollarSign, FileUp, Clock, Store, PlusCircle, HelpCircle, BookOpen, Bell} from "lucide-react";
import Link from "next/link";
import {useSession} from "@repo/utils/auth";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";

interface HomePageClientProps {
  languageData: SSRServiceResource;
}

export default function HomePageClient({languageData}: HomePageClientProps) {
  const {session} = useSession();

  // In a real app, you would get this from your user context/session
  const userName = session?.user?.userName;
  const recentActivities = [
    {
      id: 1,
      title: languageData["Home.RefundRequestSubmitted"],
      description: "H&M Store - €150",
      time: languageData["Home.TwoHoursAgo"],
    },
    {
      id: 2,
      title: languageData["Home.DocumentUploaded"],
      description: languageData["Home.ReceiptForZaraPurchase"],
      time: languageData["Home.OneDayAgo"],
    },
    {
      id: 3,
      title: languageData["Home.RefundApproved"],
      description: "Nike Store - €200",
      time: languageData["Home.ThreeDaysAgo"],
    },
  ];

  return (
    <div className="mx-auto py-4 md:container md:py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {languageData["Home.Welcome"]}, <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-muted-foreground mt-2">{languageData["Home.ManageAllInOnePlace"]}</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          description={languageData["Home.StartNewRefundDesc"]}
          href="/refunds/new"
          icon={<PlusCircle className="h-8 w-8" />}
          title={languageData["Home.StartNewRefund"]}
        />
        <QuickActionCard
          description={languageData["Home.UploadDocumentDesc"]}
          href="/documents/upload"
          icon={<FileUp className="h-8 w-8" />}
          title={languageData["Home.UploadDocument"]}
        />
        <QuickActionCard
          description={languageData["Home.TrackRefundsDesc"]}
          href="/refunds"
          icon={<CircleDollarSign className="h-8 w-8" />}
          title={languageData["Home.TrackRefunds"]}
        />
        <QuickActionCard
          description={languageData["Home.FindTaxFreeShopsDesc"]}
          href="/shops"
          icon={<Store className="h-8 w-8" />}
          title={languageData["Home.FindTaxFreeShops"]}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-2">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Clock className="h-5 w-5" />
                {languageData["Home.RecentActivity"]}
              </h2>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  key={activity.id}>
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-muted-foreground text-sm">{activity.description}</p>
                  </div>
                  <span className="text-muted-foreground text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Helpful Guides Section */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <HelpCircle className="h-5 w-5" />
              {languageData["Home.HelpfulGuides"]}
            </h2>
            <div className="space-y-4">
              <Link
                className="hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors"
                href="/guide/how-it-works">
                <BookOpen className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">{languageData["Home.HowItWorks"]}</h3>
                  <p className="text-muted-foreground text-sm">{languageData["Home.HowItWorksDesc"]}</p>
                </div>
              </Link>
              <Link
                className="hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors"
                href="/guide/faq">
                <HelpCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">{languageData["Home.FAQ"]}</h3>
                  <p className="text-muted-foreground text-sm">{languageData["Home.FAQDesc"]}</p>
                </div>
              </Link>
              <Link
                className="hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors"
                href="/guide/tips">
                <Bell className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">{languageData["Home.TaxFreeTips"]}</h3>
                  <p className="text-muted-foreground text-sm">{languageData["Home.TaxFreeTipsDesc"]}</p>
                </div>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Promotions Banner */}
      <Card className="border-red-200 bg-gradient-to-r from-red-500/10 to-red-500/5">
        <div className="p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-700">{languageData["Home.SpecialPromotion"]}</h2>
          <p className="text-red-600">{languageData["Home.SpecialPromotionDesc"]}</p>
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
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <div className="p-6">
          <div className="text-primary mb-4">{icon}</div>
          <h3 className="mb-2 font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </Card>
    </Link>
  );
}
