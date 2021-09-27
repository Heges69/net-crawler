const axios = require('axios').default
const ping = require('ping')
const fs = require('fs');
const { mcInfo } = require('mc-info.js')
const mcinfo = new mcInfo()

var first = 207;
var second = 244;
var third = 225;
var fourth = 0;
async function scanIP(host){
    process.title = `Scanning ${host}`
    return new Promise((sol, err) => {
        ping.sys.probe(host, al => {
            sol(al);
        }, {extra: ['-n', '1']})
    })
}
function getIP(){
    fourth++;
    if(fourth == 254){
        fourth = 0;
        third++;
    }
    if(third == 255){
        third = 0;
        second++;
    }
    if(second == 255){
        second = 0;
        first++;
    }
    if(first == 255){
        first = 0;
        return 'DONE'
    }
    return `${first}.${second}.${third}.${fourth}`
}
(async () => {
    setInterval(() => {
        let ip = getIP()
        scanIP(ip).then(async res => {
            if(res){
                try{
                    const server = await mcinfo.fetchServer(ip)
                    //console.log(server)
                    console.log(`Found IP ${ip}`)
                    let data = fs.readFileSync('./output.txt', 'utf-8');
                    data += `\n${ip}`;
                    fs.writeFileSync('./output.txt', data)
                    axios.post("Discord webhook url here", {
                        'content': `Found server. IP: ${ip} Version: ${server.version}`
                    })
                }catch(e){
                    console.log(`${ip} no server found`)
                }    
            }
        })
    }, 25)
})()
