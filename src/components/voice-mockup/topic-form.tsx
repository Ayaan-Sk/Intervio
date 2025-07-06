'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  topic: z.string({
    required_error: 'Please select a topic.',
  }),
  voice: z.enum(['male', 'female'], {
    required_error: 'You need to select a voice.',
  }),
});

type TopicFormProps = {
  onSubmit: (topic: string, voice: 'male' | 'female') => void;
  isGenerating: boolean;
};

export function TopicForm({ onSubmit, isGenerating }: TopicFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { voice: 'male' },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.topic, values.voice);
  }

  return (
    <Card className="w-full max-w-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline">Welcome to Voice Mockup</CardTitle>
        <CardDescription>
          Select a technical topic and a voice to start your mock interview.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Topic</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic for the interview" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="docker">Docker</SelectItem>
                      <SelectItem value="kubernetes">Kubernetes</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
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
