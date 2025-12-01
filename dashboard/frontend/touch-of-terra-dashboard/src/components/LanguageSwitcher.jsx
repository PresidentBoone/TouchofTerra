import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en', label: '🇺🇸 EN' },
        { code: 'es', label: '🇪🇸 ES' },
        { code: 'fr', label: '🇫🇷 FR' }
    ];

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => {
                        if (lang.code === 'es') {
                            console.log('Clicked ES');
                        } else {
                            console.log(`Clicked ${lang.code.toUpperCase()}`);
                        }
                        setLanguage(lang.code);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${language === lang.code
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    style={{
                        backgroundColor: language === lang.code ? '#7BA05B' : 'transparent',
                        color: language === lang.code ? 'white' : '#4B5563'
                    }}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
