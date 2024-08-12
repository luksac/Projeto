document.addEventListener('DOMContentLoaded', async () => {
    try {
        const restaurantId = getRestaurantIdFromURL();
        if (!restaurantId) {
            showError('ID do restaurante não fornecido.');
            return;
        }

        const data = await fetchRestaurantDetails(restaurantId);
        if (data.success) {
            displayRestaurantDetails(data.restaurantDetails);
        } else {
            showError('Nenhum detalhe encontrado para este restaurante.');
        }
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar detalhes do restaurante.');
    }
});

function getRestaurantIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchRestaurantDetails(restaurantId) {
    const response = await fetch(`http://localhost:3333/detailsRestaurants/${restaurantId}`);
    return response.json(); // Converte a resposta para JSON
}

function displayRestaurantDetails(restaurantDetails) {
    const container = document.getElementById('restaurant-container');
    const restaurant = restaurantDetails[0];

    const restaurantHTML = `
        <div class="restaurant-info">
            <h2>Informações do Restaurante</h2>
            <b><p class="text-rest descricao">Descrição:</b> ${restaurant.restaurantedescricao}</p>
            <b><p class="text-rest endereco">Endereço: </b>${restaurant.endereco}</p>
            <b><p class="text-rest telefone">Telefone: </b>${restaurant.telefone}</p>
            <b><p class="text-rest nota">Nota: <span class="star">&#9733;</span> ${restaurant.notausuarios}</p></b>
            <img src="${restaurant.fotosrestaurante}" class="img-restaurant" alt="Foto do Restaurante"/>
        </div>
        <div class="dish-info">
            <h2>Pratos</h2>
            ${restaurantDetails.map(detail => `
                <div class="col-2">
                    <img src="${detail.fotospratos}" class="img-restaurant" alt="Foto do Prato"/>
                    <p class="text-rest descricao">Descrição do Prato: ${detail.descricaopratos}</p>
                    <p class="text-rest precos">Preço : R$ ${detail.precos}</p>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = restaurantHTML;
}

function showError(message) {
    document.getElementById('error-message').innerText = message;
}
