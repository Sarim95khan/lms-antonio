'use client';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Edit, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Chapter, Course } from '@prisma/client';
import { cn } from '@/lib/utils';

interface ChapterFormProps {
  initialData: Course & {
    chapters: Chapter[];
  };
  courseId: string;
}
const formSchema = z.object({
  title: z.string().min(1),
});

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isUpdating, setisUpdating] = useState(false);
  const [isCreating, setisCreating] = useState(false);

  const toggleCreating = () => {
    setisCreating(!isCreating);
  };
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );
      toggleCreating();
      router.refresh();
      toast.success('Course chapter created');
    } catch {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="mt-4 bg-slate-100 rounded-md p-4 border">
      <div className="font-medium flex items-center justify-between">
        <h2>Course chapters</h2>
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating && <>Cancel</>}
          {!isCreating && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'This chapter is about ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Create
              </Button>
            </form>
          </Form>
        </div>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.chapters.length && ' text-slate-500 italic'
          )}
        >
          {!initialData.chapters.length && 'No chapters'}
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChapterForm;
