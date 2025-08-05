import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {CheckCircle, Shield, Globe, FileText, ArrowRight, CreditCard, Smartphone} from "lucide-react";

export default function Page() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-red-50 via-white to-indigo-50">
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-100">
            ✈️ Welcome to Unirefund - Your VAT Refund Partner
          </Badge>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            Get Your <span className="text-red-600">VAT Refund</span> Easily
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
            Claim your tax refund from purchases made during your travels. Simple, secure, and fast processing for
            tourists visiting participating countries.
          </p>
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/evidence">
              <Button size="lg" className="w-full bg-red-600 px-8 py-3 text-lg hover:bg-red-700 sm:w-auto">
                Start VAT Refund Process
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/evidence/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-red-600 bg-transparent px-8 py-3 text-lg text-red-600 hover:bg-red-50 sm:w-auto">
                Already Have Account? Login
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              No Processing Fees
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              Quick Verification
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              Secure & Reliable
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">150K+</div>
              <div className="text-gray-600">Refunds Processed</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">€50M+</div>
              <div className="text-gray-600">Total Refunded</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">24h</div>
              <div className="text-gray-600">Average Processing</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">180+</div>
              <div className="text-gray-600">Countries Supported</div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-20" id="features">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">How Unirefund Works</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Get your VAT refund in 3 simple steps. Fast, secure, and reliable process for tourists.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Submit Your Documents</CardTitle>
                <CardDescription>
                  Upload your receipts and required documents through our secure platform. We support multiple formats
                  and ensure data protection.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Quick Verification</CardTitle>
                <CardDescription>
                  Our expert team verifies your documents and eligibility. Most applications are processed within 24
                  hours.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Receive Your Refund</CardTitle>
                <CardDescription>
                  Get your VAT refund directly to your bank account or credit card. Choose from multiple payment
                  methods.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Who Can Apply?</h2>
            <p className="text-xl text-gray-600">Check if you&apos;re eligible for VAT refund</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Non-EU Tourists</h3>
              <p className="text-gray-600">
                Visitors from outside the European Union who have made purchases during their stay.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Valid Documentation</h3>
              <p className="text-gray-600">
                Must have original receipts, passport, and boarding passes as proof of travel.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Minimum Purchase</h3>
              <p className="text-gray-600">
                Purchases must meet the minimum threshold required by the country&apos;s VAT refund policy.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-20" id="testimonials">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {Array.from({length: 5}).map((_, i) => (
                    <CheckCircle key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  &quot;Got my €250 VAT refund within 3 days! The process was so simple and the customer service was
                  excellent.&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Tourist from USA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {Array.from({length: 5}).map((_, i) => (
                    <CheckCircle key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  &quot;Professional service and fast processing. I received my refund for luxury shopping in Paris
                  without any hassle.&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-semibold">Mike Chen</div>
                    <div className="text-sm text-gray-500">Business Traveler</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {Array.from({length: 5}).map((_, i) => (
                    <CheckCircle key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  &quot;Unirefund made VAT refund so easy! Clear instructions and transparent process. Highly
                  recommended for travelers.&quot;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-semibold">Lisa Rodriguez</div>
                    <div className="text-sm text-gray-500">Frequent Traveler</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-red-600 px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">Ready to Claim Your VAT Refund?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-red-100">
            Start your VAT refund application now. Fast processing, secure platform, and dedicated support.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/evidence">
              <Button size="lg" className="w-full bg-white px-8 py-3 text-lg text-red-600 hover:bg-gray-100 sm:w-auto">
                Start Refund Process
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/evidence/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white bg-transparent px-8 py-3 text-lg text-white hover:bg-white hover:text-red-600 sm:w-auto">
                Login to Existing Account
              </Button>
            </Link>
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
              <p className="text-gray-400">The most trusted platform for VAT refund processing worldwide.</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>VAT Refund</li>
                <li>Tax Free Shopping</li>
                <li>Tourist Services</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Unirefund. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
