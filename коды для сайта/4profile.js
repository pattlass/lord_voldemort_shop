const profile = document.querySelector('.profile-dropdown');
const content = document.querySelector('.dropdown-content');

profile.addEventListener('click', (e) => {
    e.stopPropagation();
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
});

// Закрыть меню при клике в любом другом месте экрана
window.addEventListener('click', () => {
    content.style.display = 'none';
});
// Логика переключения вкладок в профиле
document.addEventListener('DOMContentLoaded', () => {
    // Находим кнопки
    const btnMyData = document.querySelector('.side-nav a:nth-child(1)'); 
    const btnFavorites = document.getElementById('show-favorites');
    
    // Находим секции
    const personalSection = document.getElementById('personal-info-section');
    const favoriteSection = document.getElementById('favorite-section');

    // Клик по "Избранное"
    btnFavorites.addEventListener('click', (e) => {
        e.preventDefault();
        personalSection.style.display = 'none';    // Прячем личные данные
        favoriteSection.style.display = 'block';   // Показываем избранное
        
        btnMyData.classList.remove('active');
        btnFavorites.classList.add('active');
    });

    // Клик по "Мои данные"
    btnMyData.addEventListener('click', (e) => {
        e.preventDefault();
        favoriteSection.style.display = 'none';    // Прячем избранное
        personalSection.style.display = 'block';   // Показываем личные данные
        
        btnFavorites.classList.remove('active');
        btnMyData.classList.add('active');
    });
});
