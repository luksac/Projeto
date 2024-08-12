document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('search-box');
    const container = document.getElementById('restaurant-container');
    const errorMessage = document.getElementById('error-message');

    async function fetchRestaurants(search = '') {
        try {
            const response = await fetch(`http://localhost:3333/restaurants?search=${encodeURIComponent(search)}`);
            const data = await response.json();
            console.log('DATA RETORNO AQUI', data);

            if (data.success) {
                const restaurantHTML = data.restaurants.map(restaurant => {
                    return `
                        <a href="restaurantDetails.html?id=${restaurant.restauranteid}" key="${restaurant.descricao}" class="col-2">
                            <img src="${restaurant.fotosrestaurante}" class="img-restaurant"/>
                            <b><p class="text-rest">Descrição: </b>${restaurant.descricao}</p>
                            <b><p class="text-rest">Endereço: </b>${restaurant.endereco}</p>
                            <b><p class="text-rest">Tipo: </b>${restaurant.tipo}</p>
                            <b><p class="text-rest">Telefone: </b>${restaurant.telefone}</p>

                        </a>
                    `;
                }).join('');

                container.innerHTML = restaurantHTML;
                errorMessage.innerText = '';
            } else {
                container.innerHTML = '';
                errorMessage.innerText = data.message;
            }
        } catch (error) {
            console.error('Erro:', error);
            errorMessage.innerText = 'Erro ao carregar Restaurantes.';
        }
    }

    // Carrega todos os restaurantes na inicialização
    fetchRestaurants();

    // Adiciona um listener ao input de busca
    searchBox.addEventListener('input', (event) => {
        const searchValue = event.target.value;
        fetchRestaurants(searchValue);
    });
});
