'use client';

import { BarChart, Layout, List, Search } from 'lucide-react';
import { SidebarItem } from './sidebar-item';
import { usePathname } from 'next/navigation';

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Search,
    label: 'Search',
    href: '/search',
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: 'Courses',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
];
const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacher = pathname.includes('/teacher');
  const routes = isTeacher ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          href={route.href}
          label={route.label}
          icon={route.icon}
        />
        // <div key={route.href}>Siderbar Item</div>
      ))}
    </div>
  );
};

export default SidebarRoutes;
