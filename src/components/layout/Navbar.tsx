import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/'} 
            className="flex-shrink-0"
          >
            <img 
              src="/images/logo.webp" 
              alt="FTS Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Right Section: Theme Toggle + Menu/Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Desktop Navigation (Sign In, Get Started) */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-base">Sign In</Button>
                </Link>
                <Link to="/login">
                  <Button className="text-base">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Authenticated User Navigation (Notifications + User Menu) */}
            {isAuthenticated && (
              <>
                {/* Desktop: Notifications + User Menu */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => handleNavigation('/notifications')}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {unreadNotificationsCount}
                      </Badge>
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground capitalize">
                            {user?.role}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile: Hamburger Menu */}
                <button
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </>
            )}

            {/* Mobile: Hamburger Menu for Unauthenticated */}
            {!isAuthenticated && (
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card/50 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full justify-start text-base">Sign In</Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button className="w-full justify-start text-base">Get Started</Button>
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadNotificationsCount > 0 && (
                      <Badge className="ml-auto">{unreadNotificationsCount}</Badge>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};