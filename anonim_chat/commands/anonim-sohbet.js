const { EmbedBuilder, ButtonStyle } = require("discord.js");
const Discord = require('discord.js');
const config = require("../config");
let prefix = config.prefix

exports.run = async (client, message, args) => {

    const embed = new EmbedBuilder()

    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.reply({ embeds: [embed.setColor("Red").setDescription(`Bunu yapmaya yetkiniz yok.`)] })

    message.delete().catch((lourity) => { })

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setEmoji("▶")
                .setLabel("Sohbete Başla")
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId("sohbet_baslat")
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setEmoji("👤")
                .setLabel("Biyografi")
                .setStyle(ButtonStyle.Success)
                .setCustomId("kullanıcı_biyografi")
        )

    const sistem_embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: `${message.guild.name} ・ Anonim Sohbet`, iconURL: message.guild.iconURL() })
        .setDescription(`> Anonim sohbet ile arkadaş edin, sohbet et!\n\n**Nedir** bu anonim sohbet?\n> İki tarafın birbirini görmeden/tanımadan sohbet edebildiği özel alandır.\n\n> Ayrıca **biyografi** butonuna basarak bilgilerini ayarlayabilirsin!`)

    message.channel.send({ embeds: [sistem_embed], components: [row] })
};
exports.conf = {
    aliases: ["anonimsohbet", "anonim-chat", "anonimchat"]
};

exports.help = {
    name: "anonim-sohbet"
};