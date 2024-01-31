import { Button } from '@/components/ui/button';
import Link from 'next/link';

const TeacherCourses = () => {
  return (
    <div className='p-6'>
      <Link href={'/teacher/create'}>
        <Button>New Course</Button>
      </Link>
    </div>
  );
};

export default TeacherCourses;
