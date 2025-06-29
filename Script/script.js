// Funcionalidade do menu hambúrguer
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar nos links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Simulador de Orçamento (orcamento.html)
    const budgetSimulatorForm = document.getElementById("budgetSimulatorForm");
    const budgetResultDiv = document.getElementById("budgetResult");
    if (budgetSimulatorForm && budgetResultDiv) {
        budgetSimulatorForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const monthlyIncome = parseFloat(document.getElementById("monthlyIncome").value);
            if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
                alert("Por favor, insira um valor de renda mensal válido.");
                return;
            }

            const necessities = monthlyIncome * 0.50;
            const personalSpends = monthlyIncome * 0.30;
            const savingsInvestments = monthlyIncome * 0.20;

            document.getElementById("necessitiesAmount").textContent = `R$ ${necessities.toFixed(2).replace(".", ",")}`;
            document.getElementById("personalSpendsAmount").textContent = `R$ ${personalSpends.toFixed(2).replace(".", ",")}`;
            document.getElementById("savingsInvestmentsAmount").textContent = `R$ ${savingsInvestments.toFixed(2).replace(".", ",")}`;
            
            budgetResultDiv.style.display = "block";

            // Verifica se o usuário está logado para mostrar o botão Salvar
            const saveBudgetBtn = document.getElementById("saveBudgetBtn");
            if (window.auth && window.auth.currentUser && saveBudgetBtn) {
                saveBudgetBtn.style.display = "block";
                saveBudgetBtn.onclick = () => {
                    alert("Funcionalidade Salvar Orçamento (Placeholder): Este orçamento seria salvo no Firebase.");
                    console.log("Salvar orçamento:", { monthlyIncome, necessities, personalSpends, savingsInvestments });
                };
            } else if (saveBudgetBtn) {
                saveBudgetBtn.style.display = "none";
            }
        });
    }

    // Filtros da Página de Indicações (indicacoes.html)
    const filterButtons = document.querySelectorAll(".filter-buttons .btn-filter");
    const recommendationCards = document.querySelectorAll(".recommendations-grid .recommendation-card");
    if (filterButtons.length > 0 && recommendationCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                const filter = button.dataset.filter;

                recommendationCards.forEach(card => {
                    if (filter === "all" || card.dataset.category === filter) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
        
        const initialFilter = document.querySelector('.filter-buttons .btn-filter[data-filter="all"]');
        if (initialFilter) {
            initialFilter.click();
        }
    }

    // Formulário de Newsletter (footer)
    const newsletterForms = document.querySelectorAll(".newsletter-form"); 
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const emailInput = e.target.querySelector("input[type='email']");
                if (emailInput) {
                    const email = emailInput.value;
                    alert(`Inscrição na Newsletter (Placeholder): Email ${email} seria registrado.`);
                    console.log(`Email para newsletter: ${email}`);
                    form.reset();
                }
            });
        });
    }

    // Funcionalidade para mostrar/esconder perfil do usuário logado
    function updateUserProfile() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const authButtons = document.querySelector('.auth-buttons');
        
        if (user && authButtons) {
            authButtons.innerHTML = `
                <div class="user-profile">
                    <span>Olá, ${user.name}</span>
                    <a href="/pages/perfil.html" class="profile-link">Perfil</a>
                    <button onclick="logout()" class="btn btn-outline">Sair</button>
                </div>
            `;
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // Verificar se há usuário logado ao carregar a página
    updateUserProfile();

    // Adiciona um listener para quando o estado de autenticação mudar
    if (window.auth) {
         window.auth.onAuthStateChanged(user => {
            const budgetForm = document.getElementById("budgetSimulatorForm");
            if (budgetForm) {
                 const saveBudgetBtn = document.getElementById("saveBudgetBtn");
                 if (user && saveBudgetBtn) {
                     saveBudgetBtn.style.display = "block";
                 } else if (saveBudgetBtn) {
                     saveBudgetBtn.style.display = "none";
                 }
            }
         });
    }
});

