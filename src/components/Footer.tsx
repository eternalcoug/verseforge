import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#2A2A2A] py-4 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <img
              src="/VerseForge_final.png"
              alt="VerseForge"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="text-[#A3A3A3] text-sm">
            Copyright 2025-26 VerseForge
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A3A3A3] hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A3A3A3] hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
