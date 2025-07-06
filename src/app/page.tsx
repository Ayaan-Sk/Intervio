import { VoiceMockupApp } from '@/components/voice-mockup/voice-mockup-app';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">Voice Mockup</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <VoiceMockupApp />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, Genkit, and ShadCN UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
