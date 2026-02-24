const fs = require('fs');
const https = require('https');
const path = require('path');

const url = "https://upload.wikimedia.org/wikipedia/commons/1/1a/The_Pictorial_Key_to_the_Tarot.pdf";
const dest = path.join(__dirname, "nova-agent", "knowledge", "The_Pictorial_Key_to_the_Tarot.pdf");

console.log("Downloading PDF...");
const file = fs.createWriteStream(dest);
https.get(url, function(response) {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirect if any
        https.get(response.headers.location, function(res) {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log("Download complete (redirected).");
            });
        });
    } else {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log("Download complete.");
        });
    }
}).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error("Error downloading file:", err.message);
});
