document.addEventListener('DOMContentLoaded', function () {
    const basePath = document.querySelector('base')?.getAttribute('href') || '';
    console.log('Base path:', basePath); // Debug log
    fetch(basePath + 'header.html')
        .then(response => {
            console.log('Response status:', response.status); // Debug log
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('Header content loaded successfully'); // Debug log
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error('Error loading header:', error));
});