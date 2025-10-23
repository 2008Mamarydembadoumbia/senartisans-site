// cart.js - Gestion du panier (version corrigée)

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('senartisans_cart')) || [];
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.setupEventListeners();
        // Mettre à jour le sidebar au chargement
        this.updateCartSidebar();
    }
    
    setupEventListeners() {
        // Boutons d'ajout au panier - délégation d'événements
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || 
                e.target.closest('.add-to-cart')) {
                const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productCard = btn.closest('.product-card');
                if (productCard) {
                    this.addToCart(productCard);
                }
            }
        });
        
        // Bouton d'ouverture du panier
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCart());
        }
        
        // Bouton de fermeture du panier
        const closeCartBtn = document.getElementById('close-cart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.closeCart());
        }
        
        // Overlay du panier
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }
        
        // Bouton de commande
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }
    
    addToCart(productCard) {
        const productId = productCard.querySelector('.add-to-cart').dataset.product;
        const productName = productCard.querySelector('h3').textContent;
        const productPriceText = productCard.querySelector('.product-price').textContent;
        const productPrice = parseInt(productPriceText.replace(/[^\d]/g, ''));
        const sizeSelect = productCard.querySelector('.size-select');
        const selectedSize = sizeSelect ? sizeSelect.value : '';
        
        console.log('Adding to cart:', { productId, productName, productPrice, selectedSize });
        
        // Vérifier si une taille est sélectionnée
        if (sizeSelect && !selectedSize) {
            alert('Veuillez sélectionner une taille avant d\'ajouter au panier.');
            sizeSelect.focus();
            return;
        }
        
        // Créer l'objet produit
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            size: selectedSize,
            image: productCard.querySelector('img').src,
            quantity: 1
        };
        
        // Vérifier si le produit est déjà dans le panier
        const existingItemIndex = this.items.findIndex(item => 
            item.id === productId && item.size === selectedSize
        );
        
        if (existingItemIndex > -1) {
            // Augmenter la quantité
            this.items[existingItemIndex].quantity += 1;
        } else {
            // Ajouter le nouveau produit
            this.items.push(product);
        }
        
        // Sauvegarder dans localStorage
        this.saveCart();
        
        // Mettre à jour l'interface
        this.updateCartCount();
        this.updateCartSidebar();
        
        // Feedback visuel
        const btn = productCard.querySelector('.add-to-cart');
        const originalText = btn.textContent;
        btn.textContent = '✓ Ajouté !';
        btn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
        
        // Ouvrir le panier automatiquement
        this.openCart();
    }
    
    // Méthode pour ajouter depuis les données (utilisée par d'autres pages)
    addToCartFromData(productData) {
        const existingItemIndex = this.items.findIndex(item => 
            item.id === productData.id && item.size === productData.size
        );
        
        if (existingItemIndex > -1) {
            this.items[existingItemIndex].quantity += productData.quantity;
        } else {
            this.items.push(productData);
        }
        
        this.saveCart();
        this.updateCartCount();
        this.updateCartSidebar();
        return true;
    }
    
    removeFromCart(productId, size) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.size === size)
        );
        
        this.saveCart();
        this.updateCartCount();
        this.updateCartSidebar();
    }
    
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            if (totalItems > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }
    
    updateCartSidebar() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total-amount');
        
        if (!cartItems) return;
        
        // Vider le contenu actuel
        cartItems.innerHTML = '';
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart" style="text-align: center; padding: 2rem; color: #888;">Votre panier est vide</p>';
            if (cartTotal) cartTotal.textContent = '0 FCFA';
            return;
        }
        
        // Ajouter chaque article
        let total = 0;
        this.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">
                        Taille: ${item.size} | Quantité: ${item.quantity}
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-price">${item.price.toLocaleString()} FCFA</span>
                        <button class="remove-item" data-id="${item.id}" data-size="${item.size}">
                            Supprimer
                        </button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Mettre à jour le total
        if (cartTotal) {
            cartTotal.textContent = `${total.toLocaleString()} FCFA`;
        }
        
        // Ajouter les écouteurs d'événements pour les boutons de suppression
        const removeBtns = cartItems.querySelectorAll('.remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const size = e.target.dataset.size;
                this.removeFromCart(productId, size);
            });
        });
    }
    
    openCart() {
        this.updateCartSidebar();
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    checkout() {
        if (this.items.length === 0) {
            alert('Votre panier est vide.');
            return;
        }
        
        // Construire le message WhatsApp
        let message = "Bonjour, je souhaite commander:%0A%0A";
        
        this.items.forEach(item => {
            message += `- ${item.name} (${item.size}) x${item.quantity} : ${(item.price * item.quantity).toLocaleString()} FCFA%0A`;
        });
        
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `%0ATotal: ${total.toLocaleString()} FCFA%0A%0AMerci !`;
        
        // Ouvrir WhatsApp
        window.open(`https://wa.me/221772390275?text=${message}`, '_blank');
    }
    
    saveCart() {
        localStorage.setItem('senartisans_cart', JSON.stringify(this.items));
    }
}

// Initialiser le panier au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new Cart();
});