// Script para a página de login
document.addEventListener('DOMContentLoaded', function() {
    console.log("Login: DOM carregado, verificando autenticação");
    
    // Verificar se o Firebase está carregado
    if (typeof firebase === "undefined") {
        console.error("Login: Firebase não está disponível");
        alert("Erro ao carregar o Firebase. Por favor, recarregue a página.");
        return;
    }
    
    // Inicializar Firebase manualmente se não estiver inicializado
    if (!firebase.apps.length) {
        try {
            // Configuração do Firebase
            const firebaseConfig = {
                apiKey: "AIzaSyBb3lsCYBawSQsxS6SH2y_cDnoiPx2mynM",
                authDomain: "finans-9e6a7.firebaseapp.com",
                projectId: "finans-9e6a7",
                storageBucket: "finans-9e6a7.firebasestorage.app",
                messagingSenderId: "318247983677",
                appId: "1:318247983677:web:2b380639c2d280ae7e2854",
                measurementId: "G-PHHE52X63J"
            };
            
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase inicializado com sucesso na página de login!");
        } catch (error) {
            console.error("Erro ao inicializar Firebase na página de login:", error);
            alert("Erro ao inicializar o Firebase. Por favor, recarregue a página.");
            return;
        }
    }
    
    // Verificar se o usuário já está logado e redirecionar se estiver
    if (firebase.auth().currentUser) {
        console.log("Login: Usuário já está logado, redirecionando para home");
        window.location.href = '../index.html';
        return;
    }
    
    // Se não tiver usuário imediatamente, aguardar o evento onAuthStateChanged
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Login: Usuário autenticado via evento, redirecionando para home");
            window.location.href = '../index.html';
        }
    });
    
    // Referência ao formulário de login
    const loginForm = document.getElementById('loginForm');
    
    // Adicionar botão de login com Google diretamente no DOM
    const googleLoginContainer = document.getElementById('googleLoginContainer');
    if (googleLoginContainer) {
        // Criar o separador
        const separator = document.createElement('div');
        separator.className = 'separator';
        separator.innerHTML = '<span>ou</span>';
        googleLoginContainer.appendChild(separator);
        
        // Criar o botão de login com Google
        const googleButton = document.createElement('button');
        googleButton.type = 'button';
        googleButton.className = 'btn btn-google';
        googleButton.id = 'googleLogin';
        googleButton.innerHTML = '<img src="../Images/google-icon.png" alt="Google" class="google-icon"> Entrar com Google';
        googleButton.addEventListener('click', handleGoogleLogin);
        googleLoginContainer.appendChild(googleButton);
        
        console.log("Botão de login com Google adicionado com sucesso!");
    } else {
        console.error("Container para botão Google não encontrado!");
    }
    
    // Adicionar evento de submit ao formulário
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Adicionar evento para o link "Esqueceu a senha"
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', handleForgotPassword);
        }
    }
});

// Função para lidar com o login tradicional
async function handleLogin(event) {
    event.preventDefault();
    
    // Verificar se o Firebase foi inicializado
    if (typeof firebase === 'undefined' || !firebase.auth) {
        showMessage('Erro: Firebase não inicializado. Por favor, tente novamente mais tarde.', 'error');
        return;
    }
    
    // Obter valores do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.querySelector('input[name="remember"]').checked;
    
    // Validação básica
    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Configurar persistência com base na opção "Lembrar-me"
    const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    
    try {
        // Definir persistência
        await firebase.auth().setPersistence(persistence);
        
        // Tentar fazer login
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        
        // Login bem-sucedido
        showMessage('Login realizado com sucesso!', 'success');
        
        // Redirecionar para a página inicial após um pequeno delay para garantir que a mensagem seja vista
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
    } catch (error) {
        // Tratar erros específicos
        let errorMessage = 'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
        
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = 'Email ou senha incorretos. Por favor, verifique suas credenciais.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'O formato do email é inválido.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Esta conta foi desativada. Entre em contato com o suporte.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Muitas tentativas de login. Por favor, tente novamente mais tarde.';
                break;
        }
        
        showMessage(errorMessage, 'error');
        console.error('Erro de login:', error);
    }
}

// Função para lidar com o login com Google
async function handleGoogleLogin() {
    // Verificar se o Firebase foi inicializado
    if (typeof firebase === 'undefined' || !firebase.auth) {
        showMessage('Erro: Firebase não inicializado. Por favor, tente novamente mais tarde.', 'error');
        return;
    }
    
    try {
        // Criar provedor do Google
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // Adicionar escopo para perfil e email
        provider.addScope('profile');
        provider.addScope('email');
        
        // Fazer login com popup
        const result = await firebase.auth().signInWithPopup(provider);
        
        // Login bem-sucedido
        showMessage('Login com Google realizado com sucesso!', 'success');
        
        // Verificar se é o primeiro login (novo usuário)
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser && firebase.firestore) {
            // Salvar informações adicionais no Firestore
            const user = result.user;
            const db = firebase.firestore();
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else if (firebase.firestore) {
            // Atualizar último login
            const user = result.user;
            const db = firebase.firestore();
            await db.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Redirecionar para a página inicial após um pequeno delay para garantir que a mensagem seja vista
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
    } catch (error) {
        // Tratar erros
        let errorMessage = 'Ocorreu um erro ao fazer login com Google. Por favor, tente novamente.';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'O login foi cancelado. Por favor, tente novamente.';
        }
        
        showMessage(errorMessage, 'error');
        console.error('Erro de login com Google:', error);
    }
}

// Função para lidar com "Esqueceu a senha"
async function handleForgotPassword(event) {
    event.preventDefault();
    
    // Verificar se o Firebase foi inicializado
    if (typeof firebase === 'undefined' || !firebase.auth) {
        showMessage('Erro: Firebase não inicializado. Por favor, tente novamente mais tarde.', 'error');
        return;
    }
    
    // Obter o email do campo de email
    const email = document.getElementById('email').value;
    
    if (!email) {
        showMessage('Por favor, informe seu email para redefinir a senha.', 'error');
        return;
    }
    
    try {
        // Enviar email de redefinição de senha
        await firebase.auth().sendPasswordResetEmail(email);
        showMessage('Email de redefinição de senha enviado. Por favor, verifique sua caixa de entrada.', 'success');
    } catch (error) {
        let errorMessage = 'Ocorreu um erro ao enviar o email de redefinição. Por favor, tente novamente.';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Não encontramos uma conta com este email.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'O formato do email é inválido.';
        }
        
        showMessage(errorMessage, 'error');
        console.error('Erro ao redefinir senha:', error);
    }
}

// Função para exibir mensagens ao usuário
function showMessage(message, type) {
    // Verificar se já existe uma mensagem
    let messageElement = document.querySelector('.auth-message');
    
    // Se não existir, criar uma nova
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'auth-message';
        
        // Inserir antes do formulário
        const formContainer = document.querySelector('.auth-form-container');
        formContainer.insertBefore(messageElement, formContainer.firstChild);
    }
    
    // Definir classe e conteúdo
    messageElement.className = `auth-message ${type}`;
    messageElement.textContent = message;
    
    // Remover após alguns segundos
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
