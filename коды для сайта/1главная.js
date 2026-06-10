// Получаем элементы модального окна
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close-button");

// Текст для навигации
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

// Универсальная функция открытия
function openModal(type) {

    // Навигационные окна
    if (infoData[type]) {
        modalTitle.innerText = type.toUpperCase();
        modalBody.innerText = infoData[type];
        modal.style.display = "block";
        return;
    }

    // Корзина и избранное
    if (type === "корзина" || type === "избранное") {
        modalTitle.innerText = type.toUpperCase();
        modalBody.innerHTML = "<p>Здесь пока пусто</p>";
        modal.style.display = "block";
    }
}

// Закрытие
function closeModal() {
    modal.style.display = "none";
}

closeBtn.onclick = closeModal;

window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
};

// Навигация
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener("click", function (e) {
        const text = this.innerText.trim().toLowerCase();

        if (text === "каталог" || text === "специальные предложения") {
            return;
        }

        e.preventDefault();
        openModal(text);
    });
});

// Иконки
const likeBtn = document.getElementById("btn-like");
const cartBtn = document.getElementById("btn-cart");
const profileBtn = document.getElementById("btn-profile");

likeBtn.onclick = () => openModal("избранное");
cartBtn.onclick = () => openModal("корзина");

profileBtn.onclick = () => {
    window.location.href = "profile.html";
};
function removeFromLike(index) {
    like.splice(index, 1);
    localStorage.setItem("myShopLike", JSON.stringify(like));

    showToast("Товар удалён из избранного");
    openModal("избранное"); // перерисовываем модалку
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
