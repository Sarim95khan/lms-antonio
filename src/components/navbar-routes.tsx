'use client';
import { UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacher = pathname.startsWith('/teacher');
  const isPlayer = pathname.startsWith('/chapter');

  return (
    <div className="flex flex-row items-center gap-x-2 ml-auto">
      <div className="flex items-center pr-2">
        {isTeacher || isPlayer ? (
          <Link href={'/'}>
            <Button variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={'/teacher/courses'}>
            <Button size="sm" variant="default">
              Teacher Mode
            </Button>
          </Link>
        )}
      </div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default NavbarRoutes;
