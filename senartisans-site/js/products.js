// products.js - Gestion de la page produits (version refaite)

class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 9;
        this.isLoading = false;
        this.init();
    }
    
    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.applyFilters(); // Appliquer les filtres initiaux
        this.checkUrlParams();
    }
    
    loadProducts() {
        // Données des produits réalistes pour Senartisans
        this.products = [
            {
                id: 1,
                name: "Parure Thioup Bleu Tradition",
                description: "Motifs traditionnels sur fond bleu profond, authenticité garantie",
                price: 45000,
                category: "classique",
                image: "assets/images/produits/parure-1.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: true
            },
            {
                id: 2,
                name: "Parure Thioup Vert Aréol",
                description: "Vert naturel éclatant, motifs ancestraux préservés",
                price: 42000,
                category: "classique",
                image: "assets/images/produits/parure-2.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: true
            },
            {
                id: 3,
                name: "Parure Thioup Indigo Naturel",
                description: "Teinture indigo 100% naturelle sur coton bio premium",
                price: 48000,
                category: "premium",
                image: "assets/images/produits/parure-3.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: true
            },
            {
                id: 4,
                name: "Parure Thioup Arc-en-Ciel",
                description: "Explosion de couleurs vives sur fond blanc naturel",
                price: 45000,
                category: "moderne",
                image: "assets/images/produits/parure-4.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 5,
                name: "Parure Thioup Soleil Levant",
                description: "Dégradés orangés évoquant les levers de soleil sénégalais",
                price: 43000,
                category: "moderne",
                image: "assets/images/produits/parure-5.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 6,
                name: "Parure Thioup Terre d'Afrique",
                description: "Teintes ocre et sienne, inspiration des paysages sahéliens",
                price: 46000,
                category: "premium",
                image: "assets/images/produits/parure-6.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 7,
                name: "Parure Thioup Violet Royal",
                description: "Pourpre et violet, couleurs de la royauté africaine",
                price: 47000,
                category: "classique",
                image: "assets/images/produits/parure-7.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 8,
                name: "Parure Thioup Douceur Pastel",
                description: "Harmonie de tons pastel pour une ambiance apaisante",
                price: 44000,
                category: "moderne",
                image: "assets/images/produits/parure-8.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 9,
                name: "Parure Thioup Or de Safran",
                description: "Éclat doré du safran sur fond crème naturel",
                price: 49000,
                category: "premium",
                image: "assets/images/produits/parure-9.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 10,
                name: "Parure Thioup Graphique Moderne",
                description: "Motifs géométriques contemporains inspirés de l'art urbain",
                price: 46000,
                category: "moderne",
                image: "assets/images/produits/parure-10.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 11,
                name: "Parure Thioup Héritage",
                description: "Motifs ancestraux fidèlement reproduits, patrimoine préservé",
                price: 42000,
                category: "classique",
                image: "assets/images/produits/parure-11.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 12,
                name: "Parure Thioup Prestige",
                description: "Finition d'exception, détails brodés main, pièce unique",
                price: 52000,
                category: "premium",
                image: "assets/images/produits/parure-12.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 13,
                name: "Parure Thioup Jeunesse Dynamique",
                description: "Design énergique et coloré pour les chambres modernes",
                price: 41000,
                category: "moderne",
                image: "assets/images/produits/parure-13.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 14,
                name: "Parure Thioup Céladon Zen",
                description: "Vert céladon subtil, ambiance zen et naturelle",
                price: 47000,
                category: "premium",
                image: "assets/images/produits/parure-14.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            },
            {
                id: 15,
                name: "Parure Thioup Fête Africaine",
                description: "Couleurs festives et énergiques, esprit de célébration",
                price: 43000,
                category: "classique",
                image: "assets/images/produits/parure-15.jpg",
                sizes: ["140x190", "160x200", "180x200"],
                featured: false
            }
        ];
        
        this.filteredProducts = [...this.products];
    }
    
    setupEventListeners() {
        // Filtres avec debounce pour meilleures performances
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sizeFilter = document.getElementById('size-filter');
        const resetFilters = document.getElementById('reset-filters');
        const loadMore = document.getElementById('load-more');
        
        const applyFiltersDebounced = this.debounce(() => this.applyFilters(), 300);
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyFiltersDebounced);
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', applyFiltersDebounced);
        }
        
        if (sizeFilter) {
            sizeFilter.addEventListener('change', applyFiltersDebounced);
        }
        
        if (resetFilters) {
            resetFilters.addEventListener('click', () => this.resetFilters());
        }
        
        if (loadMore) {
            loadMore.addEventListener('click', () => this.loadMoreProducts());
        }
        
        // Recherche en temps réel
        const searchInput = document.getElementById('search-products');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => this.handleSearch(), 300));
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const collection = urlParams.get('collection');
        
        if (collection && ['classique', 'moderne', 'premium'].includes(collection)) {
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                categoryFilter.value = collection;
                this.applyFilters();
            }
        }
    }
    
    applyFilters() {
        const category = document.getElementById('category-filter')?.value || 'all';
        const price = document.getElementById('price-filter')?.value || 'all';
        const size = document.getElementById('size-filter')?.value || 'all';
        
        console.log('Applying filters:', { category, price, size });
        
        this.filteredProducts = this.products.filter(product => {
            // Filtre catégorie
            if (category !== 'all' && product.category !== category) {
                return false;
            }
            
            // Filtre prix
            if (price !== 'all') {
                const priceRange = price.split('-');
                if (price === '50000+') {
                    if (product.price < 50000) return false;
                } else {
                    const [min, max] = priceRange;
                    if (product.price < parseInt(min) || product.price > parseInt(max)) return false;
                }
            }
            
            // Filtre taille
            if (size !== 'all' && !product.sizes.includes(size)) {
                return false;
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.displayProducts();
        this.updateResultsCount();
    }
    
    handleSearch() {
        const searchInput = document.getElementById('search-products');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            this.applyFilters();
            return;
        }
        
        this.filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        this.currentPage = 1;
        this.displayProducts();
        this.updateResultsCount();
    }
    
    resetFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sizeFilter = document.getElementById('size-filter');
        const searchInput = document.getElementById('search-products');
        
        if (categoryFilter) categoryFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (sizeFilter) sizeFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
    }
    
    displayProducts() {
        const productsGrid = document.getElementById('products-grid');
        const loadMoreBtn = document.getElementById('load-more');
        
        if (!productsGrid) return;
        
        // Calculer les produits à afficher
        const startIndex = 0;
        const endIndex = this.currentPage * this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        // Vider la grille
        productsGrid.innerHTML = '';
        
        if (productsToShow.length === 0) {
            this.showEmptyState();
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }
        
        // Afficher les produits avec animation progressive
        productsToShow.forEach((product, index) => {
            setTimeout(() => {
                const productCard = this.createProductCard(product);
                productsGrid.appendChild(productCard);
                
                // Initialiser les interactions pour ce produit
                this.initProductInteractions(productCard);
            }, index * 100);
        });
        
        // Gérer le bouton "Charger plus"
        this.updateLoadMoreButton();
    }
    
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="fav-btn" data-product="${product.id}">
                    <img src="assets/icons/heart-icon.svg" alt="Ajouter aux favoris" class="icon">
                </button>
                ${product.featured ? '<span class="featured-badge">Populaire</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">${product.price.toLocaleString()} FCFA</span>
                    <div class="size-selector">
                        <label for="size-${product.id}">Taille:</label>
                        <select id="size-${product.id}" class="size-select">
                            <option value="">Choisir</option>
                            ${product.sizes.map(size => 
                                `<option value="${size}">${size}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary add-to-cart" data-product="${product.id}">
                    Ajouter au panier
                </button>
            </div>
        `;
        return card;
    }
    
    initProductInteractions(productCard) {
        this.initFavoriteButton(productCard);
        this.initAddToCartButton(productCard);
        this.initProductClick(productCard);
    }
    
    initFavoriteButton(productCard) {
        const favBtn = productCard.querySelector('.fav-btn');
        if (!favBtn) return;
        
        const productId = favBtn.dataset.product;
        const icon = favBtn.querySelector('img');
        
        // Vérifier l'état initial
        if (this.isProductInFavorites(productId)) {
            favBtn.classList.add('active');
            if (icon) icon.src = 'assets/icons/heart-filled.svg';
        }
        
        favBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            favBtn.classList.toggle('active');
            
            if (favBtn.classList.contains('active')) {
                this.addToFavorites(productId);
                if (icon) icon.src = 'assets/icons/heart-filled.svg';
            } else {
                this.removeFromFavorites(productId);
                if (icon) icon.src = 'assets/icons/heart-icon.svg';
            }
            
            // Animation de feedback
            this.animateFavoriteButton(favBtn);
        });
    }
    
    initAddToCartButton(productCard) {
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        if (!addToCartBtn) return;
        
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = addToCartBtn.dataset.product;
            const product = this.products.find(p => p.id == productId);
            
            if (!product) {
                console.error('Produit non trouvé:', productId);
                return;
            }
            
            const sizeSelect = productCard.querySelector('.size-select');
            const selectedSize = sizeSelect ? sizeSelect.value : '';
            
            // Vérifier si une taille est sélectionnée
            if (sizeSelect && !selectedSize) {
                this.showSizeError(sizeSelect);
                return;
            }
            
            // Ajouter au panier
            this.addProductToCart(product, selectedSize);
        });
    }
    
    initProductClick(productCard) {
        productCard.addEventListener('click', (e) => {
            // Ne pas déclencher si on clique sur un bouton
            if (e.target.closest('button') || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const productId = productCard.dataset.productId;
            if (productId) {
                window.location.href = `produit.html?id=${productId}`;
            }
        });
    }
    
    addProductToCart(product, size) {
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            image: product.image,
            quantity: 1
        };
        
        // Utiliser le panier global
        if (window.cart && typeof window.cart.addToCartFromData === 'function') {
            window.cart.addToCartFromData(cartProduct);
            this.showAddToCartFeedback(product.name);
        } else {
            console.error('Panier non disponible');
            alert('Erreur: Impossible d\'ajouter au panier');
        }
    }
    
    showAddToCartFeedback(productName) {
        // Créer un toast de confirmation
        const toast = document.createElement('div');
        toast.className = 'add-to-cart-toast';
        toast.innerHTML = `
            <span>✓ ${productName} ajouté au panier</span>
        `;
        
        // Styles pour le toast
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-primary);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animation d'entrée
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Animation de sortie après 3 secondes
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    showSizeError(sizeSelect) {
        // Animation d'erreur sur le sélecteur de taille
        sizeSelect.style.borderColor = '#e74c3c';
        sizeSelect.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
        
        // Message temporaire
        const originalBorder = sizeSelect.style.borderColor;
        setTimeout(() => {
            sizeSelect.style.borderColor = originalBorder;
            sizeSelect.style.boxShadow = '';
        }, 2000);
        
        alert('Veuillez sélectionner une taille avant d\'ajouter au panier.');
        sizeSelect.focus();
    }
    
    animateFavoriteButton(button) {
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 300);
    }
    
    showEmptyState() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎨</div>
                <h3 style="margin-bottom: 1rem; color: var(--color-dark);">Aucun produit trouvé</h3>
                <p style="margin-bottom: 2rem; color: var(--color-gray); max-width: 400px; margin-left: auto; margin-right: auto;">
                    Aucun produit ne correspond à vos critères de recherche. 
                    Essayez de modifier vos filtres ou votre recherche.
                </p>
                <button class="btn btn-primary" onclick="productsPage.resetFilters()">
                    Réinitialiser les filtres
                </button>
            </div>
        `;
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        const totalProducts = this.filteredProducts.length;
        const displayedProducts = Math.min(this.currentPage * this.productsPerPage, totalProducts);
        
        if (displayedProducts >= totalProducts) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Charger plus (${displayedProducts}/${totalProducts})`;
        }
    }
    
    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            const total = this.filteredProducts.length;
            resultsCount.textContent = `${total} produit${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`;
        }
    }
    
    loadMoreProducts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Chargement...';
            loadMoreBtn.disabled = true;
        }
        
        // Simuler un chargement asynchrone
        setTimeout(() => {
            this.displayProducts();
            this.isLoading = false;
            
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
            }
        }, 500);
    }
    
    // Méthodes utilitaires pour les favoris
    getFavorites() {
        return JSON.parse(localStorage.getItem('senartisans_favs')) || [];
    }
    
    isProductInFavorites(productId) {
        const favorites = this.getFavorites();
        return favorites.includes(productId.toString());
    }
    
    addToFavorites(productId) {
        const favorites = this.getFavorites();
        if (!favorites.includes(productId.toString())) {
            favorites.push(productId.toString());
            localStorage.setItem('senartisans_favs', JSON.stringify(favorites));
            this.updateFavCount();
        }
    }
    
    removeFromFavorites(productId) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(id => id !== productId.toString());
        localStorage.setItem('senartisans_favs', JSON.stringify(favorites));
        this.updateFavCount();
    }
    
    updateFavCount() {
        const favorites = this.getFavorites();
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

// Initialiser la page produits
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si on est sur la page produits
    if (document.getElementById('products-grid')) {
        window.productsPage = new ProductsPage();
    }
});