
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bot, CheckCircle } from 'lucide-react';
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
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container mx-auto px-4 text-center relative">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 font-headline">
                    The Ultimate AI Platform
                    <br />
                    for Interview Success
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
                    Master your interviews with AI-driven practice, instant feedback, and resume analysis. Land your dream job faster.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="font-semibold" asChild>
                      <Link href="/signup">Get Started for Free</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/app?tab=resume">Try Resume Analyzer <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-20 font-headline">How Intervio Works</h2>
            <div className="space-y-24">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-bold text-3xl mb-4 font-headline text-primary">🎯 1. Choose Your Topic</h3>
                  <p className="text-muted-foreground text-lg">Select a technical or behavioral topic like Java, Python, C++, etc. to tailor the interview to the specific role you're applying for.</p>
                </div>
                <div>
                  <img src="https://picsum.photos/600/400" alt="Choose Your Topic" data-ai-hint="selecting topic" className="rounded-xl shadow-2xl" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="md:order-2">
                  <h3 className="font-bold text-3xl mb-4 font-headline text-primary">🎤 2. Speak With AI</h3>
                  <p className="text-muted-foreground text-lg">The AI voice assistant asks questions and listens to your spoken answers, creating a natural and engaging real-time interview experience.</p>
                </div>
                <div className="md:order-1">
                  <img src="https://picsum.photos/600/400" alt="Speak With AI" data-ai-hint="voice interface" className="rounded-xl shadow-2xl" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-bold text-3xl mb-4 font-headline text-primary">📊 3. Get Instant Feedback</h3>
                  <p className="text-muted-foreground text-lg">Receive an instant report detailing your performance, improvement areas, and an ATS compatibility score to help you make data-driven improvements.</p>
                </div>
                <div>
                  <img src="https://picsum.photos/600/400" alt="Get Feedback" data-ai-hint="dashboard report" className="rounded-xl shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Intervio Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Why Choose Intervio?</h2>
              <ul className="space-y-4 text-muted-foreground text-lg">
                  <li className="flex items-center gap-3"><CheckCircle className="text-primary w-6 h-6"/><span>Reduce hiring time by up to 40%</span></li>
                  <li className="flex items-center gap-3"><CheckCircle className="text-primary w-6 h-6"/><span>Increase interview accuracy by 30%</span></li>
                  <li className="flex items-center gap-3"><CheckCircle className="text-primary w-6 h-6"/><span>Improve employee retention by 20%</span></li>
              </ul>
              <Button variant="outline" asChild className="mt-8">
                <Link href="/app?tab=resume">Analyze Your Resume <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div>
              <img src="https://picsum.photos/600/500" alt="Feature illustration" data-ai-hint="happy developer" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Ready to Revolutionize Your Hiring?</h2>
              <p className="max-w-2xl mx-auto opacity-80 mb-8">
                Streamline your hiring process with Intervio's powerful features. Access detailed performance metrics, identify top candidates, and make data-driven hiring decisions with unmatched accuracy and insights.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                    <Link href="/signup">Try for Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <Link href="/app">Request a Demo</Link>
                </Button>
              </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <Logo />
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              An all-in-one AI interview platform to streamline the hiring process.
            </p>
            <div className="mt-8 w-full border-t pt-6">
              <p className="text-sm text-muted-foreground">Made by Final Year Students CSE</p>
              <p className="mt-2 text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Intervio Inc. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
