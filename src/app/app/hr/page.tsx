
'use client';

import * as React from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { AuthState } from '@/components/auth-state';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Check, ChevronsUpDown, X, CalendarIcon, Briefcase, Users, Send } from 'lucide-react';

const programmingTopics = [
  { value: 'c', label: 'C' }, { value: 'c++', label: 'C++' }, { value: 'c#', label: 'C#' },
  { value: 'css', label: 'CSS' }, { value: 'docker', label: 'Docker' }, { value: 'general', label: 'General' },
  { value: 'go', label: 'Go' }, { value: 'html', label: 'HTML' }, { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' }, { value: 'kotlin', label: 'Kotlin' }, { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'php', label: 'PHP' }, { value: 'python', label: 'Python' }, { value: 'react', label: 'React' },
  { value: 'ruby', label: 'Ruby' }, { value: 'rust', label: 'Rust' }, { value: 'scala', label: 'Scala' },
  { value: 'sql', label: 'SQL' }, { value: 'swift', label: 'Swift' }, { value: 'typescript', label: 'TypeScript' },
] as const;

const formSchema = z.object({
  candidateEmails: z.string().min(1, 'Please enter at least one candidate email.'),
  topics: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'You have to select at least one topic.',
  }),
  deadline: z.date({
    required_error: 'A deadline is required.',
  }),
});

export default function HRDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateEmails: '',
      topics: [],
    },
  });

  const selectedTopics = form.watch('topics');

  function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log('Submitting invites:', values);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Invitations Sent!',
        description: `Mock interviews have been scheduled for ${values.candidateEmails.split(',').length} candidate(s).`,
      });
      form.reset();
      form.setValue('topics', []);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">HR Dashboard</h1>
          </div>
          <AuthState />
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><Send /> Schedule Mock Interviews</CardTitle>
                <CardDescription>Invite candidates to a mock interview. Enter their emails and select the topics.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="candidateEmails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Candidate Emails</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., candidate1@example.com, candidate2@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Enter comma-separated email addresses.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topics"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Technical Topics</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value?.length && 'text-muted-foreground')}>
                                  {field.value?.length > 0 ? `${field.value.length} selected` : 'Select topics'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command>
                                <CommandInput placeholder="Search topics..." />
                                <CommandList><CommandEmpty>No topic found.</CommandEmpty>
                                <CommandGroup>
                                  {programmingTopics.map((topic) => (
                                    <CommandItem
                                      value={topic.label} key={topic.value}
                                      onSelect={() => {
                                        const currentTopics = field.value || [];
                                        const newTopics = currentTopics.includes(topic.value)
                                          ? currentTopics.filter((t) => t !== topic.value)
                                          : [...currentTopics, topic.value];
                                        field.onChange(newTopics);
                                      }}
                                    >
                                      <Check className={cn('mr-2 h-4 w-4', field.value?.includes(topic.value) ? 'opacity-100' : 'opacity-0')} />
                                      {topic.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <div className="pt-2 flex flex-wrap gap-2">
                            {selectedTopics.map((topicValue) => {
                              const topicLabel = programmingTopics.find((t) => t.value === topicValue)?.label;
                              return (
                                <Badge variant="secondary" key={topicValue}>
                                  {topicLabel}
                                  <button type="button" className="ml-1" onClick={() => field.onChange(selectedTopics.filter((t) => t !== topicValue))}>
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Interview Deadline</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                  {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Candidates must complete the interview by this date.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Invites'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase /> Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Manage job openings here.</p>
                {/* Placeholder for future functionality */}
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Candidate Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">View and manage all candidates.</p>
                {/* Placeholder for future functionality */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
