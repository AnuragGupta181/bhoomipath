import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import fullLogo from "@/assets/fulllogo.png";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            <a
              href="/"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={fullLogo} 
                alt="BhoomiPath" 
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-foreground hover:text-primary font-bold transition-colors">
            Home
          </a>
          <a href="/ecosathi" className="text-foreground hover:text-primary font-bold transition-colors">
            Services
          </a>
          <a href="#blog" className="text-foreground hover:text-primary font-bold transition-colors">
            Blog
          </a>
          <a 
            href="#contact" 
            className="text-foreground hover:text-primary font-bold transition-colors"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Contact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {!isSignedIn ? (
            <>
              <Button variant="outline" className="hidden md:inline-flex" asChild>
                <a href="/signin">LOG IN</a>
              </Button>
              <Button className="earthster-btn-glow">
                <a href="/ecosathi">Get Started</a>
              </Button>
            </>
          ) : (
            <>
              <Button className="earthster-btn-glow">
                <a href="/ecosathi">Dashboard</a>
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-foreground hidden md:inline">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/api/auth/signout'}>
                  Sign Out
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border px-6 py-4 flex flex-col space-y-4">
          <a href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="/ecosathi" className="text-foreground hover:text-primary transition-colors">
            Services
          </a>
          <a href="#blog" className="text-foreground hover:text-primary transition-colors">
            Blog
          </a>
          <a 
            href="#contact" 
            className="text-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Contact
          </a>

          {!isSignedIn ? (
            <>
              <Button variant="outline" asChild>
                <a href="/signin">LOG IN</a>
              </Button>
              <Button className="earthster-btn-glow">
                <a href="/ecosathi">Get Started</a>
              </Button>
            </>
          ) : (
            <>
              <Button className="earthster-btn-glow">
                <a href="/ecosathi">Dashboard</a>
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/api/auth/signout'}>
                Sign Out
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
