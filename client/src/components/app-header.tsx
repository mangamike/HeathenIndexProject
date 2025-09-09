import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AppHeaderProps {
  onShowAddForm: () => void;
}

export function AppHeader({ onShowAddForm }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <i className="fas fa-hammer text-2xl text-primary" data-testid="logo-icon"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="site-title">Heathen Index</h1>
              <p className="text-xs text-muted-foreground" data-testid="site-subtitle">Norse Mythology Database</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#" 
              className="text-sm font-medium text-primary border-b-2 border-primary pb-1"
              data-testid="nav-browse"
            >
              Browse
            </a>
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={onShowAddForm}
                  data-testid="nav-add-entry"
                >
                  Add Entry
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt="Profile" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.href = '/api/logout'}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card" data-testid="mobile-menu">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              <a 
                href="#" 
                className="block px-3 py-2 text-sm font-medium text-primary bg-accent rounded-md"
                data-testid="mobile-nav-browse"
              >
                Browse
              </a>
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                    onClick={() => {
                      onShowAddForm();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-nav-add-entry"
                  >
                    Add Entry
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                    onClick={() => window.location.href = '/api/logout'}
                    data-testid="mobile-nav-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="mobile-nav-login"
                  disabled={isLoading}
                >
                  <User className="h-4 w-4 mr-2" />
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
