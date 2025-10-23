// main.js - Script principal pour Senartisans (version corrigée)

// Gestion du chargement
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Gestion du menu mobile
const menuBtn = document.getElementById('menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn) {
    menuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Gestion des favoris - FONCTION GLOBALE
function initFavorites() {
    const favBtns = document.querySelectorAll('.fav-btn');
    updateFavCount(); // Mettre à jour le compteur au chargement
    
    favBtns.forEach(btn => {
        const productCard = btn.closest('.product-card');
        if (!productCard) return;
        
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        if (!addToCartBtn) return;
        
        const productId = addToCartBtn.dataset.product;
        
        // Vérifier si le produit est déjà en favoris
        if (isProductInFavorites(productId)) {
            btn.classList.add('active');
            const icon = btn.querySelector('img');
            if (icon) icon.src = 'assets/icons/heart-filled.svg';
        }
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            const icon = this.querySelector('img');
            
            if (this.classList.contains('active')) {
                // Ajouter aux favoris
                addToFavorites(productId);
                if (icon) icon.src = 'assets/icons/heart-filled.svg';
            } else {
                // Retirer des favoris
                removeFromFavorites(productId);
                if (icon) icon.src = 'assets/icons/heart-icon.svg';
            }
            
            // Mettre à jour le compteur
            updateFavCount();
            
            // Animation de feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    });
}

// Fonctions utilitaires pour les favoris
function getFavorites() {
    return JSON.parse(localStorage.getItem('senartisans_favs')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('senartisans_favs', JSON.stringify(favorites));
}

function isProductInFavorites(productId) {
    const favorites = getFavorites();
    return favorites.includes(productId.toString());
}

function addToFavorites(productId) {
    const favorites = getFavorites();
    if (!favorites.includes(productId.toString())) {
        favorites.push(productId.toString());
        saveFavorites(favorites);
    }
}

function removeFromFavorites(productId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== productId.toString());
    saveFavorites(favorites);
}

function updateFavCount() {
    const favorites = getFavorites();
    const favCount = document.querySelector('.fav-count');
    
    if (favCount) {
        favCount.textContent = favorites.length;
        if (favorites.length > 0) {
            favCount.style.display = 'flex';
        } else {
            favCount.style.display = 'none';
        }
    }
}

// Animation des étoiles de témoignages
function initTestimonialStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.2)';
            this.style.color = '#FFD700';
        });
        
        star.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Carousel de témoignages
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth + 
                     parseInt(getComputedStyle(carousel).gap);
    
    prevBtn.addEventListener('click', function() {
        carousel.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', function() {
        carousel.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });
}

// Animation au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments avec la classe fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Gestion du formulaire de contact
function initContactForm() {
    const form = document.querySelector('form[action^="https://formspree.io"]');
    if(!form) return;
    
    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Afficher un indicateur de chargement
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            const data = new FormData(form);
            const res = await fetch(form.action, { 
                method: "POST", 
                body: data, 
                headers: { 'Accept': 'application/json' }
            });
            
            if (res.ok) { 
                alert("✅ Message envoyé avec succès !"); 
                form.reset(); 
            } else { 
                alert("❌ Erreur lors de l'envoi. Merci de réessayer."); 
            }
        } catch (error) {
            alert("❌ Erreur de connexion. Merci de vérifier votre connexion internet.");
        } finally {
            // Restaurer le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    initFavorites(); // Initialiser les favoris sur toutes les pages
    initTestimonialStars();
    initTestimonialCarousel();
    initScrollAnimations();
    initContactForm();
    
    // Animation des icônes sociales
    const socialIcons = document.querySelectorAll('.socials img');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        icon.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
});

// Rendre les fonctions accessibles globalement
window.initFavorites = initFavorites;
window.updateFavCount = updateFavCount;