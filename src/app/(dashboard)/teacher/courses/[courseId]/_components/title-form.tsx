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
import { Edit, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!isEditing);
  };
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toggleEdit();
      router.refresh();
      toast.success('Course title updated');
    } catch {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="mt-4 bg-slate-100 rounded-md p-4 border">
      <div className="font-medium flex items-center justify-between">
        <h2>Course Title</h2>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="mt-2">
          <h3 className="text-sm text-slate-700">{initialData.title}</h3>
        </div>
      )}
      {isEditing && (
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
                        placeholder="e.g. 'Advanced web development'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default TitleForm;
