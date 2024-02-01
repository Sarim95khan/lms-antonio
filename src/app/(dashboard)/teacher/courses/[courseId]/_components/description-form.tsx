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
import { Textarea } from '@/components/ui/textarea';

interface DescriptionFormProps {
  initialData: {
    description: string | undefined;
  };
  courseId: string;
}
const formSchema = z.object({
  description: z.string().min(1, {
    message: 'Description is required',
  }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!isEditing);
  };
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toggleEdit();
      router.refresh();
      toast.success('Course description updated');
    } catch {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="mt-4 bg-slate-100 rounded-md p-4 border">
      <div className="font-medium flex items-center justify-between">
        <h2>Course description</h2>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.description && (
        <div className="mt-2">
          <h3 className="text-sm text-slate-700 ">
            {initialData.description}
          </h3>
        </div>
      )}
      {!isEditing && !initialData.description && (
        <div className="mt-2">
          <h3 className="text-sm text-slate-700 italic">No descripton</h3>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="e.g. 'This course is about ..."
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

export default DescriptionForm;
