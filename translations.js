let translations = {};
let currentLang = localStorage.getItem('language') || 'en';

async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
        updateLanguage(currentLang);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = translations[lang];
        
        for (const key of keys) {
            if (value) {
                value = value[key];
            }
        }
        
        if (value) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'fi' : 'en';
    updateLanguage(newLang);
}

// Load translations when the page loads
document.addEventListener('DOMContentLoaded', loadTranslations);
