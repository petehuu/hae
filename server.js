const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const requestFilePath = path.join(__dirname, 'request.txt');
const responseFilePath = path.join(__dirname, 'response.txt');

function fetchURLContent(url, callback) {
    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            callback(null, data);
        });

    }).on("error", (err) => {
        callback(err, null);
    });
}

function checkRequestFile() {
    fs.readFile(requestFilePath, 'utf8', (err, url) => {
        if (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error reading request file:', err);
            }
            return;
        }

        fetchURLContent(url.trim(), (err, data) => {
            if (err) {
                console.error('Error fetching URL content:', err);
                return;
            }

            fs.writeFile(responseFilePath, data, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing response file:', err);
                } else {
                    console.log('Response written to file');
                }
            });
        });
    });
}

setInterval(checkRequestFile, 5000); // Check the request file every 5 seconds

const server = http.createServer((req, res) => {
    res.statusCode = 404;
    res.end('Not Found');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
