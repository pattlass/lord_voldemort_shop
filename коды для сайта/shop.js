// ===== 1. ХРАНИЛИЩЕ ДАННЫХ (Local Storage) =====
let cart = JSON.parse(localStorage.getItem('myShopCart')) || [];
let like = JSON.parse(localStorage.getItem('myShopLike')) || [];

function saveToStorage() {
    localStorage.setItem('myShopCart', JSON.stringify(cart));
    localStorage.setItem('myShopLike', JSON.stringify(like));
}

// ===== 2. ФУНКЦИИ ДОБАВЛЕНИЯ (Для страниц каталога) =====
function addToCart(productId) {

    const products = [
        { id: 1, name: "Распределяющая шляпа", price: "500₽", img: "картинки/шляпа.png" },
        { id: 2, name: "Золотой снитч", price: "300₽", img: "картинки/снитч.png" },
        { id: 3, name: "Зелье любви", price: "100₽", img: "картинки/зелье.png" },
        { id: 4, name: "Мантия-невидимка", price: "1599₽", img: "картинки/мантия.png" },
        { id: 5, name: "Зелье удачи", price: "150₽", img: "картинки/зелье-удача.png" },
        { id: 6, name: "Волшебная палочка", price: "699₽", img: "картинки/палочка.png" },
    ];

    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart.push(product);
    saveToStorage();
    alert("Товар добавлен в корзину");
}

function addToLike(productId) {

    const products = [
        { id: 1, name: "Распределяющая шляпа", price: "500₽", img: "картинки/шляпа.png" },
        { id: 2, name: "Золотой снитч", price: "300₽", img: "картинки/снитч.png" },
        { id: 3, name: "Зелье любви", price: "100₽", img: "картинки/зелье.png" },
        { id: 4, name: "Мантия-невидимка", price: "1599₽", img: "картинки/мантия.png" },
        { id: 5, name: "Зелье удачи", price: "150₽", img: "картинки/зелье-удача.png" },
        { id: 6, name: "Волшебная палочка", price: "699₽", img: "картинки/палочка.png" },
    ];

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const exists = like.some(item => item.id === productId);
    if (!exists) {
        like.push(product);
        saveToStorage();
        alert("Добавлено в избранное");
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("myShopCart", JSON.stringify(cart));

    showToast("Товар удалён из корзины");
    openModal("корзина"); // перерисовываем модалку
}

function removeFromLike(index) {
    like.splice(index, 1);
    localStorage.setItem("myShopLike", JSON.stringify(like));

    showToast("Товар удалён из избранного");
    openModal("избранное"); // перерисовываем модалку
}

// Глобальная функция удаления для страницы профиля и модалок
window.removeFromLike = function(index) {
    let currentLike = JSON.parse(localStorage.getItem('myShopLike')) || [];
    currentLike.splice(index, 1);
    localStorage.setItem('myShopLike', JSON.stringify(currentLike));
    
    // Если мы в профиле — перерисовываем список на странице
    if (document.getElementById("profile-favorites")) {
        renderFavorites();
    }
    // Если открыто модальное окно — обновляем его
    if (document.getElementById("modal") && document.getElementById("modal").style.display === "block") {
        openModal("Избранное");
    }
};
// ===== 4. МОДАЛЬНОЕ ОКНО (ИСПРАВЛЕННОЕ) =====
function openModal(type) {
    const modal = document.getElementById("modal");
    const title = document.getElementById("modal-title");
    const content = document.getElementById("modal-body");

    const key = type.toLowerCase();

    let currentList = [];

    if (key === "корзина") {
        currentList = cart;
        title.textContent = "КОРЗИНА";
    } 
    else if (key === "избранное") {
        currentList = like;
        title.textContent = "ИЗБРАННОЕ";
    } 
    else {
        return; // если не корзина и не избранное — выходим
    }

    content.innerHTML = "";

    if (currentList.length === 0) {
        content.innerHTML = "<p style='text-align:center;'>Пока пусто</p>";
    } else {
        currentList.forEach((p, index) => {
            const div = document.createElement("div");
            div.classList.add("cart-item");

            div.innerHTML = `
                <img src="${p.img}" alt="${p.name}">
                <div class="item-info">
                    <strong>${p.name}</strong>
                </div>
                <div class="item-price">
                    ${p.price}
                </div>
                <button class="delete-btn" onclick="${
                    key === "корзина"
                        ? `removeFromCart(${index})`
                        : `removeFromLike(${index})`
                }">×</button>
            `;

            content.appendChild(div);
        });
    }

    modal.style.display = "block";
}
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// ===== 5. ОТРИСОВКА ИЗБРАННОГО=====
function renderFavorites() {
    const favContainer = document.getElementById("profile-favorites");
    if (!favContainer) return;
    
    let currentLike = JSON.parse(localStorage.getItem('myShopLike')) || [];
    
    if (currentLike.length === 0) {
        favContainer.innerHTML = "<p style='color: #3d281d; font-style: italic;'>Пока нет избранных артефактов.</p>";
        return;
    }
    
    favContainer.innerHTML = currentLike.map((p, index) => `
        <div class="favorite-item" style="display:flex; gap:15px; align-items:center; margin-bottom:15px; background: rgba(0,0,0,0.05); padding: 15px; border-radius: 12px;">
            <img src="${p.img}" width="60" style="border-radius: 8px;">
            <div style="flex-grow: 1;">
                <!-- ИСПРАВЛЕНИЕ: Темный цвет для названия в профиле -->
                <strong style="color: #3d281d; display: block; margin-bottom: 5px;">${p.name}</strong>
                <span style="color: #b8860b; font-weight: bold;">${p.price}</span>
            </div>
            <button class="delete-btn" onclick="removeFromLike(${index})" title="Удалить">
                Удалить
            </button>
        </div>
    `).join("");
}

// ===== 6. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Логика вкладок (Профиль) ---
    const tabs = document.querySelectorAll(".side-nav a[data-tab], .profile-menu a[data-tab]");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute("data-tab");

            // Скрываем всё
            contents.forEach(content => content.style.display = "none");
            tabs.forEach(t => t.classList.remove("active"));

            // Показываем нужное
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) {
                targetBlock.style.display = "block";
                tab.classList.add("active");
            }

            // Если открыли вкладку избранного - рисуем список
            if (targetId === "favorite-section") {
                renderFavorites(); 
            }
        });
    });
    // Закрытие при клике вне окна
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("modal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    // --- Переход в профиль ---
    const profileBtn = document.getElementById("btn-profile") || 
                       document.getElementById("btn-Личный кабинет") || 
                       document.getElementById("btn-личный кабинет");
    if (profileBtn) {
        profileBtn.onclick = () => window.location.href = "profile.html";
    }

    // --- АВТОМАТИЧЕСКАЯ АКТИВАЦИЯ ВКЛАДКИ ПРИ ВХОДЕ В ПРОФИЛЬ ---
    const defaultTab = document.querySelector('.side-nav a[data-tab="personal-info-section"]');
    if (defaultTab) {
        // Принудительно вызываем клик, чтобы сработал код выше
        defaultTab.click(); 
    }
});
// --- Открытие корзины ---
const cartBtn = document.getElementById("btn-cart");
if (cartBtn) {
    cartBtn.addEventListener("click", () => {
        openModal("Корзина");
    });
}

// --- Открытие избранного ---
const likeBtn = document.getElementById("btn-like");
if (likeBtn) {
    likeBtn.addEventListener("click", () => {
        openModal("Избранное");
    });
}
function showToast(message) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}