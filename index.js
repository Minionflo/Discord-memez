const fs            = require('fs')
const Discord       = require('discord.js')
const reddit        = require('scrap-reddit')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
var client = new Discord.Client()
if(fs.existsSync("seen.txt") == false) {fs.writeFileSync("seen.txt", "")}
if(fs.existsSync("config.json") == false) {fs.writeFileSync("config.json", '{\n    "dc_token": "TOKEN",\n    "dc_prefix": "pls-",\n    "dc_status": "Reddit",\n    "dc_statustype": "WATCHING"\n}')}
var seen = []
var auto = null

client.on('ready', () => {
    client.user.setActivity(config.dc_status, {type: config.dc_statustype})
    console.log(`Online`)
})


var cmdmap = {
    meme : cmd_meme,
    start : cmd_start,
    stop : cmd_stop,
    clear : cmd_clear
}

async function cmd_meme(msg, args) {
    var post = await reddit.randomPost("memes")
    if(seen.includes(post.data.url) == false) {
        if(post.data.url.slice(-3) == "jpg") {
            client.channels.cache.get("853735822410645504").send(post.data.url).then(meme => meme.crosspost())
            console.log("Memed!! JPG")
        } else if(post.data.url.slice(-3) == "png") {
            client.channels.cache.get("853735822410645504").send(post.data.url).then(meme => meme.crosspost())
            console.log("Memed!! PNG")
        } else if(post.data.url.slice(-3) == "gif") {
            client.channels.cache.get("853735822410645504").send(post.data.url).then(meme => meme.crosspost())
            console.log("Memed!! GIF")
        } else {
            console.log("Not Memed!! :(")
        }
    } else {
        console.log("Not Memed! :(")
    }
    seen = fs.readFileSync('seen.txt').toString().split("\n");
    seen.push(post.data.url)
    fs.writeFileSync("./seen.txt", seen.join('\n'))
}

async function cmd_start(msg, args) {
    if(args[0] != null) {
        var interval_args = args[0]
        var interval = interval_args*1000
        console.log(interval)
        client.channels.cache.get("853735822410645504").send("Sending meme every " + interval_args + " seconds :)")
        auto = setInterval(cmd_meme, interval);
    } else {
        client.channels.cache.get("853735822410645504").send("pls-start (interval in S)")
    }
}
async function cmd_stop(msg, args) {
    clearInterval(auto)
    client.channels.cache.get("853735822410645504").send("Stoped sending memez :(")
}

async function cmd_clear(msg, args) {
    fs.writeFileSync("seen.txt", "")
    client.channels.cache.get("853735822410645504").send("Cleared seen")
}


client.on('message', (msg) => {
    var cont   = msg.content,
        member = msg.member,
        chan   = msg.channel,
        guild  = msg.guild,
        author = msg.author

        if(msg.channel != client.channels.cache.get("853735822410645504")) {return}

        if (author.id != client.user.id && cont.startsWith(config.dc_prefix)) {

            
            // 
            var invoke = cont.split(' ')[0].substr(config.dc_prefix.length),
                args   = cont.split(' ').slice(1)
            
            
            if (invoke in cmdmap) {
                cmdmap[invoke](msg, args)
            }
        }

})

client.login(config.dc_token)