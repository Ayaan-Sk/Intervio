import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle, ChevronRight, ShieldCheck, PieChart, Users, Star, Bot } from 'lucide-react';

const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="bg-primary p-1.5 rounded-full">
        <Bot className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold">Intervio</span>
    </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          </nav>
          <Button asChild>
            <Link href="/app">Start Interview</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                    All-In-One AI
                    <br />
                    Interview Platform
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
                    Our platform blends advanced artificial intelligence with intuitive features to streamline your talent selection process, saving you time, effort, and resources.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                      <Link href="/app">Request Demo</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/app?tab=resume">Resume Analyze <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
            {/* Background decorative images */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full -z-10">
                <Image src="https://placehold.co/200x150.png" alt="Candidate thumbnail" data-ai-hint="man portrait" width={200} height={150} className="absolute top-1/2 left-24 rounded-2xl shadow-xl" />
                <Image src="https://placehold.co/200x150.png" alt="Candidate thumbnail 2" data-ai-hint="woman portrait" width={200} height={150} className="absolute top-20 right-24 rounded-2xl shadow-xl" />
                 <Image src="https://placehold.co/300x200.png" alt="UI element" data-ai-hint="UI element" width={300} height={200} className="absolute bottom-10 right-1/4 rounded-2xl shadow-2xl" />
            </div>
        </section>

        {/* Transforming Hiring Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming Hiring through Innovation</h2>
            <p className="max-w-3xl mx-auto text-muted-foreground mb-12">
              At Intervio, we're passionate about revolutionizing the hiring process for the modern era. We understand that traditional methods can be time-consuming and hinder the ability to truly identify the best talent.
            </p>
            <div className="relative max-w-4xl mx-auto mb-12">
              <Image src="/transforming-hiring.png" alt="Laptop showing interview software" data-ai-hint="laptop desk" width={1200} height={800} className="rounded-2xl shadow-2xl" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Unbiased Insights</h3>
                <p className="text-sm text-muted-foreground">Advanced algorithms provide data-grounded insights into each candidate's performance, free of human bias.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <PieChart className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Efficient Evaluation</h3>
                <p className="text-sm text-muted-foreground">Save time by identifying top candidates quickly, with automated analysis of technical skills, problem-solving abilities, and more.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Data-Driven Decisions</h3>
                <p className="text-sm text-muted-foreground">An integrated overview of all candidate performances allows you to choose the best candidates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Intervio Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Intervio?</h2>
              <p className="text-muted-foreground mb-6">
                Our platform has helped clients reduce hiring time by up to 40%, increased interview accuracy by 30%, and brought a 20% improvement in employee retention rates.
              </p>
              <Button variant="outline" asChild>
                <Link href="/app?tab=resume">Resume Analyze <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-primary text-primary-foreground p-6 text-center">
                <h4 className="text-3xl font-bold">100k+</h4>
                <p className="text-sm">Hours Saved</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-primary">Up to 40%</h4>
                <p className="text-sm text-muted-foreground">Reduce Hiring Time</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-primary">30%</h4>
                <p className="text-sm text-muted-foreground">Interview Accuracy</p>
              </Card>
              <Card className="p-6 text-center">
                <h4 className="text-3xl font-bold text-primary">20%</h4>
                <p className="text-sm text-muted-foreground">Employee Retention</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Revolutionize Your Hiring?</h2>
              <p className="opacity-80 mb-8">
                Streamline your hiring process with Intervio's powerful features. Access detailed performance metrics, identify top candidates, and make data-driven hiring decisions with unmatched accuracy and insights.
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" asChild>
                    <Link href="/app">Try for free</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <Link href="/app">Request Demo</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <Image src="/revolutionary-hiring.jpg" alt="Happy woman with headphones" data-ai-hint="woman headphones" width={500} height={500} className="rounded-full shadow-2xl object-cover w-[500px] h-[500px]" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Logo />
              <p className="mt-4 text-sm">
                An all-in-one AI interview platform to streamline the hiring process.
              </p>
            </div>
            <div className="col-span-1">
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div className="col-span-1">
                <h4 className="font-semibold text-white mb-4">Help</h4>
                 <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="hover:text-white">Customer Support</Link></li>
                    <li><Link href="#" className="hover:text-white">Delivery Details</Link></li>
                    <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
                    <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                 </ul>
            </div>
            <div className="col-span-1">
              <h4 className="font-semibold text-white mb-4">Join our newsletter</h4>
              <form className="flex gap-2">
                <Input type="email" placeholder="Enter your email address" className="bg-gray-800 border-gray-700 text-white" />
                <Button type="submit" className="bg-primary hover:bg-primary/90">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Intervio Inc. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
