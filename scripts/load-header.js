document.addEventListener('DOMContentLoaded', function () {
    const basePath = document.querySelector('base')?.getAttribute('href') || '';
    fetch(basePath + 'header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error('Error loading header:', error));
});