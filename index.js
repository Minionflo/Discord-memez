const fs            = require('fs')
const Discord       = require('discord.js')
const reddit        = require('scrap-reddit')

var client = new Discord.Client()
var config_token = process.env.TOKEN
var config_prefix = process.env.PREFIX
var config_status = process.env.STATUS
var config_statustype = process.env.STATUSTYPE
if(fs.existsSync("seen.txt") == false) {fs.writeFileSync("seen.txt", "")}
var seen = []
var auto = null

client.on('ready', () => {
    activity()
    setInterval(activity, 60000)
    console.log(`Online`)
})

function activity() {
    client.user.setActivity(config_status, {type: config_statustype})
}


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

        if (author.id != client.user.id && cont.startsWith(config_prefix)) {

            
            // 
            var invoke = cont.split(' ')[0].substr(config_prefix.length),
                args   = cont.split(' ').slice(1)
            
            
            if (invoke in cmdmap) {
                cmdmap[invoke](msg, args)
            }
        }

})

client.login(config_token)