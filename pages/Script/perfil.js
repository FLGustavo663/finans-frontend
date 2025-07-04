// Script para a página de perfil
// MODIFICADO: Adicionado exibição do histórico completo do quiz

document.addEventListener("DOMContentLoaded", function() {
    console.log("Perfil: DOM carregado, verificando autenticação");
    
    // Verificar se o Firebase está carregado
    if (typeof firebase === "undefined") {
        console.error("Perfil: Firebase não está disponível");
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
            console.log("Firebase inicializado com sucesso na página de perfil!");
        } catch (error) {
            console.error("Erro ao inicializar Firebase na página de perfil:", error);
            alert("Erro ao inicializar o Firebase. Por favor, recarregue a página.");
            return;
        }
    }
    
    // Verificar se o usuário está logado diretamente
    if (firebase.auth().currentUser) {
        console.log("Perfil: Usuário já está autenticado:", firebase.auth().currentUser.email);
        loadUserProfile(firebase.auth().currentUser);
        return;
    }
    
    // Se não tiver usuário imediatamente, aguardar o evento onAuthStateChanged
    console.log("Perfil: Aguardando verificação de autenticação...");
    
    // Adicionar um timeout para garantir que a verificação não fique presa
    let authCheckTimeout = setTimeout(() => {
        console.log("Perfil: Timeout na verificação de autenticação");
        redirectToLogin();
    }, 5000); // 5 segundos de timeout
    
    firebase.auth().onAuthStateChanged(user => {
        // Limpar o timeout quando receber resposta
        clearTimeout(authCheckTimeout);
        
        if (user) {
            // Usuário está logado, carregar dados do perfil
            console.log("Perfil: Usuário autenticado via evento:", user.email);
            loadUserProfile(user);
        } else {
            // Usuário não está logado, redirecionar para login
            console.log("Perfil: Usuário não autenticado, redirecionando para login");
            redirectToLogin();
        }
    });

    // Configurar eventos dos botões
    const editProfileBtn = document.getElementById("editProfileBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const editForm = document.getElementById("editForm");

    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", showEditForm);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", hideEditForm);
    }

    if (editForm) {
        editForm.addEventListener("submit", handleProfileUpdate);
    }
});

// Função para redirecionar para a página de login
function redirectToLogin() {
    console.log("Perfil: Redirecionando para login");
    window.location.href = "login.html";
}

// Função para carregar os dados do perfil do usuário
async function loadUserProfile(user) {
    try {
        console.log("Perfil: Carregando dados do usuário:", user.email);
        
        // Elementos do DOM
        const profileName = document.getElementById("profileName");
        const profileEmail = document.getElementById("profileEmail");
        const profileMemberSince = document.getElementById("profileMemberSince");
        const profileAvatar = document.getElementById("profileAvatar");
        const editName = document.getElementById("editName");
        const editEmail = document.getElementById("editEmail");
        
        // Carregar estatísticas do quiz
        loadQuizStats(user.uid);
        
        // Carregar histórico do quiz
        loadQuizHistory(user.uid);

        // Preencher informações básicas
        if (profileName) profileName.textContent = user.displayName || "Usuário";
        if (profileEmail) profileEmail.textContent = user.email;
        if (editName) editName.value = user.displayName || "";
        if (editEmail) editEmail.value = user.email;

        // Criar avatar com iniciais ou foto
        if (profileAvatar) {
            if (user.photoURL) {
                profileAvatar.innerHTML = `<img src="${user.photoURL}" alt="Avatar">`;
            } else {
                const initials = getInitials(user.displayName || user.email);
                profileAvatar.textContent = initials;
            }
        }

        // Buscar dados adicionais do Firestore
        if (firebase.firestore) {
            const db = firebase.firestore();
            try {
                const userDoc = await db.collection("users").doc(user.uid).get();
                
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    
                    // Data de criação da conta
                    if (userData.createdAt && profileMemberSince) {
                        const createdDate = userData.createdAt.toDate();
                        profileMemberSince.textContent = `Membro desde: ${formatDate(createdDate)}`;
                    }
                } else {
                    // Se o documento não existir, criar um
                    await db.collection("users").doc(user.uid).set({
                        name: user.displayName || "Usuário",
                        email: user.email,
                        photoURL: user.photoURL || null,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    if (profileMemberSince) {
                        profileMemberSince.textContent = `Membro desde: ${formatDate(new Date())}`;
                    }
                }
            } catch (firestoreError) {
                console.error("Perfil: Erro ao acessar Firestore:", firestoreError);
                // Continuar mesmo com erro no Firestore
                if (profileMemberSince) {
                    profileMemberSince.textContent = "Membro desde: -";
                }
            }
        }
    } catch (error) {
        console.error("Perfil: Erro ao carregar perfil:", error);
    }
}

// Função para carregar estatísticas do quiz
async function loadQuizStats(userId) {
    try {
        const quizTotalScore = document.getElementById("quizTotalScore");
        const quizBestScore = document.getElementById("quizBestScore");
        const quizCompleted = document.getElementById("quizCompleted");
        
        if (firebase.firestore) {
            const db = firebase.firestore();
            try {
                // Buscar estatísticas do quiz no Firestore
                const quizStatsDoc = await db.collection("quizStats").doc(userId).get();
                
                if (quizStatsDoc.exists) {
                    const stats = quizStatsDoc.data();
                    
                    if (quizTotalScore) quizTotalScore.textContent = stats.totalScore || 0;
                    if (quizBestScore) quizBestScore.textContent = stats.bestScore || 0;
                    if (quizCompleted) quizCompleted.textContent = stats.completed || 0;
                } else {
                    // Se não existir documento de estatísticas, criar um
                    await db.collection("quizStats").doc(userId).set({
                        totalScore: 0,
                        bestScore: 0,
                        completed: 0,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    if (quizTotalScore) quizTotalScore.textContent = "0";
                    if (quizBestScore) quizBestScore.textContent = "0";
                    if (quizCompleted) quizCompleted.textContent = "0";
                }
            } catch (firestoreError) {
                console.error("Perfil: Erro ao acessar estatísticas do quiz:", firestoreError);
                // Definir valores padrão em caso de erro
                if (quizTotalScore) quizTotalScore.textContent = "0";
                if (quizBestScore) quizBestScore.textContent = "0";
                if (quizCompleted) quizCompleted.textContent = "0";
            }
        }
    } catch (error) {
        console.error("Perfil: Erro ao carregar estatísticas do quiz:", error);
    }
}

// NOVA FUNÇÃO: Carregar histórico completo do quiz
async function loadQuizHistory(userId) {
    try {
        const quizHistoryContainer = document.getElementById("quizHistoryContainer");
        
        if (!quizHistoryContainer) {
            console.log("Perfil: Container do histórico do quiz não encontrado no HTML");
            return;
        }
        
        if (firebase.firestore) {
            const db = firebase.firestore();
            try {
                // Buscar histórico do quiz no documento do usuário
                const userDoc = await db.collection("users").doc(userId).get();
                
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const quizHistory = userData.quizHistory || [];
                    
                    if (quizHistory.length > 0) {
                        // Ordenar por data (mais recente primeiro)
                        quizHistory.sort((a, b) => {
                            if (a.completedAt && b.completedAt) {
                                return b.completedAt.toDate() - a.completedAt.toDate();
                            }
                            return 0;
                        });
                        
                        // Limitar aos últimos 10 resultados
                        const recentHistory = quizHistory.slice(0, 10);
                        
                        // Gerar HTML do histórico
                        let historyHTML = '<h3>Histórico de Quizzes</h3>';
                        
                        recentHistory.forEach((quiz, index) => {
                            const date = quiz.completedAt ? formatDateTime(quiz.completedAt.toDate()) : 'Data não disponível';
                            const timeSpent = quiz.timeSpent ? formatTime(quiz.timeSpent) : 'N/A';
                            
                            historyHTML += `
                                <div class="quiz-history-item">
                                    <div class="quiz-history-header">
                                        <h4>${quiz.quizTitle || quiz.quizId}</h4>
                                        <span class="quiz-date">${date}</span>
                                    </div>
                                    <div class="quiz-history-stats">
                                        <span class="quiz-score">Pontuação: ${quiz.score}/${quiz.totalQuestions} (${quiz.percentage}%)</span>
                                        <span class="quiz-time">Tempo: ${timeSpent}</span>
                                    </div>
                                    <button class="quiz-details-btn" onclick="toggleQuizDetails(${index})">
                                        Ver Detalhes
                                    </button>
                                    <div id="quiz-details-${index}" class="quiz-details" style="display: none;">
                                        ${generateQuizDetailsHTML(quiz.answers || [])}
                                    </div>
                                </div>
                            `;
                        });
                        
                        quizHistoryContainer.innerHTML = historyHTML;
                    } else {
                        quizHistoryContainer.innerHTML = `
                            <h3>Histórico de Quizzes</h3>
                            <p class="no-history">Você ainda não completou nenhum quiz. <a href="quiz.html">Faça seu primeiro quiz!</a></p>
                        `;
                    }
                } else {
                    quizHistoryContainer.innerHTML = `
                        <h3>Histórico de Quizzes</h3>
                        <p class="no-history">Você ainda não completou nenhum quiz. <a href="quiz.html">Faça seu primeiro quiz!</a></p>
                    `;
                }
            } catch (firestoreError) {
                console.error("Perfil: Erro ao acessar histórico do quiz:", firestoreError);
                quizHistoryContainer.innerHTML = `
                    <h3>Histórico de Quizzes</h3>
                    <p class="error-message">Erro ao carregar histórico. Tente recarregar a página.</p>
                `;
            }
        }
    } catch (error) {
        console.error("Perfil: Erro ao carregar histórico do quiz:", error);
    }
}

// NOVA FUNÇÃO: Gerar HTML dos detalhes das respostas
function generateQuizDetailsHTML(answers) {
    if (!answers || answers.length === 0) {
        return '<p>Detalhes das respostas não disponíveis.</p>';
    }
    
    let detailsHTML = '<div class="quiz-answers">';
    
    answers.forEach((answer, index) => {
        const statusClass = answer.isCorrect ? 'correct' : 'incorrect';
        const statusIcon = answer.isCorrect ? '✓' : '✗';
        
        detailsHTML += `
            <div class="answer-item ${statusClass}">
                <div class="answer-header">
                    <span class="answer-status">${statusIcon}</span>
                    <span class="question-number">Pergunta ${index + 1}</span>
                </div>
                <div class="answer-content">
                    <p class="question-text">${answer.question}</p>
                    <p class="selected-answer">Sua resposta: ${answer.selectedAnswer}</p>
                    ${!answer.isCorrect ? `<p class="correct-answer">Resposta correta: ${answer.correctAnswer}</p>` : ''}
                </div>
            </div>
        `;
    });
    
    detailsHTML += '</div>';
    return detailsHTML;
}

// NOVA FUNÇÃO: Alternar exibição dos detalhes do quiz
function toggleQuizDetails(index) {
    const detailsElement = document.getElementById(`quiz-details-${index}`);
    const button = event.target;
    
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
        button.textContent = 'Ocultar Detalhes';
    } else {
        detailsElement.style.display = 'none';
        button.textContent = 'Ver Detalhes';
    }
}

// Função para obter as iniciais do nome
function getInitials(name) {
    if (!name) return "?";
    
    const parts = name.split(" ");
    if (parts.length === 1) {
        return name.charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Função para formatar data
function formatDate(date) {
    if (!date) return "-";
    
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// NOVA FUNÇÃO: Formatar data e hora
function formatDateTime(date) {
    if (!date) return "-";
    
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// NOVA FUNÇÃO: Formatar tempo em segundos para formato legível
function formatTime(seconds) {
    if (!seconds || seconds < 0) return "0s";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}

// Função para mostrar o formulário de edição
function showEditForm() {
    const profileEditForm = document.getElementById("profileEditForm");
    if (profileEditForm) {
        profileEditForm.style.display = "block";
    }
}

// Função para esconder o formulário de edição
function hideEditForm() {
    const profileEditForm = document.getElementById("profileEditForm");
    if (profileEditForm) {
        profileEditForm.style.display = "none";
    }
}

// Função para atualizar o perfil
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    if (!firebase.auth().currentUser) {
        console.error("Perfil: Usuário não está logado");
        return;
    }
    
    const name = document.getElementById("editName").value.trim();
    
    if (!name) {
        alert("Por favor, informe seu nome.");
        return;
    }
    
    try {
        // Atualizar displayName no Auth
        await firebase.auth().currentUser.updateProfile({
            displayName: name
        });
        
        // Atualizar nome no Firestore
        if (firebase.firestore) {
            const db = firebase.firestore();
            try {
                await db.collection("users").doc(firebase.auth().currentUser.uid).update({
                    name: name,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (firestoreError) {
                console.error("Perfil: Erro ao atualizar perfil no Firestore:", firestoreError);
                // Continuar mesmo com erro no Firestore
            }
        }
        
        // Atualizar UI
        const profileName = document.getElementById("profileName");
        if (profileName) profileName.textContent = name;
        
        // Atualizar avatar com novas iniciais
        const profileAvatar = document.getElementById("profileAvatar");
        if (profileAvatar && !firebase.auth().currentUser.photoURL) {
            profileAvatar.textContent = getInitials(name);
        }
        
        // Esconder formulário
        hideEditForm();
        
        // Mostrar mensagem de sucesso
        alert("Perfil atualizado com sucesso!");
        
    } catch (error) {
        console.error("Perfil: Erro ao atualizar perfil:", error);
        alert("Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.");
    }
}

// Função para fazer logout
function handleLogout() {
    if (firebase.auth) {
        firebase.auth().signOut().then(() => {
            console.log("Perfil: Logout realizado com sucesso.");
            window.location.href = "../index.html";
        }).catch(error => {
            console.error("Perfil: Erro no logout:", error);
            alert("Ocorreu um erro ao sair. Por favor, tente novamente.");
        });
    }
}



// Funcionalidades dos Modais de Edição de Perfil

// Variáveis globais para os modais
let selectedPhoto = null;

// Inicializar eventos dos modais quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    initializeModalEvents();
});

function initializeModalEvents() {
    // Modal principal de edição de perfil
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileModal = document.getElementById("editProfileModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const editProfileForm = document.getElementById("editProfileForm");
    
    // Modal de seleção de foto
    const changePhotoBtn = document.getElementById("changePhotoBtn");
    const photoSelectionModal = document.getElementById("photoSelectionModal");
    const closePhotoModal = document.getElementById("closePhotoModal");
    const cancelPhotoBtn = document.getElementById("cancelPhotoBtn");
    const selectPhotoBtn = document.getElementById("selectPhotoBtn");
    const photoOptions = document.querySelectorAll(".photo-option");
    
    // Eventos do modal principal
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", openEditProfileModal);
    }
    
    if (closeModal) {
        closeModal.addEventListener("click", closeEditProfileModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeEditProfileModal);
    }
    
    if (editProfileForm) {
        editProfileForm.addEventListener("submit", handleProfileSave);
    }
    
    // Eventos do modal de foto
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener("click", openPhotoSelectionModal);
    }
    
    if (closePhotoModal) {
        closePhotoModal.addEventListener("click", closePhotoSelectionModal);
    }
    
    if (cancelPhotoBtn) {
        cancelPhotoBtn.addEventListener("click", closePhotoSelectionModal);
    }
    
    if (selectPhotoBtn) {
        selectPhotoBtn.addEventListener("click", selectProfilePhoto);
    }
    
    // Eventos das opções de foto
    photoOptions.forEach(option => {
        option.addEventListener("click", function() {
            // Remover seleção anterior
            photoOptions.forEach(opt => opt.classList.remove("selected"));
            // Adicionar seleção atual
            this.classList.add("selected");
            selectedPhoto = this.getAttribute("data-photo");
        });
    });
    
    // Fechar modal ao clicar no overlay
    if (editProfileModal) {
        editProfileModal.addEventListener("click", function(e) {
            if (e.target === this) {
                closeEditProfileModal();
            }
        });
    }
    
    if (photoSelectionModal) {
        photoSelectionModal.addEventListener("click", function(e) {
            if (e.target === this) {
                closePhotoSelectionModal();
            }
        });
    }
    
    // Fechar modal com tecla ESC
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            closeEditProfileModal();
            closePhotoSelectionModal();
        }
    });
}

function openEditProfileModal() {
    const modal = document.getElementById("editProfileModal");
    const user = firebase.auth().currentUser;
    
    if (modal && user) {
        // Preencher campos com dados atuais
        const nameInput = document.getElementById("editProfileName");
        const emailInput = document.getElementById("editProfileEmail");
        const profilePhotoImg = document.getElementById("profilePhotoImg");
        
        if (nameInput) nameInput.value = user.displayName || "";
        if (emailInput) emailInput.value = user.email || "";
        
        // Definir foto atual
        if (profilePhotoImg) {
            if (user.photoURL) {
                profilePhotoImg.src = user.photoURL;
                selectedPhoto = user.photoURL;
            } else {
                profilePhotoImg.src = "../Images/favicon.png";
                selectedPhoto = "../Images/favicon.png";
            }
        }
        
        // Mostrar modal
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeEditProfileModal() {
    const modal = document.getElementById("editProfileModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        
        // Limpar formulário
        const form = document.getElementById("editProfileForm");
        if (form) {
            form.reset();
        }
        
        selectedPhoto = null;
    }
}

function openPhotoSelectionModal() {
    const modal = document.getElementById("photoSelectionModal");
    if (modal) {
        // Limpar seleção anterior
        const photoOptions = document.querySelectorAll(".photo-option");
        photoOptions.forEach(opt => opt.classList.remove("selected"));
        
        // Selecionar foto atual se existir
        if (selectedPhoto) {
            const currentOption = document.querySelector(`[data-photo="${selectedPhoto}"]`);
            if (currentOption) {
                currentOption.classList.add("selected");
            }
        }
        
        modal.classList.add("active");
    }
}

function closePhotoSelectionModal() {
    const modal = document.getElementById("photoSelectionModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

function selectProfilePhoto() {
    if (selectedPhoto) {
        // Atualizar imagem no modal principal
        const profilePhotoImg = document.getElementById("profilePhotoImg");
        if (profilePhotoImg) {
            profilePhotoImg.src = selectedPhoto;
        }
        
        // Fechar modal de seleção
        closePhotoSelectionModal();
    } else {
        alert("Por favor, selecione uma foto.");
    }
}

async function handleProfileSave(e) {
    e.preventDefault();
    
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Usuário não autenticado.");
        return;
    }
    
    const nameInput = document.getElementById("editProfileName");
    const passwordInput = document.getElementById("editProfilePassword");
    const saveBtn = document.querySelector(".btn-save");
    
    // Desabilitar botão durante o salvamento
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Salvando...";
    }
    
    try {
        const updates = {};
        let hasUpdates = false;
        
        // Atualizar nome se foi alterado
        if (nameInput && nameInput.value.trim() !== user.displayName) {
            updates.displayName = nameInput.value.trim();
            hasUpdates = true;
        }
        
        // Atualizar foto se foi alterada
        if (selectedPhoto && selectedPhoto !== user.photoURL) {
            updates.photoURL = selectedPhoto;
            hasUpdates = true;
        }
        
        // Atualizar perfil no Firebase Auth se houver mudanças
        if (hasUpdates) {
            await user.updateProfile(updates);
            console.log("Perfil atualizado no Firebase Auth");
        }
        
        // Atualizar senha se foi fornecida
        if (passwordInput && passwordInput.value.trim()) {
            await user.updatePassword(passwordInput.value.trim());
            console.log("Senha atualizada");
        }
        
        // Atualizar dados no Firestore
        if (firebase.firestore && hasUpdates) {
            const db = firebase.firestore();
            await db.collection("users").doc(user.uid).update({
                name: updates.displayName || user.displayName,
                photoURL: updates.photoURL || user.photoURL,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Dados atualizados no Firestore");
        }
        
        // Atualizar interface
        updateProfileInterface(user);
        
        // Fechar modal
        closeEditProfileModal();
        
        // Mostrar mensagem de sucesso
        showSuccessMessage("Perfil atualizado com sucesso!");
        
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        
        let errorMessage = "Erro ao atualizar perfil. ";
        
        if (error.code === "auth/weak-password") {
            errorMessage += "A senha deve ter pelo menos 6 caracteres.";
        } else if (error.code === "auth/requires-recent-login") {
            errorMessage += "Por segurança, faça login novamente antes de alterar a senha.";
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Reabilitar botão
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = "Salvar";
        }
    }
}

function updateProfileInterface(user) {
    // Atualizar nome
    const profileName = document.getElementById("profileName");
    if (profileName) {
        profileName.textContent = user.displayName || "Usuário";
    }
    
    // Atualizar avatar
    const profileAvatar = document.getElementById("profileAvatar");
    if (profileAvatar) {
        if (user.photoURL) {
            profileAvatar.innerHTML = `<img src="${user.photoURL}" alt="Avatar">`;
        } else {
            const initials = getInitials(user.displayName || user.email);
            profileAvatar.textContent = initials;
        }
    }
}

function showSuccessMessage(message) {
    // Criar elemento de notificação
    const notification = document.createElement("div");
    notification.className = "success-notification";
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
        z-index: 2000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Adicionar animação CSS
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = "slideInRight 0.3s ease-out reverse";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
}

