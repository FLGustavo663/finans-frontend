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

    if (authButtonsDiv) {
        if (user) {
            // Esconder botões Entrar/Registrar
            authButtonsDiv.style.display = 'none';

            // Extrair primeiro nome
            let firstName = user.email; // Fallback para email
            if (user.displayName) {
                firstName = user.displayName.split(" ")[0];
            }

            // Mostrar informações do usuário (exemplo)
            if (!userProfileDiv) {
                const profileDiv = document.createElement('div');
                profileDiv.className = 'user-profile';

                // Determinar o caminho correto para a página de perfil
                // Verificar se estamos na página principal ou em uma subpágina
                let perfilPath;
                if (window.location.pathname.includes('/Pages/')) {
                    // Estamos em uma subpágina, o perfil está no mesmo diretório
                    perfilPath = "perfil.html";
                } else {
                    // Estamos na página principal, o perfil está no diretório Pages
                    perfilPath = "Pages/perfil.html";
                }

                console.log("Caminho para perfil definido como:", perfilPath);

                profileDiv.innerHTML = `
                    <a href="${perfilPath}" class="profile-link" id="profileLink">${firstName}</a>
                    <button id="logoutButton" class="btn btn-outline">Sair</button>
                `;
                authButtonsDiv.parentNode.insertBefore(profileDiv, authButtonsDiv.nextSibling);

                // Adicionar evento ao link do perfil para garantir que funcione
                document.getElementById('profileLink').addEventListener('click', function(e) {
                    // Verificar se o usuário está autenticado antes de navegar
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
                        window.location.reload(); // Recarregar a página ou redirecionar
                    }).catch(error => {
                        console.error('Erro no logout:', error);
                    });
                });
            } else {
                userProfileDiv.style.display = 'flex'; // Ou 'block'

                // Atualizar o nome do usuário se o elemento já existir
                const profileLink = userProfileDiv.querySelector('.profile-link');
                if (profileLink) {
                    profileLink.textContent = firstName;

                    // Verificar e atualizar o href se necessário
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
            authButtonsDiv.style.display = 'flex'; // Ou 'block'
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
