import { Link } from "wouter";
import { Mail, Phone, MapPin, Heart, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Projects", href: "/projects" },
    { label: "Impact", href: "/impact" },
    { label: "Governance", href: "/governance" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Organization Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
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
              SONAHRI (SHDS)
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sonahri Humanitarian Development Society — Building resilient communities in rural Sindh since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-white font-bold mb-4">More</h4>
            <ul className="space-y-2">
              {footerLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2d8659] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p className="font-semibold text-white">House No 323, Turkish Colony</p>
                  <p>Makli, Thatta &mdash; Head Office</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#2d8659] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p>+92-333-2592501</p>
                  <p>+92-312-6083699</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#2d8659] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">sonahri_thatto@yahoo.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-[#2d8659] flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.shdshome.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  www.shdshome.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400 text-center md:text-left">
            <p>
              © {currentYear} Sonahri Humanitarian Development Society. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for rural Sindh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
