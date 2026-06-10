document.addEventListener('DOMContentLoaded', () => {
//загружаем данные из памяти браузера или создаем пустые, если там ничего нет
let cart = JSON.parse(localStorage.getItem('myShopCart')) || [];
let like = JSON.parse(localStorage.getItem('myShopLike')) || [];

//функция для сохранения изменений в память
function saveToStorage() {
    localStorage.setItem('myShopCart', JSON.stringify(cart));
    localStorage.setItem('myShopLike', JSON.stringify(like));
}
const infoData = {
    "о нас": "Мы — лучший магазин магических артефактов в мире.",
};
// Навигация: открывает модалку для всего, кроме "Каталог" и "Спец предложения"
document.querySelectorAll('nav a').forEach(link => {
    link.onclick = (e) => {
        const type = link.innerText.trim().toLowerCase();

        // Если это ссылка на другую страницу — ничего не делаем (просто переходим)
        if (type === "каталог" || type === "специальные предложения" || type === "спец предложения") {
            return; 
        }

        // Для остальных ссылок отменяем переход и открываем наше окно
        e.preventDefault();
        openModal(type);
    };
});

const products = [
    { id: 1, name: "Распределяющая шляпа", price: "500₽", img: "картинки/шляпа.png" },
    { id: 2, name: "Золотой снитч", price: "300₽", img: "картинки/снитч.png" },
    { id: 3, name: "Зелье любви", price: "100₽", img: "картинки/зелье.png" },
    { id: 4, name: "Мантия-невидимка", price: "1599₽", img: "картинки/мантия.png" },
    { id: 5, name: "Зелье удачи", price: "150₽", img: "картинки/зелье-удача.png" },
    { id: 6, name: "Волшебная палочка", price: "699₽", img: "картинки/палочка.png" },
];
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const closeBtn = document.querySelector(".close-button");

 //ФУНКЦИЯ МОДАЛЬНОГО ОКНА
 window.openModal = function(type) {
    const key = type.toLowerCase();
    modalTitle.innerText = type.charAt(0).toUpperCase() + type.slice(1);
    let currentList = [];
    if (key === "корзина") currentList = cart;
    else if (key === "избранное") currentList = like;
    if (key === "корзина" || key === "избранное") {
        if (currentList.length > 0) {
            modalText.innerHTML = currentList.map((p, index) => {
                const removeFunction = (key === "корзина") ? `removeFromCart(${index})` : `removeFromLike(${index})`;
                return `
                <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:12px;">
                    <img src="${p.img}" style="width:50px; height:50px; object-fit:contain; border-radius:8px; background:#f9f6f2; padding:5px;">
                    <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                        <span style="color:#3d281d; font-weight:bold; font-size: 0.95em;">${p.name}</span>
                        <span style="color:#b8860b; font-weight:bold; font-size: 0.9em;">${p.price}</span>
                    </div>
                    <span class="remove-btn" onclick="${removeFunction}" 
                          style="cursor:pointer; color:#d9534f; font-size:1.6em; font-weight:bold; padding: 5px 10px; transition: 0.2s;"
                          onmouseover="this.style.color='#c9302c'" 
                          onmouseout="this.style.color='#d9534f'">&times;</span>
                </div>`;
            }).join('');
        } else {
            modalText.innerHTML = "<p style='color:#a08a7e; text-align:center; padding: 20px;'>Тут пока пусто.</p>";
        }
    } else {
        modalText.style.color = "#3d281d";
        modalText.innerText = infoData[key] || "Информация временно недоступна.";
    }
    modal.style.display = "block";
};

//ДОБАВЛЕНИЕ И УДАЛЕНИЕ
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        saveToStorage();
        showToast(` ${product.name} в корзине!`);
    }
};
window.addToLike = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const exists = like.some(item => item.id === productId);
        if (!exists) {
            like.push(product);
            saveToStorage();
            showToast(` ${product.name} в избранном!`);
        }
    }
};
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveToStorage();
    showToast("Удалено из корзины");
    openModal("Корзина");
};
window.removeFromLike = function(index) {
    like.splice(index, 1);
    saveToStorage();
    showToast("Удалено из избранного");
    openModal("Избранное");
};
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
//СОБЫТИЯ
const likeBtn = document.getElementById("btn-избранное");
const cartBtn = document.getElementById("btn-корзина");
const cabinetBtn = document.getElementById("btn-profile");

if (cabinetBtn) {
    cabinetBtn.onclick = () => {
        window.location.href = "profile.html";
    };
}

if(likeBtn) likeBtn.onclick = () => openModal("Избранное");
if(cartBtn) cartBtn.onclick = () => openModal("Корзина");
if(closeBtn) closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
};
});