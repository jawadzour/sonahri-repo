import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Projects", href: "/projects" },
    { label: "Impact", href: "/impact" },
    { label: "Governance", href: "/governance" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#2d8659]/20 flex-shrink-0">
              <img
                src="/favicon.png"
                alt="Sonahri Humanitarian Development Society logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.textContent = "S";
                }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-base sm:text-xl md:text-2xl text-[#2d8659] tracking-tight">
                SONAHRI
              </span>
              <span className="block text-[10px] md:text-xs font-semibold text-gray-500 tracking-wide uppercase">
                Humanitarian Development Society
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isActive(item.href)
                  ? "bg-[#2d8659] text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="ml-2 bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/donate">
                <Heart className="w-4 h-4" />
                Donate
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="xl:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                  ? "bg-[#2d8659] text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/donate">
                <Heart className="w-4 h-4" />
                Donate
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}