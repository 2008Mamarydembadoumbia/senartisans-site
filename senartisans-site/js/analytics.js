// analytics.js - Suivi d'audience simple

class Analytics {
    constructor() {
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.setupEventTracking();
    }
    
    trackPageView() {
        const pageData = {
            page: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
        };
        
        this.saveToStorage('page_views', pageData);
        console.log('Page view tracked:', pageData);
    }
    
    trackEvent(category, action, label = null) {
        const eventData = {
            category,
            action,
            label,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        this.saveToStorage('events', eventData);
        console.log('Event tracked:', eventData);
    }
    
    setupEventTracking() {
        // Suivi des clics sur les produits
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('h3')?.textContent;
                this.trackEvent('Products', 'Product Click', productName);
            }
            
            // Suivi des ajouts au panier
            if (e.target.classList.contains('add-to-cart')) {
                this.trackEvent('Cart', 'Add to Cart');
            }
            
            // Suivi des favoris
            if (e.target.classList.contains('fav-btn') || e.target.closest('.fav-btn')) {
                this.trackEvent('Favorites', 'Toggle Favorite');
            }
            
            // Suivi des clics sur les liens sociaux
            if (e.target.closest('a[href*="instagram.com"]')) {
                this.trackEvent('Social', 'Instagram Click');
            }
            if (e.target.closest('a[href*="tiktok.com"]')) {
                this.trackEvent('Social', 'TikTok Click');
            }
        });
        
        // Suivi des soumissions de formulaire
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', () => {
                this.trackEvent('Forms', 'Form Submit', form.id || 'contact');
            });
        });
        
        // Suivi des étapes du quiz
        const quizSteps = document.querySelectorAll('.quiz-step');
        quizSteps.forEach(step => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class' && step.classList.contains('active')) {
                        this.trackEvent('Quiz', 'Step View', step.id);
                    }
                });
            });
            
            observer.observe(step, { attributes: true });
        });
    }
    
    saveToStorage(key, data) {
        const stored = JSON.parse(localStorage.getItem(`analytics_${key}`)) || [];
        stored.push(data);
        localStorage.setItem(`analytics_${key}`, JSON.stringify(stored));
    }
    
    getAnalyticsData() {
        return {
            pageViews: JSON.parse(localStorage.getItem('analytics_page_views')) || [],
            events: JSON.parse(localStorage.getItem('analytics_events')) || []
        };
    }
    
    clearAnalyticsData() {
        localStorage.removeItem('analytics_page_views');
        localStorage.removeItem('analytics_events');
    }
}

// Initialiser l'analytics
document.addEventListener('DOMContentLoaded', function() {
    window.analytics = new Analytics();
});