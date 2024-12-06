<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro Nulls brawl mod json</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Pro Signature nulls brawl mod</h1>
    <div class="section">
        <label for="folderInput">Upload Folder</label>
        <input type="file" id="folderInput" webkitdirectory>
        <button onclick="processFolder()">Upload Folder</button>
    </div>

    <div class="section">
        <label for="modTitle">Mod Title</label>
        <input type="text" id="modTitle" placeholder="Enter mod title">
        <label for="modDescription">Mod Description</label>
        <textarea id="modDescription" placeholder="Enter mod description"></textarea>
        <button onclick="setBaseData()">Set Base Data</button>
    </div>

    <div class="section">
        <h2>content</h2>
        <div class="searchable">
            <label for="tableSearch">Search Table</label>
            <input type="text" id="tableSearch" placeholder="Search tables..." oninput="filterOptions('tableSearch', 'tableOptions')">
            <div class="options" id="tableOptions"></div>
        </div>
        <div class="searchable">
            <label for="rowSearch">Search Row</label>
            <input type="text" id="rowSearch" placeholder="Search rows..." oninput="filterOptions('rowSearch', 'rowOptions')">
            <div class="options" id="rowOptions"></div>
        </div>
        <div class="searchable">
            <label for="columnSearch">Search Column</label>
            <input type="text" id="columnSearch" placeholder="Search columns..." oninput="filterOptions('columnSearch', 'columnOptions')">
            <div class="options" id="columnOptions"></div>
        </div>
        <label for="columnValue">Column Value</label>
        <input type="text" id="columnValue" placeholder="Enter column value">
        <button onclick="addModification()">Add Modification</button>
    </div>

    <div class="section">
        <button onclick="exportAsZip()">Export as ZIP</button>
        <div id="jsonDisplay" class="json-output"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="script2.js"></script>
</body>
</html>
