document.addEventListener('DOMContentLoaded', function () {
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            console.log('Header loaded successfully');
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.body.insertAdjacentHTML('afterbegin', '<header><h1>Failed to load header</h1></header>');
        });
});