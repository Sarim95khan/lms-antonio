'use client';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import { Course } from '@prisma/client';
import { FileUpload } from '@/components/file-uploadthing';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}
const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required',
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!isEditing);
  };
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toggleEdit();
      router.refresh();
      toast.success('Image updated');
    } catch {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="mt-4 bg-slate-100 rounded-md p-4 border">
      <div className="font-medium flex items-center justify-between">
        <h2>Course image</h2>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Image
            </>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div className="mb-4 h-60">
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
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

export default ImageForm;
