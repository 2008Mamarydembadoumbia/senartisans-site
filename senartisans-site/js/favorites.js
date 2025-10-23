// favorites.js - Gestion de la page favoris

class FavoritesPage {
    constructor() {
        this.favorites = [];
        this.products = [];
        this.init();
    }
    
    init() {
        this.loadProducts();
        this.loadFavorites();
        this.setupEventListeners();
        this.displayFavorites();
    }
    
    loadProducts() {
        // Mêmes données que dans products.js
        this.products = [
            {
                id: 1,
                name: "Parure Thioup Bleu",
                description: "Motifs traditionnels sur fond bleu profond",
                price: 45000,
                category: "classique",
                image: "assets/images/produits/parure-1.jpg",
                sizes: ["140x190", "160x200", "180x200"]
            },
            {
                id: 2,
                name: "Parure Thioup Vert",
                description: "Motifs traditionnels sur fond vert aréol",
                price: 42000,
                category: "classique",
                image: "assets/images/produits/parure-2.jpg",
                sizes: ["140x190", "160x200", "180x200"]
            },
            {
                id: 3,
                name: "Parure Thioup Indigo",
                description: "Teinture naturelle indigo sur coton bio",
                price: 48000,
                category: "premium",
                image: "assets/images/produits/parure-3.jpg",
                sizes: ["140x190", "160x200", "180x200"]
            },
            // ... autres produits (identique à products.js)
        ];
    }
    
    loadFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('senartisans_favs')) || [];
        this.updateFavoriteCount();
    }
    
    setupEventListeners() {
        const clearFavoritesBtn = document.getElementById('clear-favorites');
        if (clearFavoritesBtn) {
            clearFavoritesBtn.addEventListener('click', () => this.clearFavorites());
        }
    }
    
    displayFavorites() {
        const favoritesGrid = document.getElementById('favorites-grid');
        const favoritesEmpty = document.getElementById('favorites-empty');
        const favoritesCount = document.getElementById('favorites-count');
        
        if (!favoritesGrid || !favoritesEmpty) return;
        
        // Filtrer les produits favoris
        const favoriteProducts = this.products.filter(product => 
            this.favorites.includes(product.id.toString())
        );
        
        // Mettre à jour le compteur
        if (favoritesCount) {
            favoritesCount.textContent = `${favoriteProducts.length} produit(s)`;
        }
        
        // Afficher ou masquer l'état vide
        if (favoriteProducts.length === 0) {
            favoritesGrid.style.display = 'none';
            favoritesEmpty.style.display = 'block';
            return;
        } else {
            favoritesGrid.style.display = 'grid';
            favoritesEmpty.style.display = 'none';
        }
        
        // Vider la grille
        favoritesGrid.innerHTML = '';
        
        // Afficher les produits favoris
        favoriteProducts.forEach(product => {
            const productCard = this.createFavoriteCard(product);
            favoritesGrid.appendChild(productCard);
        });
        
        // Initialiser les interactions
        this.initFavoriteInteractions();
    }
    
    createFavoriteCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="fav-btn active" data-product="${product.id}">
                    <img src="assets/icons/heart-filled.svg" alt="Retirer des favoris" class="icon">
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">${product.price.toLocaleString()} FCFA</span>
                    <div class="size-selector">
                        <label for="fav-size-${product.id}">Taille:</label>
                        <select id="fav-size-${product.id}" class="size-select">
                            <option value="">Choisir</option>
                            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-product="${product.id}">
                        Ajouter au panier
                    </button>
                    <a href="produit.html?id=${product.id}" class="btn btn-outline">
                        Voir détails
                    </a>
                </div>
            </div>
        `;
        return card;
    }
    
    initFavoriteInteractions() {
        this.initRemoveFavoriteButtons();
        this.initAddToCartButtons();
    }
    
    initRemoveFavoriteButtons() {
        const favBtns = document.querySelectorAll('.fav-btn');
        
        favBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.dataset.product;
                this.removeFromFavorites(productId);
            });
        });
    }
    
    initAddToCartButtons() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = btn.dataset.product;
                const product = this.products.find(p => p.id == productId);
                
                if (!product) return;
                
                const sizeSelect = productCard.querySelector('.size-select');
                const selectedSize = sizeSelect ? sizeSelect.value : '';
                
                // Vérifier si une taille est sélectionnée
                if (sizeSelect && !selectedSize) {
                    alert('Veuillez sélectionner une taille avant d\'ajouter au panier.');
                    sizeSelect.focus();
                    return;
                }
                
                // Créer l'objet produit pour le panier
                const cartProduct = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    size: selectedSize,
                    image: product.image,
                    quantity: 1
                };
                
                // Ajouter au panier
                if (window.cart) {
                    window.cart.addToCartFromData(cartProduct);
                }
            });
        });
    }
    
    removeFromFavorites(productId) {
        this.favorites = this.favorites.filter(id => id !== productId);
        localStorage.setItem('senartisans_favs', JSON.stringify(this.favorites));
        
        // Mettre à jour l'affichage
        this.displayFavorites();
        this.updateFavoriteCount();
        
        // Animation de suppression
        const removedCard = document.querySelector(`[data-product="${productId}"]`).closest('.product-card');
        if (removedCard) {
            removedCard.style.transform = 'scale(0.8)';
            removedCard.style.opacity = '0';
            setTimeout(() => {
                this.displayFavorites();
            }, 300);
        }
    }
    
    clearFavorites() {
        if (this.favorites.length === 0) return;
        
        if (confirm('Êtes-vous sûr de vouloir vider tous vos favoris ?')) {
            this.favorites = [];
            localStorage.setItem('senartisans_favs', JSON.stringify(this.favorites));
            this.displayFavorites();
            this.updateFavoriteCount();
        }
    }
    
    updateFavoriteCount() {
        const favCount = document.querySelector('.fav-count');
        if (favCount) {
            favCount.textContent = this.favorites.length;
            if (this.favorites.length > 0) {
                favCount.style.display = 'flex';
            } else {
                favCount.style.display = 'none';
            }
        }
    }
}

// Initialiser la page favoris
document.addEventListener('DOMContentLoaded', function() {
    window.favoritesPage = new FavoritesPage();
});