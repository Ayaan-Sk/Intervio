
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History } from 'lucide-react';

// Dummy data for interview history
const interviewHistory = [
  {
    id: 1,
    topics: ['React', 'TypeScript'],
    date: '2024-07-28',
    score: 4.2,
  },
  {
    id: 2,
    topics: ['Python', 'Data Structures'],
    date: '2024-07-25',
    score: 3.8,
  },
  {
    id: 3,
    topics: ['Java', 'Spring Boot'],
    date: '2024-07-22',
    score: 4.5,
  },
    {
    id: 4,
    topics: ['JavaScript'],
    date: '2024-07-19',
    score: 3.1,
  },
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <History className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">Interview History</h1>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/app"><ArrowLeft className="mr-2"/> Back to App</Link>
                </Button>
            </div>
        </header>
        <main className="flex-1 flex justify-center py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-4xl mx-auto animate-fade-in-up">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Your Past Interviews</CardTitle>
                        <CardDescription>
                        Review your previous mock interviews and track your progress.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Topics</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interviewHistory.map((interview) => (
                            <TableRow key={interview.id}>
                                <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                        {interview.topics.map(topic => <Badge key={topic} variant="secondary">{topic}</Badge>)}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(interview.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">View Details</Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
