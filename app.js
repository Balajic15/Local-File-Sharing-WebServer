const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const folder = path.join(__dirname, "shared");

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
}

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    fs.readdir(folder, (err, files) => {
        if (err) {
            return res.status(404).send("Something fishy from our side please wait...");
        }

        let fileList = files.length
            ? files.map(file => `<li><a href="/download/${file}" download>${file}</a></li>`).join("")
            : `<div class="empty-state">No files available for download</div>`;

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Local File Sharing Server</title>
                <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
                <div class="container">
                    <h1>Local File Sharing Server </h1>
                    <div class="server-info">
                        <strong>By Balaji AITS 22701A0524</strong>
                    </div>
                    <h2>List of available Files</h2>
                    <ul class="file-list">${fileList}</ul>
                </div>
            </body>
            </html>
        `);
    });
});

app.get("/download/:name", (req, res) => {
    const path1 = path.join(folder, req.params.name);
    res.download(path1, (err) => {
        if (err) {
            res.status(404).send('File doesn’t exist');
        }
    });
});

app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
