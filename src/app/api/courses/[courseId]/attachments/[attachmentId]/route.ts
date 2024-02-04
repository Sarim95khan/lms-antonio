import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string; attachmentId: string } }
) => {
  const { courseId, attachmentId } = params;
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  const courseOwner = await db.course.findUnique({
    where: {
      userId: userId,
      id: courseId,
    },
  });
  if (!courseOwner) return new Response('Unauthorized', { status: 401 });
  const attachment = await db.attachment.delete({
    where: {
      id: attachmentId,
      courseId: courseId,
    },
  });
  return NextResponse.json(attachment, { status: 200 });
};
