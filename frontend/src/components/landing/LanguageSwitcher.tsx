'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/lib/language-context';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: 'en', label: 'EN', nativeName: 'English' },
    { code: 'om', label: 'OM', nativeName: 'Afaan Oromoo' },
    { code: 'am', label: 'AM', nativeName: 'አማርኛ' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill text-white transition-all"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1.5px solid rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          fontWeight: 700,
          fontSize: '0.86rem',
          letterSpacing: '0.03em',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(255, 255, 255, 0.5)' : 'none',
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Change Language / Afaan Jijjiiraa / ቋንቋ ቀይር"
      >
        <Globe size={16} />
        <span>{currentLang.label}</span>
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 py-1.5 rounded-4 shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            minWidth: '175px',
            zIndex: 1050,
            animation: 'fadeInScale 0.18s ease-out',
          }}
          role="listbox"
        >
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className="w-100 px-3 py-2 border-0 text-start d-flex align-items-center justify-content-between small fw-bold transition-all"
                style={{
                  background: isSelected ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                  color: isSelected ? '#EA580C' : '#1C1917',
                  cursor: 'pointer',
                }}
                role="option"
                aria-selected={isSelected}
              >
                <div className="d-flex flex-column">
                  <span>{lang.nativeName}</span>
                  <span className="text-muted" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
                    {lang.code.toUpperCase()}
                  </span>
                </div>
                {isSelected && <Check size={16} style={{ color: '#EA580C' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
