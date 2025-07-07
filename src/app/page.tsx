import { VoiceMockupApp } from '@/components/voice-mockup/voice-mockup-app';
import { ResumeCheckerApp } from '@/components/resume-checker/resume-checker-app';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">Interview Prep AI</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Tabs defaultValue="interview" className="w-full">
          <div className="flex justify-center border-b">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="interview">
                <Bot className="mr-2" />
                Mock Interview
              </TabsTrigger>
              <TabsTrigger value="resume">
                <FileText className="mr-2" />
                Resume ATS Checker
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="interview">
            <VoiceMockupApp />
          </TabsContent>
          <TabsContent value="resume">
            <div className="container mx-auto py-8 px-4 flex flex-col items-center gap-8">
              <ResumeCheckerApp />
            </div>
          </TabsContent>
        </Tabs>
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
