const { EmbedBuilder, ButtonStyle } = require("discord.js");
const Discord = require('discord.js');
const config = require("../config");
let prefix = config.prefix
const db = require("croxydb");

exports.run = async (client, message, args) => {

    const embed = new EmbedBuilder()

    if (!message.member.roles.cache.has(config.anonim_yetkili)) return message.reply({ embeds: [embed.setColor("Red").setDescription(`Bunu yapmaya yetkiniz yok.`)] })

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]); // etiketlenen üyeyi çekiyoruz
    if (!member) return message.reply({ embeds: [embed.setColor("Red").setDescription(`Bir kullanıcı belirtin.`)] })

    const data = db.get(`yasaklanmis_${member.id}`)

    if (data) {
        const sistem_embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${member} adlı üyenin yasağı başarıyla kaldırıldı!`)

        db.delete(`yasaklanmis_${member.id}`)
        message.channel.send({ embeds: [sistem_embed] })
    } else {
        const sistem_embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${member} adlı üye yasaklanmamış.`)

        message.channel.send({ embeds: [sistem_embed] })
    }
};
exports.conf = {
    aliases: ["yasakkaldır", "yasak-kaldir", "yasakkaldir"]
};

exports.help = {
    name: "yasak-kaldır"
};