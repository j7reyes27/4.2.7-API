//delay fetch repositories
function debounce(func, delay) {
    let timeoutId;
    return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Fetch repos
function fetchRepositories(query) {
    if (!query) return;
    const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(displayResults)
        .catch(handleError);
}

//autocomplete dropdown menu
function displayResults(data) {
    const repositories = data.items.slice(0, 5);
    const autocompleteList = document.getElementById('autocomplete');
    autocompleteList.innerHTML = '';

    repositories.forEach(repo => {
        const listItem = createListItem(repo);
        autocompleteList.appendChild(listItem);
    });
}

// Create a list item for a repo
function createListItem(repo) {
    const listItem = document.createElement('li');
    listItem.textContent = repo.full_name;
    listItem.addEventListener('click', () => selectRepository(repo));
    return listItem;
}

// Add repo to the list
function selectRepository(repo) {
    const listItem = createListItemElement(repo);
    const selectedList = document.getElementById('selected-repositories');
    selectedList.insertBefore(listItem, selectedList.firstChild);
    clearSearchInput();
}

// Create HTML element for a repo
function createListItemElement(repo) {
    const { name, owner, stargazers_count } = repo;
    const listItem = document.createElement('li');
    listItem.classList.add('repository-item');
    listItem.innerHTML = `
        <div>Name: ${name}</div>
        <div>Owner: ${owner.login}</div>
        <div>Stars: ${stargazers_count}</div>
        <span class="delete-button">X</span>
    `;
    listItem.querySelector('.delete-button').addEventListener('click', () => listItem.remove());
    return listItem;
}

// remove search items 
function clearSearchInput() {
    document.getElementById('search').value = '';
    document.getElementById('autocomplete').innerHTML = '';
}

//repository errors
function handleError(error) {
    console.error('Error fetching data:', error);
}

// debounce for search 
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', debounce(function() {
        fetchRepositories(this.value);
    }, 300));
});
