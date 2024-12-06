const modData = {
    "@title": "Generated by ChatGPT",
    "@description": "AI-generated modifications",
};

const tableData = {};
const chatBox = document.getElementById("chatBox");
const jsonDisplay = document.getElementById("jsonDisplay");

document.addEventListener("DOMContentLoaded", () => {
    fetchRowsAndColumns();
});

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

            appendAIMessage("I have loaded the tables, rows, and columns from the file. You can now ask me to modify the JSON.");
        })
        .catch(error => console.error("Error fetching rows and columns:", error));
}

function appendUserMessage(message) {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAIMessage(message) {
    const div = document.createElement("div");
    div.className = "ai";
    div.textContent = message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    appendUserMessage(userInput);
    document.getElementById("userInput").value = "";

    const systemPrompt = `
You are a JSON builder assistant. You will process user requests to modify JSON data. 
Here are the available tables, rows, and columns: ${JSON.stringify(tableData)}.
You must validate the user's input and provide valid JSON modifications. If a request is unclear, ask for clarification.
`;

    const chatResponse = await fetchChatGPTResponse(systemPrompt, userInput);
    if (chatResponse.error) {
        appendAIMessage("Error: Unable to process your request.");
    } else {
        appendAIMessage(chatResponse.message);
        try {
            const modifications = JSON.parse(chatResponse.json);
            Object.assign(modData, modifications);
            updateJSONDisplay();
        } catch (error) {
            appendAIMessage("Error parsing the response JSON.");
        }
    }
}

async function fetchChatGPTResponse(systemPrompt, userInput) {
    const secretKey = "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"; // Replace this with your ChatGPT secret key
    const apiUrl = "https://api.openai.com/v1/completions";

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
    ];

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secretKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4-mini",
                messages: messages,
            }),
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return {
                message: data.choices[0].message.content,
                json: data.choices[0].message.content,
            };
        } else {
            return { error: true };
        }
    } catch (error) {
        console.error("Error fetching ChatGPT response:", error);
        return { error: true };
    }
}

function updateJSONDisplay() {
    jsonDisplay.textContent = JSON.stringify(modData, null, 4);
}
