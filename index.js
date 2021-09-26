const axios = require('axios').default
const ping = require('ping')
var first = 172;
var second = 32;
var third = 0;
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
        scanIP(ip).then(res => {
            console.log(res);
            if(res){
                console.log(`Found IP ${ip}`)
                axios.post("dc webhook", {
                    'content': `IP: ${ip}`
                })
            }
        })
    }, 200)
})()
