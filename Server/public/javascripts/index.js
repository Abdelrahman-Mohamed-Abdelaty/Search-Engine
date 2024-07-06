import {fetchData, getQueryParam} from "./results";
const searchButton = document.getElementById('search-button');
const searchQuery = document.getElementById('search-query');
const nextPage=document.querySelector('.next-page-button');
if(nextPage){
    nextPage.addEventListener('click',async (e)=>{
        const query = getQueryParam('query');
        const page = getQueryParam('page')*1||1;
        redirectToResults(query,page+1);
    })
}
const redirectToResults = (query,page) => {
    window.location.href = `results.html?query=${encodeURIComponent(query)}&page=${encodeURIComponent(page)}`;
};
if(searchButton)
    searchButton.addEventListener('click', () => {
        const query = searchQuery.value;
        if (query) {
            redirectToResults(query,1);
        }
    });
if(searchQuery)
    searchQuery.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchQuery.value;
            if (query) {
                redirectToResults(query,1);
            }
        }
    });
const query = getQueryParam('query');
const page = getQueryParam('page');
if (query) {
    fetchData(query,page);
}
