function setPopupSize() {
    const popup = document.querySelector('body');
    const screenHeight = window.screen.height;

    const popupWidth = screenHeight * 0.4;
    const popupHeight = popupWidth * 1.618;

    popup.style.width = popupWidth + 'px';
    popup.style.height = popupHeight + 'px';
}

document.addEventListener('DOMContentLoaded', setPopupSize);

document.querySelector('#toggle-mode-button').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('#toggle-mode-button').textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});