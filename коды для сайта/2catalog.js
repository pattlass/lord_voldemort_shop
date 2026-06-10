document.addEventListener('DOMContentLoaded', () => {

    // ==============================
    // ЗАГРУЗКА ДАННЫХ ИЗ LOCALSTORAGE
    // ==============================
    let cart = JSON.parse(localStorage.getItem('myShopCart')) || [];
    let like = JSON.parse(localStorage.getItem('myShopLike')) || [];

    function saveToStorage() {
        localStorage.setItem('myShopCart', JSON.stringify(cart));
        localStorage.setItem('myShopLike', JSON.stringify(like));
    }

    // МОДАЛЬНОЕ ОКНО
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalText = document.getElementById("modal-text");
    const closeBtn = document.querySelector(".close-button");

    window.openModal = function(type, searchResults = []) {

        const key = type.toLowerCase();
        modalTitle.innerText = type;

        modalText.classList.remove("search-grid");

        // ----- КОРЗИНА / ИЗБРАННОЕ -----
        if (key === "корзина" || key === "избранное") {

            const currentList = (key === "корзина") ? cart : like;

            if (currentList.length > 0) {
                modalText.innerHTML = currentList.map((p, index) => {

                    const removeFunction =
                        (key === "корзина")
                            ? `removeFromCart(${index})`
                            : `removeFromLike(${index})`;

                    return `
                        <div class="modal-item-row">
                            <img src="${p.img}">
                            <div class="item-info">
                                <span class="item-name">${p.name}</span>
                                <span class="item-price">${p.price}</span>
                            </div>
                            <span class="remove-btn" onclick="${removeFunction}">&times;</span>
                        </div>
                    `;
                }).join('');
            } else {
                modalText.innerHTML =
                    "<p class='empty-text'>Тут пока пусто.</p>";
            }
        }

        // ----- ПОИСК -----
        else {

            modalText.classList.add("search-grid");

            if (searchResults.length > 0) {
                modalText.innerHTML = searchResults.map((p) => `
                    <div class="search-card">
                        <img src="${p.img}">
                        <span class="item-name">${p.name}</span>
                        <span class="item-price">${p.price}</span>
                        <button class="buy-btn" onclick="addToCart(${p.id})">
                            В корзину
                        </button>
                    </div>
                `).join('');
            } else {
                modalText.innerHTML =
                    "<p class='empty-text' style='grid-column: 1 / -1;'>Ничего не найдено.</p>";
            }
        }

        modal.style.display = "block";
    };

    // ==============================
    // УДАЛЕНИЕ ИЗ КОРЗИНЫ
    // ==============================
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveToStorage();
        showToast("Товар удалён");
        openModal("Корзина");
    };

    window.removeFromLike = function(index) {
        like.splice(index, 1);
        saveToStorage();
        showToast("Удалено из избранного");
        openModal("Избранное");
    };

    // НАВИГАЦИЯ
    document.querySelectorAll('nav a').forEach(link => {
        link.onclick = (e) => {

            const type = link.innerText.trim().toLowerCase();

            if (
                type === "каталог" ||
                type === "специальные предложения" ||
                type === "спец предложения"
            ) return;

            e.preventDefault();
            openModal(type);
        };
    });

    // ИКОНКИ
    
    const likeBtn = document.getElementById("btn-Избранное");
    const cartBtn = document.getElementById("btn-Корзина");
    const cabinetBtn = document.getElementById("btn-profile");

    if (cabinetBtn) {
        cabinetBtn.onclick = () => {
            window.location.href = "profile.html";
        };
    }

    if (likeBtn) likeBtn.onclick = () => openModal("Избранное");
    if (cartBtn) cartBtn.onclick = () => openModal("Корзина");

    // ЗАКРЫТИЕ МОДАЛКИ
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // ВЫПАДАЮЩИЙ СПИСОК
    const dropdown = document.querySelector('.custom-dropdown');
    const header = document.querySelector('.dropdown-header');
    const items = document.querySelectorAll('.dropdown-list li');
    const selectedValue = document.getElementById('selected-value');

    if (header) {
        header.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        });
    }

    items.forEach(item => {
        item.addEventListener('click', () => {
            selectedValue.innerText = item.innerText;
            dropdown.classList.remove('active');
        });
    });

    window.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // ТОВАРЫ
    const products = [
        { id: 1, name: "Распределяющая шляпа", price: "500₽", img: "картинки/шляпа.png" },
        { id: 2, name: "Золотой снитч", price: "300₽", img: "картинки/снитч.png" },
        { id: 3, name: "Зелье любви", price: "100₽", img: "картинки/зелье.png" },
        { id: 4, name: "Мантия-невидимка", price: "1599₽", img: "картинки/мантия.png" },
        { id: 5, name: "Зелье удачи", price: "150₽", img: "картинки/зелье-удача.png" },
        { id: 6, name: "Волшебная палочка", price: "699₽", img: "картинки/палочка.png" },
    ];

    const grid = document.getElementById('catalog-grid');

    function renderProducts() {
        if (!grid) return;

        grid.innerHTML = products.map(p => `
            <div class="product-card">
                <div class="img-wrapper">
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="price">${p.price}</div>
                    <div class="underline"></div>
                    <div class="card-actions">
                        <button class="buy-btn" onclick="addToCart(${p.id})">
                            В корзину
                        </button>
                        <span class="like-btn-card"
                              onclick="addToLike(${p.id})">♡</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderProducts();

    // ПОИСК 
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const query = searchInput.value.trim().toLowerCase();
            if (!query) return;

            const found = products.filter(p =>
                p.name.toLowerCase().includes(query)
            );

            openModal(`Результаты поиска (${found.length})`, found);

            searchInput.value = "";
        });
    }

    //УВЕДОМЛЕНИЯ
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    //  ДОБАВЛЕНИЕ В КОРЗИНУ / ИЗБРАННОЕ
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        cart.push(product);
        saveToStorage();
        showToast(`${product.name} в корзине!`);
    };

    window.addToLike = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const exists = like.some(item => item.id === productId);
        if (!exists) {
            like.push(product);
            saveToStorage();
            showToast(`${product.name} в избранном!`);
        }
    };

});