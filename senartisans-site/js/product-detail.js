// product-detail.js - Gestion de la page produit détaillé

class ProductDetail {
    constructor() {
        this.product = null;
        this.currentImageIndex = 0;
        this.init();
    }
    
    init() {
        this.loadProduct();
        this.setupEventListeners();
        this.initTabs();
        this.initImageGallery();
        this.initQuantitySelector();
    }
    
    loadProduct() {
        // En réalité, on récupérerait le produit depuis l'URL ou une API
        // Pour l'exemple, on utilise un produit fixe
        this.product = {
            id: 1,
            name: "Parure Thioup Bleu",
            description: "Cette parure de lit complète en tie & dye traditionnel sénégalais apporte une touche d'élégance africaine à votre chambre. Confectionnée à la main à Mbour avec des draps recyclés de qualité supérieure.",
            price: 45000,
            images: [
                "assets/images/produits/parure-1.jpg",
                "assets/images/produits/parure-1-alt1.jpg",
                "assets/images/produits/parure-1-alt2.jpg",
                "assets/images/produits/parure-1-alt3.jpg"
            ],
            features: [
                "100% coton recyclé",
                "Teinture naturelle 'thioup'",
                "Lavable en machine",
                "Motifs uniques et traditionnels",
                "Parure complète (drap housse + taies)"
            ],
            sizes: ["140x190", "160x200", "180x200"]
        };
        
        this.updateProductDisplay();
    }
    
    setupEventListeners() {
        // Bouton ajouter au panier
        const addToCartBtn = document.getElementById('add-to-cart-single');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }
        
        // Bouton ajouter aux favoris
        const addToFavBtn = document.getElementById('add-to-fav');
        if (addToFavBtn) {
            addToFavBtn.addEventListener('click', () => this.toggleFavorite());
        }
        
        // Initialiser le statut favori
        this.updateFavoriteStatus();
    }
    
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Désactiver tous les onglets
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Activer l'onglet courant
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    initImageGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-image');
        
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                // Mettre à jour l'image principale
                mainImage.src = thumb.src;
                
                // Mettre à jour les miniatures actives
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                this.currentImageIndex = index;
            });
        });
    }
    
    initQuantitySelector() {
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        const quantityInput = document.getElementById('quantity');
        
        if (minusBtn && plusBtn && quantityInput) {
            minusBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value < 10) {
                    quantityInput.value = value + 1;
                }
            });
            
            quantityInput.addEventListener('change', () => {
                let value = parseInt(quantityInput.value);
                if (value < 1) quantityInput.value = 1;
                if (value > 10) quantityInput.value = 10;
            });
        }
    }
    
    updateProductDisplay() {
        // Mettre à jour les informations du produit
        document.title = `${this.product.name} - Senartisans`;
        
        const productName = document.querySelector('.product-info h1');
        if (productName) productName.textContent = this.product.name;
        
        const productPrice = document.querySelector('.product-price .current-price');
        if (productPrice) productPrice.textContent = `${this.product.price.toLocaleString()} FCFA`;
        
        const productDesc = document.querySelector('.product-description p');
        if (productDesc) productDesc.textContent = this.product.description;
        
        // Mettre à jour les features
        const featuresList = document.querySelector('.features ul');
        if (featuresList) {
            featuresList.innerHTML = this.product.features
                .map(feature => `<li>${feature}</li>`)
                .join('');
        }
        
        // Mettre à jour le sélecteur de taille
        const sizeSelect = document.getElementById('size-select');
        if (sizeSelect) {
            sizeSelect.innerHTML = `
                <option value="">Choisir une taille</option>
                ${this.product.sizes.map(size => `<option value="${size}">${size} cm</option>`).join('')}
            `;
        }
    }
    
    addToCart() {
        const sizeSelect = document.getElementById('size-select');
        const quantityInput = document.getElementById('quantity');
        const selectedSize = sizeSelect ? sizeSelect.value : '';
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        // Vérifier si une taille est sélectionnée
        if (sizeSelect && !selectedSize) {
            alert('Veuillez sélectionner une taille avant d\'ajouter au panier.');
            sizeSelect.focus();
            return;
        }
        
        // Créer l'objet produit pour le panier
        const cartProduct = {
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            size: selectedSize,
            image: this.product.images[0],
            quantity: quantity
        };
        
        // Ajouter au panier
        if (window.cart) {
            window.cart.addToCartFromData(cartProduct);
            
            // Feedback visuel
            const addToCartBtn = document.getElementById('add-to-cart-single');
            const originalText = addToCartBtn.textContent;
            addToCartBtn.textContent = '✓ Ajouté !';
            addToCartBtn.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.style.backgroundColor = '';
            }, 2000);
        }
    }
    
    toggleFavorite() {
        let favorites = JSON.parse(localStorage.getItem('senartisans_favs')) || [];
        const addToFavBtn = document.getElementById('add-to-fav');
        
        if (favorites.includes(this.product.id.toString())) {
            // Retirer des favoris
            favorites = favorites.filter(id => id !== this.product.id.toString());
            addToFavBtn.innerHTML = `
                <img src="assets/icons/heart-icon.svg" alt="Favoris" class="icon">
                Ajouter aux favoris
            `;
        } else {
            // Ajouter aux favoris
            favorites.push(this.product.id.toString());
            addToFavBtn.innerHTML = `
                <img src="assets/icons/heart-filled.svg" alt="Favoris" class="icon">
                Retirer des favoris
            `;
        }
        
        // Sauvegarder dans localStorage
        localStorage.setItem('senartisans_favs', JSON.stringify(favorites));
        
        // Mettre à jour le compteur dans le header
        this.updateFavoriteCount();
        
        // Animation de feedback
        addToFavBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            addToFavBtn.style.transform = 'scale(1)';
        }, 300);
    }
    
    updateFavoriteStatus() {
        const favorites = JSON.parse(localStorage.getItem('senartisans_favs')) || [];
        const addToFavBtn = document.getElementById('add-to-fav');
        
        if (favorites.includes(this.product.id.toString())) {
            addToFavBtn.innerHTML = `
                <img src="assets/icons/heart-filled.svg" alt="Favoris" class="icon">
                Retirer des favoris
            `;
        }
    }
    
    updateFavoriteCount() {
        const favorites = JSON.parse(localStorage.getItem('senartisans_favs')) || [];
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
}

// Initialiser la page produit détaillé
document.addEventListener('DOMContentLoaded', function() {
    window.productDetail = new ProductDetail();
});