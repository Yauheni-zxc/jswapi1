const unsplashApiKey = 'llYDS1vT-xSZ4GNAcWFJBftYQgOL1X5tETA9fn-Z6Dc';
const imageContainer = document.getElementById('image-container');
const image = document.getElementById('image');
const photographer = document.getElementById('photographer');
const likeButton = document.querySelector('.like-button');
const likesCount = document.getElementById('likes-count');
const toggleHistoryButton = document.getElementById('toggle-history');
const historyViewer = document.getElementById('history-viewer');
let likes = 0; // Счетчик лайков

// Функции
async function getRandomImage() {
    // Получение случайного изображения
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${unsplashApiKey}`);
        const data = await response.json();
        image.src = data.urls.regular;
        photographer.textContent = `Фотограф: ${data.user.name}`;
        updateHistory(data);
    } catch (error) {
        console.error("Ошибка при получении изображения:", error);
    }
}

function updateHistory(data) {
    // Обновление истории просмотров
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({
        url: data.urls.regular,
        photographer: data.user.name,
        likes: likes
    });
    localStorage.setItem('history', JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    // Отображение истории просмотров
    let history = JSON.parse(localStorage.getItem('history')) || [];
    historyViewer.innerHTML = '';
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
                    <img src="${item.url}" onclick="window.open('${item.url}', '_blank')" />
                    <span> Фотограф: ${item.photographer}</span>
                    <span> ❤️: ${item.likes}</span>
                    <button class="delete-button" onclick="deleteHistoryItem(${index})">X</button>
                `;
        historyViewer.appendChild(historyItem);
    });
}

window.deleteHistoryItem = function (index) {
    // Удаление элемента из истории
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.splice(index, 1);
    localStorage.setItem('history', JSON.stringify(history));
    displayHistory();
}

toggleHistoryButton.addEventListener('click', () => {
    // Переключение отображения истории
    const isHistoryVisible = historyViewer.style.display !== 'none';
    historyViewer.style.display = isHistoryVisible ? 'none' : 'flex';
    toggleHistoryButton.textContent = isHistoryVisible ? 'Показать историю просмотров' : 'Скрыть историю просмотров';
    if (!isHistoryVisible) {
        displayHistory();
    }
});

likeButton.addEventListener('click', () => {
    // Увеличение количества лайков
    likes++;
    likesCount.textContent = likes;
    updateHistoryWithLikes();
});

function updateHistoryWithLikes() {
    // Обновление истории с новым количеством лайков
    let history = JSON.parse(localStorage.getItem('history')) || [];
    if (history.length > 0) {
        history[history.length - 1].likes = likes;
        localStorage.setItem('history', JSON.stringify(history));
    }
}

function updateLikes() {
    // Обнуление счетчика лайков при загрузке страницы
    likes = 0;
    likesCount.textContent = likes;
}

window.addEventListener('load', () => {
    // Загрузка случайного изображения и обнуление счетчика лайков при загрузке страницы
    getRandomImage();
    updateLikes();
    // Инициализация состояния истории как скрытой
    historyViewer.style.display = 'none';
    toggleHistoryButton.textContent = 'Показать историю просмотров';
});