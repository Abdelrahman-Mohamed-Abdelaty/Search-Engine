import axios from "axios";

const resultsContainer = document.getElementById('results');
const queryTimeContainer = document.getElementById('query-time');

export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const displayResults = (pages) => {
    // Clear only the result items, keep the next page button
    const resultItems = document.createElement('div');
    resultItems.classList.add('result-items');

    pages.forEach(page => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
                <h2>${page.title}</h2>
                <a href="https://${page.url}" target="_blank">${page.url}</a>
                <p>${page.matchedContent}</p>
            `;
        resultItems.appendChild(resultItem);
    });

    const nextPageButton = document.querySelector('.next-page-button');
    resultsContainer.innerHTML = ''; // Clear the container
    resultsContainer.appendChild(resultItems); // Add the results
    resultsContainer.appendChild(nextPageButton); // Re-add the button
};

export const fetchData = async (query, page) => {
    const startTime = new Date();

    const response = await axios(`/api/v1?search=${query}&page=${page}&limit=5`);

    const endTime = new Date();
    const queryTime = (endTime - startTime) / 1000;
    queryTimeContainer.textContent = `Query time: ${queryTime} seconds`;

    if (response.data.pages.length !== 0) {
        displayResults(response.data.pages);
    } else {
        resultsContainer.innerHTML = `<p>No results found for: ${query}</p>`;
    }
};
