import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package, BarChart3, TrendingDown, FileText, Users, Settings, List } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Incoming Articles', href: '/incoming', icon: Package },
    { name: 'Inventory Dashboard', href: '/', icon: BarChart3 },
    { name: 'BOM Management', href: '/bom', icon: List },
    { name: 'Inventory Out', href: '/out', icon: TrendingDown },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Vendors', href: '/vendors', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="glossy-nav fixed top-0 z-50 w-full border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-semibold text-xl"
            >
              <div className="rounded-md bg-primary-500 p-1 shadow-sm">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span>Dronacharya Tech Hub</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-100'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  DT
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-neutral-100"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-neutral-100">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActive(item.href)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-neutral-200">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                DT
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-neutral-800">DTH User</div>
              <div className="text-sm font-medium text-neutral-500">user@dth.com</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;