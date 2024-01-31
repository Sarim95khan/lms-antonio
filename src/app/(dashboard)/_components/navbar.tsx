import NavbarRoutes from '@/components/navbar-routes';
import MobileSidebar from './mobile-sidebar';

const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between shadow-sm h-full p-4 ml-auto">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
