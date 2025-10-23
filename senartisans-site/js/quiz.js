// quiz.js - Gestion du quiz de style

class Quiz {
    constructor() {
        this.currentStep = 0;
        this.answers = {};
        this.products = [];
        this.init();
    }
    
    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.showStep(0); // Commencer par l'écran d'accueil
    }
    
    loadProducts() {
        // Produits pour les recommandations
        this.products = [
            {
                id: 1,
                name: "Parure Thioup Bleu Tradition",
                description: "Parure classique aux motifs ancestraux sur fond bleu profond, parfaite pour les amateurs d'authenticité.",
                price: 45000,
                image: "assets/images/produits/parure-1.jpg",
                features: [
                    "Motifs traditionnels fidèles à l'héritage sénégalais",
                    "Couleurs vives et contrastées",
                    "Idéal pour une déco chaleureuse et authentique",
                    "Parfait avec des meubles en bois naturel"
                ]
            },
            {
                id: 2,
                name: "Parure Thioup Vert Moderne",
                description: "Design contemporain alliant tradition et modernité, dans des tons vert aréol apaisants.",
                price: 42000,
                image: "assets/images/produits/parure-2.jpg",
                features: [
                    "Design épuré et contemporain",
                    "Couleurs douces et harmonieuses",
                    "Parfait pour les intérieurs modernes",
                    "S'accorde avec une déco minimaliste"
                ]
            },
            {
                id: 3,
                name: "Parure Thioup Indigo Premium",
                description: "Pièce d'exception en indigo naturel, pour ceux qui recherchent l'élégance et l'unicité.",
                price: 48000,
                image: "assets/images/produits/parure-3.jpg",
                features: [
                    "Teinture naturelle indigo de qualité supérieure",
                    "Pièce unique et exclusive",
                    "Parfait pour les amateurs d'artisanat raffiné",
                    "Apporte une touche d'élégance à votre chambre"
                ]
            },
            {
                id: 4,
                name: "Parure Thioup Multicolore Créative",
                description: "Explosion de couleurs vives pour les esprits créatifs et audacieux.",
                price: 45000,
                image: "assets/images/produits/parure-4.jpg",
                features: [
                    "Palette de couleurs énergiques et joyeuses",
                    "Idéal pour exprimer sa personnalité",
                    "Parfait pour les chambres d'enfants ou les esprits jeunes",
                    "Apporte de la gaieté à votre intérieur"
                ]
            }
        ];
    }
    
    setupEventListeners() {
        // Bouton de démarrage
        const startBtn = document.getElementById('start-quiz');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }
        
        // Navigation
        this.setupNavigation();
        
        // Options de quiz
        this.setupQuizOptions();
    }
    
    setupNavigation() {
        // Question 1
        const next1 = document.getElementById('next-1');
        const prev1 = document.getElementById('prev-1');
        
        if (next1) next1.addEventListener('click', () => this.nextStep());
        if (prev1) prev1.addEventListener('click', () => this.prevStep());
        
        // Question 2
        const next2 = document.getElementById('next-2');
        const prev2 = document.getElementById('prev-2');
        
        if (next2) next2.addEventListener('click', () => this.nextStep());
        if (prev2) prev2.addEventListener('click', () => this.prevStep());
        
        // Question 3
        const next3 = document.getElementById('next-3');
        const prev3 = document.getElementById('prev-3');
        
        if (next3) next3.addEventListener('click', () => this.showResults());
        if (prev3) prev3.addEventListener('click', () => this.prevStep());
        
        // Résultats
        const restartBtn = document.getElementById('restart-quiz');
        const viewProductBtn = document.getElementById('view-product');
        
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartQuiz());
        if (viewProductBtn) viewProductBtn.addEventListener('click', () => this.viewRecommendedProduct());
    }
    
    setupQuizOptions() {
        // Options ambiance
        const ambianceOptions = document.querySelectorAll('#question-1 .option-card');
        ambianceOptions.forEach(option => {
            option.addEventListener('click', () => {
                ambianceOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.answers.ambiance = option.dataset.value;
            });
        });
        
        // Options couleurs
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.answers.couleur = option.dataset.value;
            });
        });
        
        // Options style de vie
        const lifestyleOptions = document.querySelectorAll('.lifestyle-option');
        lifestyleOptions.forEach(option => {
            option.addEventListener('click', () => {
                lifestyleOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.answers.lifestyle = option.dataset.value;
            });
        });
    }
    
    startQuiz() {
        this.currentStep = 1;
        this.showStep(1);
    }
    
    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
    
    showStep(stepIndex) {
        // Masquer toutes les étapes
        const steps = document.querySelectorAll('.quiz-step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Afficher l'étape courante
        const currentStep = document.getElementById(this.getStepId(stepIndex));
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Mettre à jour la barre de progression
        this.updateProgressBar(stepIndex);
    }
    
    getStepId(stepIndex) {
        const stepIds = [
            'quiz-start',
            'question-1',
            'question-2',
            'question-3',
            'quiz-results'
        ];
        return stepIds[stepIndex] || 'quiz-start';
    }
    
    updateProgressBar(stepIndex) {
        const progressFill = document.querySelector('.progress-fill');
        if (!progressFill) return;
        
        let progress = 0;
        switch(stepIndex) {
            case 1: progress = 0; break;
            case 2: progress = 33; break;
            case 3: progress = 66; break;
            case 4: progress = 100; break;
            default: progress = 0;
        }
        
        progressFill.style.width = `${progress}%`;
    }
    
    showResults() {
        // Vérifier que toutes les questions sont répondues
        if (!this.answers.ambiance || !this.answers.couleur || !this.answers.lifestyle) {
            alert('Veuillez répondre à toutes les questions avant de voir les résultats.');
            return;
        }
        
        this.currentStep = 4;
        this.showStep(4);
        this.displayRecommendation();
    }
    
    displayRecommendation() {
        const recommendedProduct = this.getRecommendedProduct();
        
        // Mettre à jour l'affichage
        const resultImage = document.getElementById('result-image');
        const resultTitle = document.getElementById('result-title');
        const resultDescription = document.getElementById('result-description');
        const resultPrice = document.getElementById('result-price');
        const resultFeatures = document.getElementById('result-features');
        const viewProductBtn = document.getElementById('view-product');
        
        if (resultImage) resultImage.src = recommendedProduct.image;
        if (resultTitle) resultTitle.textContent = recommendedProduct.name;
        if (resultDescription) resultDescription.textContent = recommendedProduct.description;
        if (resultPrice) resultPrice.textContent = `${recommendedProduct.price.toLocaleString()} FCFA`;
        
        if (resultFeatures) {
            resultFeatures.innerHTML = recommendedProduct.features
                .map(feature => `<li>${feature}</li>`)
                .join('');
        }
        
        if (viewProductBtn) {
            viewProductBtn.dataset.productId = recommendedProduct.id;
        }
    }
    
    getRecommendedProduct() {
        // Logique de recommandation basée sur les réponses
        let productIndex = 0;
        
        // Ambiance traditionnelle + couleur terre/bleu + lifestyle familial/zen → Produit traditionnel
        if (this.answers.ambiance === 'traditionnel' && 
            (this.answers.couleur === 'bleu' || this.answers.couleur === 'terre') &&
            (this.answers.lifestyle === 'familial' || this.answers.lifestyle === 'zen')) {
            productIndex = 0;
        }
        // Ambiance moderne + couleur vert/multicolore + lifestyle urbain/créatif → Produit moderne
        else if (this.answers.ambiance === 'moderne' && 
                 (this.answers.couleur === 'multicolore' || this.answers.couleur === 'vert') &&
                 (this.answers.lifestyle === 'urbain' || this.answers.lifestyle === 'creatif')) {
            productIndex = 1;
        }
        // Ambiance audacieux + couleur indigo + lifestyle créatif/zen → Produit premium
        else if (this.answers.ambiance === 'audacieux' && 
                 this.answers.couleur === 'indigo' &&
                 (this.answers.lifestyle === 'creatif' || this.answers.lifestyle === 'zen')) {
            productIndex = 2;
        }
        // Autres combinaisons → Produit créatif
        else {
            productIndex = 3;
        }
        
        return this.products[productIndex];
    }
    
    viewRecommendedProduct() {
        const viewProductBtn = document.getElementById('view-product');
        const productId = viewProductBtn ? viewProductBtn.dataset.productId : 1;
        
        // Rediriger vers la page produit (dans un cas réel, on utiliserait l'ID)
        window.location.href = `produit.html?id=${productId}`;
    }
    
    restartQuiz() {
        this.currentStep = 0;
        this.answers = {};
        this.showStep(0);
        
        // Réinitialiser les sélections
        const selectedOptions = document.querySelectorAll('.selected');
        selectedOptions.forEach(option => option.classList.remove('selected'));
    }
}

// Initialiser le quiz
document.addEventListener('DOMContentLoaded', function() {
    window.quiz = new Quiz();
});