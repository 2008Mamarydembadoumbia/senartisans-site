// contact.js - Gestion de la page contact

class ContactPage {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initFAQ();
    }
    
    setupEventListeners() {
        // Le formulaire est déjà géré par main.js
        // On peut ajouter des validations supplémentaires ici
        this.initFormValidation();
    }
    
    initFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showError(field, 'Ce champ est obligatoire');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Veuillez entrer une adresse email valide');
                return false;
            }
        }
        
        this.clearError(field);
        return true;
    }
    
    showError(field, message) {
        this.clearError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Fermer tous les autres items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Basculer l'item courant
                item.classList.toggle('active');
            });
        });
    }
}

// Initialiser la page contact
document.addEventListener('DOMContentLoaded', function() {
    window.contactPage = new ContactPage();
});