const modData = {
    "@title": "",
    "@description": "",
};

const tableData = {};
let uploadedFiles = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchRowsAndColumns();
    setupEventListeners();
});

// Fetch rows and columns from the file
function fetchRowsAndColumns() {
    fetch("data/rows_columns.txt")
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n").map(line => line.trim()).filter(line => line);
            let currentTable = null;

            lines.forEach(line => {
                if (line.includes(" rows:")) {
                    const [table, rows] = line.split(" rows:").map(item => item.trim());
                    currentTable = table;
                    tableData[currentTable] = { rows: rows.split(",").map(row => row.trim()), columns: [] };
                } else if (line.includes(" Column Names:")) {
                    const [table, columns] = line.split(" Column Names:").map(item => item.trim());
                    if (currentTable === table && tableData[currentTable]) {
                        tableData[currentTable].columns = columns.split(",").map(col => col.trim());
                    }
                }
            });

            populateSearchableOptions("tableOptions", Object.keys(tableData));
        })
        .catch(error => console.error("Error fetching rows and columns:", error));
}

// Populate dropdown options
function populateSearchableOptions(containerId, options) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    options.forEach(option => {
        const div = document.createElement("div");
        div.textContent = option;
        div.onclick = () => selectOption(containerId, option);
        container.appendChild(div);
    });

    const searchBox = document.getElementById(containerId.replace("Options", "Search"));
    searchBox.value = ""; // Reset search input
    toggleDropdown(containerId, false); // Close dropdown initially
}

function selectOption(containerId, value) {
    const searchBox = document.getElementById(containerId.replace("Options", "Search"));
    searchBox.value = value;
    toggleDropdown(containerId, false); // Close dropdown after selection

    if (containerId === "tableOptions") populateRows(value);
    else if (containerId === "rowOptions") populateColumns(value);
}

function toggleDropdown(containerId, show) {
    const container = document.getElementById(containerId);
    container.style.display = show ? "block" : "none";
}

function filterOptions(searchInputId, optionsContainerId) {
    const searchInput = document.getElementById(searchInputId).value.toLowerCase();
    const container = document.getElementById(optionsContainerId);
    const options = Array.from(container.children);

    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchInput)) {
            option.style.display = "block";
        } else {
            option.style.display = "none";
        }
    });

    toggleDropdown(optionsContainerId, true); // Show dropdown while typing
}

function setupEventListeners() {
    document.addEventListener("click", (event) => {
        const targetId = event.target.id;
        const containers = ["tableOptions", "rowOptions", "columnOptions"];
        containers.forEach(containerId => {
            if (!event.target.closest(`#${containerId}`) && !event.target.closest(`#${containerId.replace("Options", "Search")}`)) {
                toggleDropdown(containerId, false); // Close dropdown if clicked outside
            }
        });
    });

    document.getElementById("tableSearch").addEventListener("click", () => toggleDropdown("tableOptions", true));
    document.getElementById("rowSearch").addEventListener("click", () => toggleDropdown("rowOptions", true));
    document.getElementById("columnSearch").addEventListener("click", () => toggleDropdown("columnOptions", true));
}

// Populate rows for a selected table
function populateRows(tableName) {
    if (tableData[tableName]) {
        populateSearchableOptions("rowOptions", tableData[tableName].rows);
    }
}

// Populate columns for a selected row
function populateColumns(rowName) {
    const tableName = document.getElementById("tableSearch").value;
    if (tableData[tableName]) {
        populateSearchableOptions("columnOptions", tableData[tableName].columns);
    }
}

// Process uploaded folder
function processFolder() {
    const folderInput = document.getElementById('folderInput');
    uploadedFiles = Array.from(folderInput.files);

    if (uploadedFiles.length === 0) {
        alert("No files uploaded.");
        return;
    }

    alert(`${uploadedFiles.length} files uploaded successfully!`);
}

// Set base data for JSON
function setBaseData() {
    const title = document.getElementById('modTitle').value;
    const description = document.getElementById('modDescription').value;

    if (!title || !description) {
        alert("Please provide both title and description.");
        return;
    }

    modData["@title"] = title;
    modData["@description"] = description;

    alert("Base data set successfully!");
}

// Add modifications to JSON
function addModification() {
    const tableName = document.getElementById("tableSearch").value;
    const rowName = document.getElementById("rowSearch").value;
    const columnName = document.getElementById("columnSearch").value;
    const columnValue = document.getElementById("columnValue").value;

    if (!tableName || !rowName || !columnName || !columnValue) {
        alert("Please fill in all fields.");
        return;
    }

    if (!modData[tableName]) modData[tableName] = {};
    if (!modData[tableName][rowName]) modData[tableName][rowName] = {};

    modData[tableName][rowName][columnName] = columnValue;

    document.getElementById('jsonDisplay').textContent = JSON.stringify(modData, null, 4);
    alert(`Modification added: ${tableName} -> ${rowName} -> ${columnName}`);
}

// Export JSON and folder as ZIP
async function exportAsZip() {
    const zip = new JSZip();

    // Add content.json to ZIP
    const contentJson = JSON.stringify(modData, null,4);
    zip.file("content.json", contentJson);

    // Add uploaded files to ZIP
    uploadedFiles.forEach(file => {
        zip.file(file.webkitRelativePath, file);
    });

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "mod_package.zip";
    link.click();

    alert("ZIP file exported successfully!");
            }
