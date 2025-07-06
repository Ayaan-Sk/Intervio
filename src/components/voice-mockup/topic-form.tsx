'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const topics = ["react", "docker", "kubernetes", "general"] as const;

const formSchema = z.object({
  topics: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one topic.",
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
      voice: 'male' 
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.topics, values.voice);
  }

  return (
    <Card className="w-full max-w-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline">Welcome to Voice Mockup</CardTitle>
        <CardDescription>
          Select one or more topics and a voice to start your mock interview.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topics"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Technical Topics</FormLabel>
                    <FormDescription>
                      Select one or more topics for your interview.
                    </FormDescription>
                  </div>
                  {topics.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="topics"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {item}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
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
