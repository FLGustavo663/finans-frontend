// Script para a página de registro
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário já está logado e redirecionar se estiver
    if (typeof auth !== "undefined" && auth.currentUser) {
        window.location.href = "../index.html";
        return;
    }
    
    // Referência ao formulário de registro
    const registerForm = document.getElementById('registerForm');
    
    // Adicionar botão de registro com Google
    addGoogleRegisterButton();
    
    // Adicionar evento de submit ao formulário
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Função para adicionar o botão de registro com Google
function addGoogleRegisterButton() {
    const formContainer = document.querySelector('.auth-form-container');
    if (!formContainer) return;
    
    // Criar o separador
    const separator = document.createElement('div');
    separator.className = 'separator';
    separator.innerHTML = '<span>ou</span>';
    
    // Criar o botão de registro com Google
    const googleButton = document.createElement('button');
    googleButton.type = 'button';
    googleButton.className = 'btn btn-google';
    googleButton.id = 'googleRegister';
    
    // Adicionar ícone do Google (pode ser substituído por uma imagem)
    googleButton.innerHTML = '<img src="../Images/google-icon.png" alt="Google" class="google-icon"> Registrar com Google';
    
    // Adicionar evento de clique
    googleButton.addEventListener('click', handleGoogleRegister);
    
    // Inserir elementos após o botão de registro
    const registerButton = document.querySelector('.btn-full-width');
    if (registerButton) {
        registerButton.parentNode.insertBefore(separator, registerButton.nextSibling);
        registerButton.parentNode.insertBefore(googleButton, separator.nextSibling);
    }
}

// Função para lidar com o registro tradicional
async function handleRegister(event) {
    event.preventDefault();
    
    // Verificar se o Firebase foi inicializado
    if (typeof auth === 'undefined') {
        showMessage('Erro: Firebase não inicializado. Por favor, tente novamente mais tarde.', 'error');
        return;
    }
    
    // Obter valores do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validação básica
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem. Por favor, verifique.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    try {
        // Criar usuário com email e senha
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Atualizar o perfil do usuário com o nome
        await user.updateProfile({
            displayName: name
        });
        
        // Salvar informações adicionais no Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Enviar email de verificação
        await user.sendEmailVerification();
        
        // Registro bem-sucedido
        showMessage('Registro realizado com sucesso! Enviamos um email de verificação para o seu endereço.', 'success');
        
        // Redirecionar para a página inicial ou dashboard imediatamente
        window.location.href = '../index.html';
        
    } catch (error) {
        // Tratar erros específicos
        let errorMessage = 'Ocorreu um erro ao fazer o registro. Por favor, tente novamente.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este email já está sendo usado por outra conta.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'O formato do email é inválido.';
                break;
            case 'auth/weak-password':
                errorMessage = 'A senha é muito fraca. Use uma combinação de letras, números e símbolos.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'O registro com email e senha não está habilitado. Entre em contato com o suporte.';
                break;
        }
        
        showMessage(errorMessage, 'error');
        console.error('Erro de registro:', error);
    }
}

// Função para lidar com o registro com Google
async function handleGoogleRegister() {
    // Verificar se o Firebase foi inicializado
    if (typeof auth === 'undefined') {
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
        const result = await auth.signInWithPopup(provider);
        
        // Verificar se é o primeiro login (novo usuário)
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            // Salvar informações adicionais no Firestore
            const user = result.user;
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showMessage('Registro com Google realizado com sucesso!', 'success');
        } else {
            // Usuário já existe
            showMessage('Você já possui uma conta. Redirecionando para a página inicial...', 'success');
            
            // Atualizar último login
            const user = result.user;
            await db.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Redirecionar para a página inicial ou dashboard imediatamente
        window.location.href = '../index.html';
        
    } catch (error) {
        // Tratar erros
        let errorMessage = 'Ocorreu um erro ao registrar com Google. Por favor, tente novamente.';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'O registro foi cancelado. Por favor, tente novamente.';
        }
        
        showMessage(errorMessage, 'error');
        console.error('Erro de registro com Google:', error);
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
