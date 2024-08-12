document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);

async function handleLoginSubmit(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const data = await sendLoginRequest(username, password);
        checkLoginResponse(data);
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao tentar fazer login.');
    }
}


async function sendLoginRequest(username, password) {
    const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error('Erro de rede');
    }

    return await response.json();
}

function checkLoginResponse(data) {
    if (data.success) {
        window.location.href = '/pages/restaurant.html'; // Redireciona após login bem-sucedido
    } else {
        showError(data.message); // Exibe a mensagem de erro
    }
}

function showError(message) {
    document.getElementById('error-message').innerText = message;
}
