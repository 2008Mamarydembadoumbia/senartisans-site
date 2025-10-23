// cart-page.js - Gestion de la page panier détaillée

class CartPage {
    constructor() {
        this.cart = [];
        this.init();
    }
    
    init() {
        this.loadCart();
        this.setupEventListeners();
        this.displayCart();
    }
    
    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('senartisans_cart')) || [];
    }
    
    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkout-page-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }
    
    displayCart() {
        const cartItemsList = document.getElementById('cart-items-list');
        const cartEmpty = document.getElementById('cart-empty');
        const itemsCount = document.getElementById('cart-items-count');
        const subtotalAmount = document.getElementById('subtotal-amount');
        const totalAmount = document.getElementById('total-amount');
        
        if (!cartItemsList || !cartEmpty) return;
        
        // Mettre à jour le compteur d'articles
        if (itemsCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            itemsCount.textContent = `${totalItems} article(s)`;
        }
        
        // Afficher ou masquer l'état vide
        if (this.cart.length === 0) {
            cartItemsList.style.display = 'none';
            cartEmpty.style.display = 'block';
            if (subtotalAmount) subtotalAmount.textContent = '0 FCFA';
            if (totalAmount) totalAmount.textContent = '0 FCFA';
            return;
        } else {
            cartItemsList.style.display = 'block';
            cartEmpty.style.display = 'none';
        }
        
        // Vider la liste
        cartItemsList.innerHTML = '';
        
        // Calculer les totaux
        let subtotal = 0;
        
        // Afficher chaque article
        this.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item-detailed';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">
                        Taille: ${item.size} | 
                        <span class="cart-item-price">${item.price.toLocaleString()} FCFA</span>
                    </div>
                    <div class="cart-item-actions-detailed">
                        <div class="quantity-controls">
                            <button class="qty-btn minus" data-index="${index}">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            Supprimer
                        </button>
                    </div>
                </div>
            `;
            cartItemsList.appendChild(cartItem);
        });
        
        // Mettre à jour les totaux
        if (subtotalAmount) subtotalAmount.textContent = `${subtotal.toLocaleString()} FCFA`;
        if (totalAmount) totalAmount.textContent = `${subtotal.toLocaleString()} FCFA`;
        
        // Initialiser les interactions
        this.initCartInteractions();
    }
    
    initCartInteractions() {
        this.initQuantityControls();
        this.initRemoveButtons();
    }
    
    initQuantityControls() {
        const minusBtns = document.querySelectorAll('.qty-btn.minus');
        const plusBtns = document.querySelectorAll('.qty-btn.plus');
        
        minusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.updateQuantity(index, -1);
            });
        });
        
        plusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.updateQuantity(index, 1);
            });
        });
    }
    
    initRemoveButtons() {
        const removeBtns = document.querySelectorAll('.remove-item');
        
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.removeItem(index);
            });
        });
    }
    
    updateQuantity(index, change) {
        if (index < 0 || index >= this.cart.length) return;
        
        const newQuantity = this.cart[index].quantity + change;
        
        if (newQuantity < 1) {
            this.removeItem(index);
            return;
        }
        
        if (newQuantity > 10) {
            alert('La quantité maximale est de 10 articles par produit.');
            return;
        }
        
        this.cart[index].quantity = newQuantity;
        this.saveCart();
        this.displayCart();
        
        // Mettre à jour le compteur dans le header
        this.updateCartCount();
    }
    
    removeItem(index) {
        if (index < 0 || index >= this.cart.length) return;
        
        this.cart.splice(index, 1);
        this.saveCart();
        this.displayCart();
        
        // Mettre à jour le compteur dans le header
        this.updateCartCount();
    }
    
    checkout() {
        if (this.cart.length === 0) {
            alert('Votre panier est vide.');
            return;
        }
        
        // Construire le message WhatsApp
        let message = "Bonjour, je souhaite commander:%0A%0A";
        
        this.cart.forEach(item => {
            message += `- ${item.name} (${item.size}) x${item.quantity} : ${(item.price * item.quantity).toLocaleString()} FCFA%0A`;
        });
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `%0ATotal: ${total.toLocaleString()} FCFA%0A%0AMerci !`;
        
        // Ouvrir WhatsApp
        window.open(`https://wa.me/221772390275?text=${message}`, '_blank');
    }
    
    saveCart() {
        localStorage.setItem('senartisans_cart', JSON.stringify(this.cart));
    }
    
    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            if (totalItems > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }
}

// Initialiser la page panier
document.addEventListener('DOMContentLoaded', function() {
    window.cartPage = new CartPage();
});