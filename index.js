const core = require('@actions/core');

const fs = require('fs');
const request = require('sync-request');

var status = true,
    alive = [],
    dead = [];

try {

    // == INPUT ==

    // `file` input defined in action metadata file
    const filename = core.getInput('file');
    
    // == WORKFLOW ==

    console.log(`[+] Trying to read the file: ${filename}`);
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err)
            core.setFailed(`[-] ${err.message}`);
        else {

            // Get the URLs
            console.log("[+] Getting URLs...")
            rurls = /\]\(https?:\/\/.*?\)/g;
            urls = data.match(rurls);
            
            // Check the status
            for (let url of urls) {
                url = url.substring(2, url.length - 1);
                console.log(`[*] Request: ${url}`)
                res = request('GET', url, { headers: { "user-agent": "Actions!" } });
            
                if (res.statusCode !== undefined && res.statusCode !== 404)
                    alive.push(url);
                else
                    dead.push(url);
            }
            
            // == OUTPUT ==
            
            status = dead.length == 0;
            core.setOutput("status", status);
            core.setOutput("deadlinks", dead);

            if(!status)
                core.setFailed(`[-] Dead links: ${dead}`);
        }
    });
    
} catch (error) {
    core.setFailed(`[-] ${error.message}`);
}