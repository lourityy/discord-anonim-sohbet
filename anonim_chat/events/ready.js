const client = require("../index");
const { Collection } = require("discord.js")
const fs = require("fs")
const config = require("../config.js")
let prefix = config.prefix
client.on("ready", () => {
    
    console.log(`${client.user.tag} Aktif!`)

    client.user.setActivity(`Anonim Chat Bot`) // durum mesajını buradan ayarlayabilirsiniz
//lourity

    client.commands = new Collection();
    client.aliases = new Collection();
    fs.readdir("./commands/", (err, files) => {
        if (err) console.error(err);
        console.log(`Toplamda ${files.length} Komut Var!`);
        files.forEach(f => {
            let props = require(`../commands/${f}`);

            console.log(`${props.help.name} Komutu Yüklendi!`);

            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
        });
    });
// lourity
});
