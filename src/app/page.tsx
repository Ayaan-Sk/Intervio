
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bot } from 'lucide-react';
import { AuthState } from '@/components/auth-state';

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
          <AuthState />
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
                      <Link href="/signup">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/app?tab=resume">Resume Analyze <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
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
              <img src="/transforming-hiring.png" alt="Laptop showing interview software" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">How Intervio Works</h2>
            <div className="space-y-24">

              {/* Step 1: Text | Image */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-bold text-3xl mb-4">🎯 1. Choose Your Topic</h3>
                  <p className="text-muted-foreground text-lg">Select a technical or behavioral topic like Java, Python, C++, etc. to tailor the interview to the specific role you're hiring for.</p>
                </div>
                <div>
                  <img src="/how-it-works-1.png" alt="Choose Your Topic" data-ai-hint="selecting topic" className="rounded-xl shadow-2xl" />
                </div>
              </div>

              {/* Step 2: Image | Text */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="md:order-2">
                  <h3 className="font-bold text-3xl mb-4">🎤 2. Speak With AI – Live Interview Starts</h3>
                  <p className="text-muted-foreground text-lg">The AI voice assistant asks questions, listens to your spoken answers, and adapts in real-time, creating a natural and engaging interview experience.</p>
                </div>
                <div className="md:order-1">
                  <img src="/how-it-works-2.png" alt="Speak With AI" data-ai-hint="voice interface" className="rounded-xl shadow-2xl" />
                </div>
              </div>

              {/* Step 3: Text | Image */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-bold text-3xl mb-4">📊 3. Get Instant Feedback & ATS Score</h3>
                  <p className="text-muted-foreground text-lg">At the end, receive an analyzed report showing correct answers, improvement areas, and your ATS compatibility score to make data-driven decisions.</p>
                </div>
                <div>
                  <img src="/how-it-works-3.png" alt="Get Feedback" data-ai-hint="dashboard report" className="rounded-xl shadow-2xl" />
                </div>
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
                    <Link href="/signup">Try for free</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <Link href="/app">Request Demo</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="/revolutionary-hiring.jpg" alt="Happy woman with headphones" className="rounded-full shadow-2xl object-cover w-[500px] h-[500px]" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <p className="mt-4 max-w-lg text-sm">
              An all-in-one AI interview platform to streamline the hiring process.
            </p>
            <div className="mt-8 w-full border-t border-gray-800 pt-6">
              <p className="text-sm">Made by Final Year Students CSE</p>
              <p className="mt-2 text-xs text-gray-500">&copy; {new Date().getFullYear()} Intervio Inc. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
