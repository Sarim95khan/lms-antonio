import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    const { title } = await req.json();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new Response('Unauthorized', { status: 401 });
    }
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        position: newPosition,
        courseId: params.courseId,
      },
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.log('Course chapter error');
    return NextResponse.json(error);
  }
};
