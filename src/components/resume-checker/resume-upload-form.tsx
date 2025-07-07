'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

const formSchema = z.object({
  resume: z
    .custom<FileList>()
    .refine((files) => !!files && files.length === 1, 'Resume is required.')
    .refine((files) => !!files && files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !!files && ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'Only .pdf files are accepted.'
    ),
  jobDescription: z.string().min(50, { message: 'Job description must be at least 50 characters long.' }),
});

type ResumeFormProps = {
  onSubmit: (resumeDataUri: string, jobDescription: string) => void;
  isAnalyzing: boolean;
};

// Helper function to read file as Data URI
const toDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export function ResumeUploadForm({ onSubmit, isAnalyzing }: ResumeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  const fileRef = form.register("resume");

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const resumeFile = values.resume[0];
    const resumeDataUri = await toDataURL(resumeFile);
    onSubmit(resumeDataUri, values.jobDescription);
  }

  return (
    <Card className="w-full max-w-2xl animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline">ATS Resume Checker</CardTitle>
        <CardDescription>Upload your resume and paste a job description to see how well you match.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Resume</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".pdf" {...fileRef} />
                  </FormControl>
                  <FormDescription>Upload your resume in PDF format (max 5MB).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the full job description here..."
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Paste the job description you are applying for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isAnalyzing}>
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? 'Analyzing...' : 'Analyze My Resume'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
