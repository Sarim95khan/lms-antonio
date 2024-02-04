'use client';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import { Course, Attachment } from '@prisma/client';
import { FileUpload } from '@/components/file-uploadthing';

interface AttachmentFormProps {
  initialData: Course & {
    attachments: Attachment[];
  };
  courseId: string;
}
const formSchema = z.object({
  url: z.string().min(1) || undefined,
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => {
    setEditing(!isEditing);
  };
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/attachments/`,
        values
      );
      toggleEdit();
      router.refresh();
      toast.success('Attachments updated');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="mt-4 bg-slate-100 rounded-md p-4 border">
      <div className="font-medium flex items-center justify-between">
        <h2>Course attachments</h2>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Attachment
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment: any) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div className="mb-4 h-60">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground text-slate-600">
            Aspect ratio 16:9 recommend
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
