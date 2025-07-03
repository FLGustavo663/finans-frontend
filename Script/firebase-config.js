// Arquivo de configuração do Firebase

// Configuração real do Firebase fornecida pelo usuário
const firebaseConfig = {
    apiKey: "AIzaSyBb3lsCYBawSQsxS6SH2y_cDnoiPx2mynM",
    authDomain: "finans-9e6a7.firebaseapp.com",
    projectId: "finans-9e6a7",
    storageBucket: "finans-9e6a7.firebasestorage.app",
    messagingSenderId: "318247983677",
    appId: "1:318247983677:web:2b380639c2d280ae7e2854",
    measurementId: "G-PHHE52X63J"
};

// Inicialização do Firebase (mantendo a estrutura original do script)
function initializeFirebase() {
    // Verificar se o Firebase já foi inicializado
    if (!firebase.apps.length) {
        try {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase inicializado com sucesso!");

            // Inicializar serviços do Firebase após a inicialização do app
            const auth = firebase.auth();
            const db = firebase.firestore();

            // Exportar para uso em outros arquivos
            window.auth = auth;
            window.db = db;

            // Verificar estado de autenticação após inicialização
            checkAuthState();

        } catch (error) {
            console.error("Erro ao inicializar Firebase:", error);
            // Informar ao usuário sobre o erro de inicialização, se necessário

        }
    } else {
        // Se já inicializado, apenas garantir que as instâncias estão disponíveis
        window.auth = firebase.auth();
        window.db = firebase.firestore();
        console.log("Firebase já estava inicializado.");
        checkAuthState(); // Verificar estado mesmo se já inicializado
    }
}

// Função para verificar o estado de autenticação do usuário
function checkAuthState() {
    // Garante que auth está definido antes de chamar onAuthStateChanged
    if (firebase.auth) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log("Usuário está logado:", user.email);

                // Atualizar UI para usuário logado
                updateAuthUI(user);
            } else {
                console.log("Usuário não está logado");
                // Lógica para usuário deslogado
                updateAuthUI(null);
            }
        });
    } else {
        console.warn("Firebase Auth não está pronto para verificar estado.");
        // Tentar novamente após um pequeno atraso
        setTimeout(checkAuthState, 500);
    }
}

// Função para atualizar a UI com base no estado de autenticação
function updateAuthUI(user) {
    const authButtonsDiv = document.querySelector('.auth-buttons');
    const userProfileDiv = document.querySelector('.user-profile'); // Supondo que exista um div para perfil

    // Elementos a serem ocultados quando o usuário estiver logado
    const ctaSection = document.getElementById('cta-section');
    const comecarAgoraBtn = document.getElementById('comecar-agora-btn');

    if (authButtonsDiv) {
        if (user) {
            // Esconder botões Entrar/Registrar
            authButtonsDiv.style.display = 'none';

            // Ocultar seção CTA e botão "Começar Agora" quando usuário estiver logado
            if (ctaSection) {
                ctaSection.style.display = 'none';
            }
            if (comecarAgoraBtn) {
                comecarAgoraBtn.style.display = 'none';
            }

            // Extrair primeiro nome
            let firstName = user.email.split('@')[0]; // Fallback para parte do email antes do @
            if (user.displayName) {
                firstName = user.displayName.split(" ")[0];
            }

            // URL da foto de perfil (usar foto padrão se não houver)
            let photoURL = user.photoURL || 'https://via.placeholder.com/40x40/27ae60/ffffff?text=' + firstName.charAt(0).toUpperCase();

            // Mostrar informações do usuário
            if (!userProfileDiv) {
                const profileDiv = document.createElement('div');
                profileDiv.className = 'user-profile';

                // Determinar o caminho correto para a página de perfil
                let perfilPath;
                if (window.location.pathname.includes('/Pages/')) {
                    perfilPath = "perfil.html";
                } else {
                    perfilPath = "Pages/perfil.html";
                }

                profileDiv.innerHTML = `
                    <div class="user-profile-info">
                        <img src="${photoURL}" alt="Foto de perfil" class="user-profile-photo" onerror="this.src='https://via.placeholder.com/40x40/27ae60/ffffff?text=${firstName.charAt(0).toUpperCase()}'">
                        <a href="${perfilPath}" class="user-profile-name" id="profileLink">${firstName}</a>
                    </div>
                    <button id="logoutButton" class="btn btn-outline">Sair</button>
                `;
                authButtonsDiv.parentNode.insertBefore(profileDiv, authButtonsDiv.nextSibling);

                // Adicionar evento ao link do perfil
                document.getElementById('profileLink').addEventListener('click', function(e) {
                    if (!firebase.auth().currentUser) {
                        e.preventDefault();
                        alert("Você precisa estar logado para acessar o perfil.");
                        window.location.href = perfilPath.includes('Pages/') ? 'Pages/login.html' : 'login.html';
                    }
                });

                // Adicionar evento ao botão de logout
                document.getElementById('logoutButton').addEventListener('click', () => {
                    firebase.auth().signOut().then(() => {
                        console.log('Logout realizado com sucesso.');
                        window.location.reload();
                    }).catch(error => {
                        console.error('Erro no logout:', error);
                    });
                });
            } else {
                userProfileDiv.style.display = 'flex';

                // Atualizar informações do usuário se o elemento já existir
                const profilePhoto = userProfileDiv.querySelector('.user-profile-photo');
                const profileLink = userProfileDiv.querySelector('.user-profile-name');
                
                if (profilePhoto) {
                    profilePhoto.src = photoURL;
                    profilePhoto.alt = `Foto de perfil de ${firstName}`;
                }
                
                if (profileLink) {
                    profileLink.textContent = firstName;

                    let perfilPath;
                    if (window.location.pathname.includes('/Pages/')) {
                        perfilPath = "perfil.html";
                    } else {
                        perfilPath = "Pages/perfil.html";
                    }

                    if (profileLink.getAttribute('href') !== perfilPath) {
                        profileLink.setAttribute('href', perfilPath);
                    }
                }
            }

        } else {
            // Mostrar botões Entrar/Registrar
            authButtonsDiv.style.display = 'flex';
            
            // Mostrar seção CTA e botão "Começar Agora" quando usuário não estiver logado
            if (ctaSection) {
                ctaSection.style.display = 'block';
            }
            if (comecarAgoraBtn) {
                comecarAgoraBtn.style.display = 'inline-block';
            }
            
            // Esconder informações do usuário
            if (userProfileDiv) {
                userProfileDiv.style.display = 'none';
            }
        }
    }
}


// Carregar os scripts do Firebase via CDN (mantendo a abordagem original)
document.addEventListener('DOMContentLoaded', function() {
    // Carregar o Firebase App (obrigatório)
    const firebaseAppScript = document.createElement('script');
    // Usar uma versão compatível com firestore e auth v8 (ou ajustar imports se usar v9 compat)
    firebaseAppScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
    firebaseAppScript.onload = function() {
        // Após carregar o App, carregar os outros serviços
        const scripts = [
            'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js',
            'https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js',
            // 'https://www.gstatic.com/firebasejs/8.10.0/firebase-analytics.js' // Analytics pode ser adicionado se necessário
        ];

        let loaded = 0;
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Garante a ordem de carregamento se houver dependências
            script.onload = function() {
                loaded++;
                if (loaded === scripts.length) {
                    // Todos os scripts foram carregados, inicializar o Firebase
                    initializeFirebase();
                }
            };
            document.head.appendChild(script);
        });
    };
    document.head.appendChild(firebaseAppScript);
});
