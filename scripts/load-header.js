document.addEventListener('DOMContentLoaded', function () {
    const basePath = document.querySelector('base')?.getAttribute('href') || '';
    console.log('Base path:', basePath); // Debug log

    function fetchHeader(path) {
        console.log('Attempting to fetch header from:', path); // Debug log
        return fetch(path)
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
            });
    }

    fetchHeader(basePath + 'header.html')
        .catch(error => {
            console.error('Error loading header:', error);
            console.log('Attempting to fetch from alternate path');
            return fetchHeader(basePath + 'wdh-playerinterface/' + 'header.html');
        })
        .catch(error => {
            console.error('Error loading header from both paths:', error);
        });
});