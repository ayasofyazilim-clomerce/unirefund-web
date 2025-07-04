import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {CheckCircle, Shield, Zap, Globe, Star, ArrowRight, Calculator, TrendingUp} from "lucide-react";

export default function Page() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-red-50 via-white to-rose-50">
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-100">
            🎉 Limited Time: 50% Less Fee First Year
          </Badge>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            Shop <span className="text-red-600">Tax-Free</span> and Save More
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-gray-600">
            Access thousands of premium products without paying sales tax. Save up to 15% on every purchase with our
            verified tax-free shopping platform.
          </p>
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-red-600 px-8 py-3 text-lg hover:bg-red-700">
              Start Shopping Tax-Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent px-8 py-3 text-lg">
              View Demo
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              No Hidden Fees
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              Instant Verification
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-red-600" />
              100% Legal
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">$2.5M+</div>
              <div className="text-gray-600">Tax Savings Generated</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">15%</div>
              <div className="text-gray-600">Average Savings</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-red-600">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Why Choose Unirefund?</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Our platform makes tax-free shopping simple, secure, and completely legal.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>100% Legal & Compliant</CardTitle>
                <CardDescription>
                  All transactions are fully compliant with state and federal tax laws. Shop with confidence knowing
                  everything is legitimate.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Instant Verification</CardTitle>
                <CardDescription>
                  Get verified for tax-free shopping in under 2 minutes. Our automated system processes applications
                  instantly.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Nationwide Coverage</CardTitle>
                <CardDescription>
                  Access tax-free shopping across all 50 states. Our network includes thousands of verified retailers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Sign Up & Verify</h3>
              <p className="text-gray-600">
                Create your account and complete our quick verification process in under 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Browse & Shop</h3>
              <p className="text-gray-600">
                Browse thousands of products from verified retailers and add items to your cart.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Save Money</h3>
              <p className="text-gray-600">Checkout tax-free and enjoy instant savings on every purchase you make.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="testimonials" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  "Saved over $500 in my first month! The verification process was super quick and the savings are
                  real."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Small Business Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  "Finally, a legitimate way to shop tax-free! The platform is easy to use and customer service is
                  excellent."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="font-semibold">Mike Chen</div>
                    <div className="text-sm text-gray-500">Entrepreneur</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">
                  "The savings add up quickly! I've saved thousands on business equipment purchases. Highly
                  recommended."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="font-semibold">Lisa Rodriguez</div>
                    <div className="text-sm text-gray-500">Consultant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id="pricing" className="bg-gray-50 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="mt-4 text-4xl font-bold text-gray-900">
                  $9<span className="text-lg text-gray-500">/mo</span>
                </div>
                <CardDescription>Perfect for individuals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Up to $1,000 monthly purchases
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Basic verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Email support
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-transparent" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            <Card className="relative border-2 border-red-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                <Badge className="bg-red-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4 text-4xl font-bold text-gray-900">
                  $29<span className="text-lg text-gray-500">/mo</span>
                </div>
                <CardDescription>Best for small businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Up to $10,000 monthly purchases
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Priority verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Phone & email support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Advanced analytics
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-red-600 hover:bg-red-700">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4 text-4xl font-bold text-gray-900">
                  $99<span className="text-lg text-gray-500">/mo</span>
                </div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Unlimited purchases
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Instant verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    24/7 dedicated support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-red-600" />
                    Custom integrations
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-red-600 px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">Ready to Start Saving?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-red-100">
            Join thousands of smart shoppers who are already saving money with tax-free purchases.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-white px-8 py-3 text-lg text-red-600 hover:bg-gray-100">
              Start Your Free Trial
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white bg-transparent px-8 py-3 text-lg text-white hover:bg-white hover:text-red-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 px-4 py-12 text-white">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Unirefund</span>
              </div>
              <p className="text-gray-400">The most trusted platform for legal tax-free shopping.</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Legal
                  </a>
                </li>
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
