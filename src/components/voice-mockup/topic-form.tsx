'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const programmingTopics = [
  { value: 'c', label: 'C' },
  { value: 'c++', label: 'C++' },
  { value: 'c#', label: 'C#' },
  { value: 'css', label: 'CSS' },
  { value: 'docker', label: 'Docker' },
  { value: 'general', label: 'General' },
  { value: 'go', label: 'Go' },
  { value: 'html', label: 'HTML' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'php', label: 'PHP' },
  { value: 'python', label: 'Python' },
  { value: 'react', label: 'React' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
  { value: 'scala', label: 'Scala' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript' },
] as const;

const formSchema = z.object({
  topics: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'You have to select at least one topic.',
  }),
  voice: z.enum(['male', 'female'], {
    required_error: 'You need to select a voice.',
  }),
});

type TopicFormProps = {
  onSubmit: (topics: string[], voice: 'male' | 'female') => void;
  isGenerating: boolean;
};

export function TopicForm({ onSubmit, isGenerating }: TopicFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topics: [],
      voice: 'male',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.topics, values.voice);
  }

  const selectedTopics = form.watch('topics');

  return (
    <Card className="w-full max-w-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline">Welcome to Voice Mockup</CardTitle>
        <CardDescription>Select one or more topics and a voice to start your mock interview.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Technical Topics</FormLabel>
                  <FormDescription>Search for and select topics for your interview.</FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('w-full justify-between', !field.value?.length && 'text-muted-foreground')}
                        >
                          {field.value?.length > 0 ? `${field.value.length} selected` : 'Select topics'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search topics..." />
                        <CommandList>
                          <CommandEmpty>No topic found.</CommandEmpty>
                          <CommandGroup>
                            {programmingTopics.map((topic) => (
                              <CommandItem
                                value={topic.label}
                                key={topic.value}
                                onSelect={() => {
                                  const currentTopics = field.value || [];
                                  const isSelected = currentTopics.includes(topic.value);
                                  const newTopics = isSelected
                                    ? currentTopics.filter((t) => t !== topic.value)
                                    : [...currentTopics, topic.value];
                                  field.onChange(newTopics);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value?.includes(topic.value) ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
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
                          <button
                            type="button"
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={() => {
                              const newTopics = selectedTopics.filter((t) => t !== topicValue);
                              field.onChange(newTopics);
                            }}
                          >
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
              name="voice"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Interviewer Voice</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male Voice</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female Voice</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isGenerating ? 'Preparing Interview...' : 'Start Interview'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
