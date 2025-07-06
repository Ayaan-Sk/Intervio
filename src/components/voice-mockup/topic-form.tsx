
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters.').max(50, 'Topic is too long.'),
});

type TopicFormProps = {
  onSubmit: (topic: string) => void;
  isGenerating: boolean;
};

export function TopicForm({ onSubmit, isGenerating }: TopicFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.topic);
  }

  return (
    <Card className="w-full max-w-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline">Welcome to Voice Mockup</CardTitle>
        <CardDescription>Enter a technical topic to start your mock interview.</CardDescription>
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
                  <FormControl>
                    <Input placeholder="e.g., React Hooks, Docker, Kubernetes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isGenerating ? 'Generating Questions...' : 'Start Interview'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
