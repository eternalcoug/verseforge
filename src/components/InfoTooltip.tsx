import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  content: string | string[];
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-amber-600 hover:text-amber-700 transition-colors ml-1"
      >
        <HelpCircle size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 p-3 bg-[#1A1A1A] border-2 border-amber-500 rounded-lg shadow-lg left-6 top-0">
          <div className="font-bold text-amber-900 mb-2">{title}</div>
          {Array.isArray(content) ? (
            <ul className="text-sm text-amber-800 space-y-1">
              {content.map((item, index) => (
                <li key={index} className="leading-snug">• {item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-amber-800 leading-snug">{content}</p>
          )}
        </div>
      )}
    </div>
  );
};
