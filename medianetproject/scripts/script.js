"use strict";

// Get reference to all DOM elements
let numberOfEntries = document.querySelector('.entries')
let nextPage = document.querySelector('.rightarrow');
let previousPage = document.querySelector('.leftarrow');
let trimStartText = document.querySelector('.trimStart');
let trimEndText = document.querySelector('.trimEnd');
let searchInput = document.querySelector('#search-table');
let table = document.querySelector('.table-body');

// This is where we manage the state of table
let state = {
    'querySet': '',
    'page': 1,
    'rows': 4
}

// Load JSON Data
function fetchData() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            state.querySet = JSON.parse(this.responseText);
            createTableFromJSON(state.querySet);
        }
    };
    xhttp.open("GET", "./airports.json", true);
    xhttp.send();
}

// Create an HTML table using the JSON data.
function createTableFromJSON(jsonData) {
    let tableData = jsonData;
    let data = pagination(tableData, state.page, state.rows);
    numberOfEntries.innerHTML = state.querySet.length;
    let row = '';

    for (let i  in data.querySet) {
        row += `
            <tr>
                <td>
                    ${data.querySet[i].name}
                </td>
                <td>
                    ${data.querySet[i].icao}
                </td>
                <td>
                    ${data.querySet[i].iata}
                </td>
                <td>
                ${data.querySet[i].elevation}
            </td>
                <td>
                    ${data.querySet[i].latitude}
                </td>
                <td>
                    ${data.querySet[i].longitude}
                </td>
                <td>
                    ${data.querySet[i].type}
                </td>
            </tr>
        `
    }
    table.innerHTML = row;
};

// Handle Pagination
function pagination(querySet, page, rows) {
    let trimStart = (page - 1) * rows;
    let trimEnd = trimStart + rows;

    let trimmedData = querySet.slice(trimStart, trimEnd)

    let pages = Math.ceil(querySet.length / rows);

    trimStartText.innerHTML = trimStart + 1;
    trimEndText.innerHTML = trimEnd;

    return {
        'querySet': trimmedData,
        'pages': pages
    }
}

// Function to handle page icrement
function incrementPage(value) {
    // First clear the table
    table.innerHTML = ``

    if (value) {
        state.page = state.page + 1;
    } else {
        if(state.page != 1) {
            state.page = state.page - 1;
        }
    }

    // Build Table again
    createTableFromJSON(state.querySet);

    // Handle arrow
    handleArrow();
}

nextPage.addEventListener('click', function () {
    incrementPage(true)
})

previousPage.addEventListener('click', function () {
    incrementPage(false)
})

// Search
searchInput.addEventListener('keyup', function () {
    let value = searchInput.value;
    let data = searchTable(value, state.querySet);
    createTableFromJSON(data)
})

function searchTable(value, data) {
    let filteredData = []
    for (let i = 0; i < data.length; i++) {
        value = value.toLowerCase();
        let name = data[i].name.toLowerCase();
        if (name.includes(value)) {
            filteredData.push(data[i])
        }
    }
    return filteredData
}

// Checkbox filter
let filteredTypes = [];
function filterChecked(cb) {
    if (cb.checked) {
        filteredTypes.push(cb.value);
    } else {
        filteredTypes = filteredTypes.filter(e => e !== cb.value);
    }

    let data = filterType(filteredTypes, state.querySet);
    createTableFromJSON(data)

    // If no items, reset table
    if(filteredTypes.length == 0) {
        createTableFromJSON(state.querySet)
    }
}

function filterType(values, data) {
    let filteredData = []
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < values.length; j++) {
            if (data[i].type == values[j]) {
                filteredData.push(data[i])
            }
        }
    }
    return filteredData;
}

function handleArrow() {
    if(state.page === 1) {
        previousPage.classList.add('arrow-disable')
    } else {
        previousPage.classList.remove('arrow-disable')
    }
}


window.initiateTable = () => {
    fetchData();
};

window.addEventListener("DOMContentLoaded", window.initiateTable());