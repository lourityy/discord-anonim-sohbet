const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const config = require("./config.js");
const Discord = require("discord.js")
const db = require("croxydb") // database
const fs = require("fs");

const client = new Client({
  partials: Object.values(Partials),
  intents: Object.values(GatewayIntentBits),
});
//lourity

module.exports = client;

require("./events/message.js")
require("./events/ready.js")


client.login(config.token || process.env.TOKEN)

client.on(`interactionCreate`, async interaction => {
  if (interaction.customId === "sohbet_baslat") {
    if (!db.get(`chat_datas_${interaction.user.id}`)) {

      const lourity = interaction.member.nickname
      const leftPart = lourity.split(config.isim_emoji)[0].trim();
      const rightPart = lourity.split(config.isim_emoji)[1].trim();

      const bio_embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription("> Sanırım sistemi ilk defa kullanıyorsun, lütfen biyografini yazmamı bekle.")
        .addFields(
          { name: "🏷️ Ad:", value: `\`\`\`${leftPart}\`\`\``, inline: true },
        )

      interaction.reply({ embeds: [bio_embed], ephemeral: true })
      //
      setTimeout(() => {
        const bio_embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
          .setDescription("> Sanırım sistemi ilk defa kullanıyorsun, biraz daha beklemelisin..")
          .addFields(
            { name: "🏷️ Ad:", value: `\`\`\`${leftPart}\`\`\``, inline: true },
            { name: "🔢 Yaş:", value: `\`\`\`${rightPart}\`\`\``, inline: true },
          )

        interaction.editReply({ embeds: [bio_embed], ephemeral: true })
      }, 2000);
      //
      setTimeout(() => {
        const bio_embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
          .setDescription("> Sanırım sistemi ilk defa kullanıyorsun, çok az kaldı...")
          .addFields(
            { name: "🏷️ Ad:", value: `\`\`\`${leftPart}\`\`\``, inline: true },
            { name: "🔢 Yaş:", value: `\`\`\`${rightPart}\`\`\``, inline: true },
            { name: "🏚️ Yaşadığın Şehir:", value: `\`\`\`Ayarlanmamış\`\`\``, inline: true },
          )

        interaction.editReply({ embeds: [bio_embed], ephemeral: true })
      }, 6000);
      //
      setTimeout(() => {

        const row = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setEmoji("🏷️")
              .setLabel("Adını Gir")
              .setStyle(Discord.ButtonStyle.Secondary)
              .setCustomId("kullanıcı_ad")
              .setDisabled(true)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setEmoji("🔢")
              .setLabel("Yaşını Gir")
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("kullanıcı_yas")
              .setDisabled(true)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setEmoji("🏚️")
              .setLabel("Şehrini Gir")
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("kullanıcı_sehir")
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setEmoji("🗒️")
              .setLabel("Özgeçmişini Gir")
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("kullanıcı_ozgecmis")
          )

        const bio_embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
          .setDescription("> İşlem tamamlandı, artık sohbet edebilirsin! :tada:")
          .addFields(
            { name: "🏷️ Ad:", value: `\`\`\`${leftPart}\`\`\``, inline: true },
            { name: "🔢 Yaş:", value: `\`\`\`${rightPart}\`\`\``, inline: true },
            { name: "🏚️ Yaşadığın Şehir:", value: `\`\`\`Ayarlanmamış\`\`\``, inline: true },
            { name: "🗒️ Özgeçmişin:", value: `\`\`\`Ayarlanmamış\`\`\``, inline: true },
          )
          .setThumbnail(interaction.user.displayAvatarURL())

        interaction.editReply({ embeds: [bio_embed], components: [row], ephemeral: true })
        db.set(`chat_datas_${interaction.user.id}`, { ad: leftPart, yas: rightPart })
      }, 10000);
    } else {

      const yasaklanmis_mi = db.get(`yasaklanmis_${interaction.user.id}`)

      const yasaklanmis_embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Anonim sohbet sisteminden yasaklanmışsınız, maalesef kullanamazsınız.")

      if (yasaklanmis_mi) return interaction.reply({ embeds: [yasaklanmis_embed], ephemeral: true })

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setEmoji("🎲")
            .setLabel("Sıraya Katıl")
            .setStyle(ButtonStyle.Success)
            .setCustomId("sira_katil")
        )

      const eslesme_secim_embed = new EmbedBuilder()
        .setColor("Blurple")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setTitle("Sıraya katıl... 🔄")
        .setDescription(`🎲 Sıraya katılmak için **butona tıkla** ve sohbet et!`)

      return interaction.reply({ embeds: [eslesme_secim_embed], components: [row], ephemeral: true })
    }
  }


  if (interaction.customId === "kullanıcı_biyografi") {

    const kbio_embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Görüntüleyebilecek bilginiz bulunmamakta, **sohbete başla** butonuna tıklayınız.")

    if (!db.get(`chat_datas_${interaction.user.id}`)) return interaction.reply({ embeds: [kbio_embed], ephemeral: true })

    const user_data = db.get(`chat_datas_${interaction.user.id}`) || "Ayarlanmamış";

    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("🏷️")
          .setLabel("Adını Gir")
          .setStyle(Discord.ButtonStyle.Secondary)
          .setCustomId("kullanıcı_ad")
          .setDisabled(true)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("🔢")
          .setLabel("Yaşını Gir")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("kullanıcı_yas")
          .setDisabled(true)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("🏚️")
          .setLabel("Şehrini Gir")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("kullanıcı_sehir")
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("🗒️")
          .setLabel("Özgeçmişini Gir")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("kullanıcı_ozgecmis")
      )

    const bio_embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setDescription("> Aşağıda bilgilerini görebilirsin, eğer yoksa ekle ve sohbete başla!")
      .addFields(
        { name: "🏷️ Ad:", value: `\`\`\`${user_data.ad || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🔢 Yaş:", value: `\`\`\`${user_data.yas || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🏚️ Yaşadığın Şehir:", value: `\`\`\`${user_data.sehir || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🗒️ Özgeçmişin:", value: `\`\`\`${user_data.ozgecmis || "Ayarlanmamış"}\`\`\``, inline: true },
      )

    return interaction.reply({ embeds: [bio_embed], components: [row], ephemeral: true })
  }


  const lourityModal = new ModalBuilder()
    .setCustomId('sehir_modal')
    .setTitle('Şehir | Biyografi')
  const a1 = new TextInputBuilder()
    .setCustomId('textmenu')
    .setLabel('Şehrinizi giriniz')
    .setStyle(TextInputStyle.Short)
    .setMinLength(4)
    .setMaxLength(17)
    .setPlaceholder('İstanbul')
    .setRequired(true)

  const row = new ActionRowBuilder().addComponents(a1);
  lourityModal.addComponents(row);

  if (interaction.customId === "kullanıcı_sehir") {
    await interaction.showModal(lourityModal);
  }
  //
  if (interaction.customId === 'sehir_modal') {

    const kbio_embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Bilgileriniz tam ayarlanmamış, lütfen **sohbete başla** butonuna tıklayın.")

    if (!db.get(`chat_datas_${interaction.user.id}`)) return interaction.reply({ embeds: [kbio_embed], ephemeral: true })

    const user_data = db.get(`chat_datas_${interaction.user.id}`) || "Ayarlanmamış";
    const sehir = interaction.fields.getTextInputValue("textmenu");

    const sehirler = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"]

    if (!sehirler.includes(sehir)) {
      const not_sehir = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Yazmış olduğunuz şehir Türkiye'de bulunmamkta veya geçerli değil.")

      return interaction.reply({ embeds: [not_sehir], ephemeral: true })
    } else {
      const bio_embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription("> Aşağıda bilgilerini görebilirsin, eğer yoksa ekle ve sohbete başla!")
        .addFields(
          { name: "🏷️ Ad:", value: `\`\`\`${user_data.ad || "Ayarlanmamış"}\`\`\``, inline: true },
          { name: "🔢 Yaş:", value: `\`\`\`${user_data.yas || "Ayarlanmamış"}\`\`\``, inline: true },
          { name: "🏚️ Yaşadığın Şehir:", value: `\`\`\`${sehir || "Ayarlanmamış"}\`\`\``, inline: true },
          { name: "🗒️ Özgeçmişin:", value: `\`\`\`${user_data.ozgecmis || "Ayarlanmamış"}\`\`\``, inline: true },
        )

      if (!user_data.ozgecmis) {
        db.set(`chat_datas_${interaction.user.id}`, { ad: user_data.ad, yas: user_data.yas, sehir: sehir })
      } else {
        db.set(`chat_datas_${interaction.user.id}`, { ad: user_data.ad, yas: user_data.yas, sehir: sehir, ozgecmis: user_data.ozgecmis })
      }

      return interaction.update({ embeds: [bio_embed], ephemeral: true })
    }
  }


  const lourityModalTwo = new ModalBuilder()
    .setCustomId('ozgecmis_modal')
    .setTitle('Özgeçmiş | Biyografi')
  const a2 = new TextInputBuilder()
    .setCustomId('textmenu')
    .setLabel('Özgeçmişinizi giriniz')
    .setStyle(TextInputStyle.Short)
    .setMinLength(5)
    .setMaxLength(50)
    .setPlaceholder('Kendinizi kısaca anlatın')
    .setRequired(true)

  const row1 = new ActionRowBuilder().addComponents(a2);
  lourityModalTwo.addComponents(row1);

  if (interaction.customId === "kullanıcı_ozgecmis") {
    await interaction.showModal(lourityModalTwo);
  }
  //
  if (interaction.customId === 'ozgecmis_modal') {

    const kbio_embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Bilgileriniz tam ayarlanmamış, lütfen **sohbete başla** butonuna tıklayın.")

    if (!db.get(`chat_datas_${interaction.user.id}`)) return interaction.reply({ embeds: [kbio_embed], ephemeral: true })

    const user_data = db.get(`chat_datas_${interaction.user.id}`) || "Ayarlanmamış";
    const ozgecmis = interaction.fields.getTextInputValue("textmenu");

    const bio_embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setDescription("> Aşağıda bilgilerini görebilirsin, eğer yoksa ekle ve sohbete başla!")
      .addFields(
        { name: "🏷️ Ad:", value: `\`\`\`${user_data.ad || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🔢 Yaş:", value: `\`\`\`${user_data.yas || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🏚️ Yaşadığın Şehir:", value: `\`\`\`${user_data.sehir || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🗒️ Özgeçmişin:", value: `\`\`\`${ozgecmis || "Ayarlanmamış"}\`\`\``, inline: true },
      )

    if (!user_data.sehir) {
      db.set(`chat_datas_${interaction.user.id}`, { ad: user_data.ad, yas: user_data.yas, ozgecmis: ozgecmis })
    } else {
      db.set(`chat_datas_${interaction.user.id}`, { ad: user_data.ad, yas: user_data.yas, sehir: user_data.sehir, ozgecmis: ozgecmis })
    }

    return interaction.update({ embeds: [bio_embed], ephemeral: true })
  }
  //
  if (interaction.customId === "sira_katil") {

    const eslesti_embed = new EmbedBuilder().setColor("Red").setDescription("Zaten bir eşleşmeye katılmışsınız.")
    if (db.get(`sirada_${interaction.user.id}`)) return interaction.reply({ embeds: [eslesti_embed], ephemeral: true })
    if (db.get(`eslesti_${interaction.user.id}`)) return interaction.reply({ embeds: [eslesti_embed], ephemeral: true })

    if (db.get(`karsilasma`)) {

      interaction.guild.channels.create({
        name: `sohbet-${interaction.user.username}`,
        type: Discord.ChannelType.GuildText,
        parent: config.anonim_chat_kategori,

        permissionOverwrites: [
          {
            id: interaction.guild.id, // everyone'nin kanalı görme yetkisini kapattık
            deny: [Discord.PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id, // sıraya katılan üyeye izin verdik
            allow: [Discord.PermissionsBitField.Flags.ViewChannel]
          },
        ]
      }).then((anonim_chat) => {

        const basari_embed = new EmbedBuilder().setColor("Green").setDescription(`Senin için bir sohbet kanalı oluşturdum ${anonim_chat} ↗️`)
        interaction.update({ embeds: [basari_embed], components: [] })

        const row = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setLabel("Sohbetten Ayrıl")
              .setStyle(ButtonStyle.Danger)
              .setCustomId("sohbetten_ayril")
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setEmoji("📨")
              .setLabel("Göster")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("goster")
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setEmoji("🏷️")
              .setLabel("Açıkla")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("acikla")
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setEmoji("⚒️")
              .setLabel("Raporla")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("rapor")
          )

        const anonim_embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Sohbete katıldınız... ✅")
          .setDescription(`・Şu anda biriyle eşleştin! İyi sohbetler dilerim.\n\n📨 **Göster** butonuna basarak karşıdakine biyografini atabilirsin.\n🏷️ **Açıkla** butonuna tıklayarakta kullanıcıya kim olduğunu gösterebilirsin.\n⚒️ **Raporla** butonuna basarak karşıdaki kullanıcıyı şikayet edebilirsin.`)
          .setThumbnail("https://media.discordapp.net/attachments/1130551356613218396/1131868838452011038/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png?width=640&height=640")

        const found_message = db.get(`karsilasmaMesaj`);
        const karsilasma_save = db.get(`karsilasma`)

        const channel = client.channels.cache.get(karsilasma_save.chatId);
        const edit = channel.messages.fetch(db.get(`karsilasmaMesaj`)).then(async message => {

          const anonim_embed_2 = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Sohbete katıldınız... ✅")
            .setDescription(`・Şu anda biriyle eşleştin! İyi sohbetler dilerim.\n\n📨 **Göster** butonuna basarak karşıdakine biyografini atabilirsin.\n🏷️ **Açıkla** butonuna tıklayarakta kullanıcıya kim olduğunu gösterebilirsin.\n⚒️ **Raporla** butonuna basarak karşıdaki kullanıcıyı şikayet edebilirsin.`)
            .setThumbnail("https://media.discordapp.net/attachments/1130551356613218396/1131868838452011038/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png?width=640&height=640")

          setTimeout(() => {
            message.edit({ embeds: [anonim_embed_2], components: [row] })
          }, 1000);

          db.set(`karsilasma_saved_${karsilasma_save.chatId}`, { chatId: anonim_chat.id, userId: interaction.user.id })
          db.set(`karsilasma_saved_${anonim_chat.id}`, { chatId: karsilasma_save.chatId, userId: karsilasma_save.userId })
          db.delete(`karsilasma`)
          db.delete(`karsilasmaMesaj`)
        })

        const eslesme_embed = new EmbedBuilder()
          .setColor("Yellow")
          .setDescription(`🔗 <@${karsilasma_save.userId}> adlı üye <@${interaction.user.id}> ile eşleşti!`)

        db.delete(`sirada_${karsilasma_save.userId}`)
        db.set(`eslesti_${interaction.user.id}`, karsilasma_save.userId)
        db.set(`eslesti_${karsilasma_save.userId}`, interaction.user.id)
        client.channels.cache.get(config.anonim_log).send({ embeds: [eslesme_embed] })
        return anonim_chat.send({ embeds: [anonim_embed], components: [row] })
      })
    } else {
      interaction.guild.channels.create({
        name: `sohbet-${interaction.user.username}`,
        type: Discord.ChannelType.GuildText,
        parent: config.anonim_chat_kategori,

        permissionOverwrites: [
          {
            id: interaction.guild.id, // everyone'nin kanalı görme yetkisini kapattık
            deny: [Discord.PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id, // sıraya katılan üyeye izin verdik
            allow: [Discord.PermissionsBitField.Flags.ViewChannel]
          },
        ]
      }).then((anonim_chat) => {

        const basari_embed = new EmbedBuilder().setColor("Green").setDescription(`Senin için bir sohbet kanalı oluşturdum ${anonim_chat} ↗️`)
        interaction.update({ embeds: [basari_embed], components: [] })

        const row = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setLabel("Sıradan Ayrıl")
              .setStyle(ButtonStyle.Danger)
              .setCustomId("siradan_ayril")
          )

        const anonim_embed = new EmbedBuilder()
          .setColor("Yellow")
          .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
          .setTitle("Sıraya katıldınız, eşleşmeyi bekleyiniz... 🔂")
          .setDescription(`・Sıradakilerden sana en uygununu bulmaya çalışıyorum, bu biraz sürebilir.`)
          .setThumbnail(interaction.user.displayAvatarURL())

        db.set(`karsilasma`, { chatId: anonim_chat.id, userId: interaction.user.id })
        anonim_chat.send({ embeds: [anonim_embed], components: [row] }).then((editor) => {
          db.set(`karsilasmaMesaj`, editor.id)
        })
      })
      db.set(`sirada_${interaction.user.id}`, interaction.user.id)
    }
  }


  if (interaction.customId === "siradan_ayril") {
    db.delete(`sirada_${interaction.user.id}`)
    if (db.get(`karsilasma`)) {
      if (db.get(`karsilasma`).chatId === interaction.channel.id) {
        db.delete(`karsilasma_saved_${interaction.channel.id}`)
        db.delete(`karsilasma`)
        db.delete(`karsilasmaMesaj`)

        const deleted = new EmbedBuilder()
          .setColor("Green")
          .setDescription(`${interaction.user} isteğin üzere seni sıradan çıkarıyorum.`)

        interaction.reply({ embeds: [deleted] })
        setTimeout(() => {
          interaction.channel.delete()
        }, 5000);
      }
    } else {
      const deleted = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`${interaction.user} isteğin üzere seni sıradan çıkarıyorum.`)

      interaction.reply({ embeds: [deleted] })
      setTimeout(() => {
        interaction.channel.delete()
      }, 5000);
    }
  }

  if (interaction.customId === "sohbetten_ayril") {
    const channel_data = db.get(`karsilasma_saved_${interaction.channel.id}`)
    const my_user = client.channels.cache.get(channel_data.chatId);

    const deleted = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`${interaction.user} isteğin üzere sohbeti sonlandırıyorum.`)

    const deleted_send = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`Karşıdaki kullanıcı sohbetin sonlandırılmasını istedi, sohbetiniz sonlandırılıyor...`)

    my_user.send({ embeds: [deleted_send] })
    interaction.reply({ embeds: [deleted] })

    setTimeout(() => {
      const eslesme = db.get(`eslesti_${interaction.user.id}`)
      db.delete(`eslesti_${eslesme}`)
      db.delete(`eslesti_${interaction.user.id}`)
      db.delete(`karsilasma_saved_${my_user.id}`)
      db.delete(`goster_saved_${my_user.id}`)
      db.delete(`acikla_saved_${my_user.id}`)
      try {
        if (interaction.channel.id) {
          db.delete(`karsilasma_saved_${interaction.channel.id}`)
          db.delete(`goster_saved_${interaction.channel.id}`)
          db.delete(`acikla_saved_${interaction.channel.id}`)
        }
      } catch (e) { }

      interaction.channel.delete()
      my_user.delete()
    }, 5000);
  }


  if (interaction.customId === "goster") {

    const updated_row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setLabel("Sohbetten Ayrıl")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("sohbetten_ayril")
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("📨")
          .setLabel("Göster")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("goster")
          .setDisabled(true)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("🏷️")
          .setLabel("Açıkla")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("acikla")
          .setDisabled(db.get(`acikla_saved_${interaction.channel.id}`) ? true : false)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("⚒️")
          .setLabel("Raporla")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("rapor")
      )


    interaction.update({ components: [updated_row] })

    const user_data = db.get(`chat_datas_${interaction.user.id}`) || "Ayarlanmamış";

    const bio_embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setDescription("> Şu anda konuştuğun kişi sana biyografisini gönderdi, sende göndermek istersen yukarıdaki **göster** butonuna tıklayabilirsin.")
      .addFields(
        { name: "🏷️ Adı:", value: `\`\`\`${user_data.ad || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🔢 Yaşı:", value: `\`\`\`${user_data.yas || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🏚️ Yaşadığı Şehir:", value: `\`\`\`${user_data.sehir || "Ayarlanmamış"}\`\`\``, inline: true },
        { name: "🗒️ Özgeçmişi:", value: `\`\`\`${user_data.ozgecmis || "Ayarlanmamış"}\`\`\``, inline: true },
      )

    db.set(`goster_saved_${interaction.channel.id}`, true)
    client.channels.cache.get(db.get(`karsilasma_saved_${interaction.channel.id}`).chatId).send({ embeds: [bio_embed] })
  }


  if (interaction.customId === "acikla") {
    const updated_row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setLabel("Sohbetten Ayrıl")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("sohbetten_ayril")
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("📨")
          .setLabel("Göster")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("goster")
          .setDisabled(db.get(`goster_saved_${interaction.channel.id}`) ? true : false)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("🏷️")
          .setLabel("Açıkla")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("acikla")
          .setDisabled(true)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("⚒️")
          .setLabel("Raporla")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("rapor")
      )

    interaction.update({ components: [updated_row] })

    const bio_embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setDescription("> Şu anda konuştuğun kişi sana kendini gösterdi, sende göstermek istersen yukarıdaki **açıkla** butonuna tıklayabilirsin.")
      .addFields(
        { name: "🏷️ Kullanıcı Adı:", value: `\`\`\`${interaction.user.username}\`\`\``, inline: true },
        { name: "🧩 Etiket:", value: `${interaction.user}`, inline: true },
      )
      .setThumbnail(interaction.user.displayAvatarURL())

    db.set(`acikla_saved_${interaction.channel.id}`, true)
    client.channels.cache.get(db.get(`karsilasma_saved_${interaction.channel.id}`).chatId).send({ embeds: [bio_embed] })
  }


  if (interaction.customId === "rapor") {
    const row = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('a1')
          .setPlaceholder('Rapor sebebini seç')
          .addOptions([
            {
              label: "Küfür, hakaret, cinsellik",
              description: "Rahatsız edici bir biçimde konuştu",
              emoji: "🤬",
              value: "kufur"

            },
            {
              label: "Reklam",
              description: "Reklam yaptı",
              emoji: "🔗",
              value: "reklam"

            },
            {
              label: "Sohbet incelensin",
              description: "Buna yetkililer karar versin",
              emoji: "🔍",
              value: "inceleme"

            },
          ])
      )

    interaction.reply({ content: "Aşağıdan rapor sebebini seç ve gerekeni yapalım!", components: [row], ephemeral: true })
  }

  if (interaction.isSelectMenu()) {
    if (interaction.values[0] === "kufur") {
      const updated_embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`Raporun başarıyla gönderildi, yetkililer gerekeni yapacaktır.`)

      interaction.update({ content: " ", embeds: [updated_embed], components: [] })

      const karsilasma_data = db.get(`karsilasma_saved_${interaction.channel.id}`);
      const rapor_kullanici = client.users.cache.get(karsilasma_data.userId);

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Üyeyi Yasakla")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("yasakla_uye")
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Rapor Edeni Yasakla")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("yasakla_raporcu")
        )

      const rapor_embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setAuthor({ name: `Rapor bildirimi` })
        .setDescription(`${interaction.user} adlı kişi bir kullanıcıyı şikayet etti.`)
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: "Şikayet edilen kullanıcı:", value: `${rapor_kullanici}`, inline: true },
          { name: "Şikayet sebebi:", value: "Küfür, hakaret, cinsellik", inline: true },
          { name: "Sohbet kanalları:", value: `${interaction.channel} <#${karsilasma_data.chatId}>`, inline: true },
        )
        .setThumbnail(interaction.user.displayAvatarURL())

      client.channels.cache.get(config.rapor_channel).send({ content: `${karsilasma_data.chatId}`, embeds: [rapor_embed], components: [row] })//sohbet mesajları gönderilecek

      const lock_row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Sohbeti Sil")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("sohbetten_ayril")
        )

      const rapor_chat = client.channels.cache.get(karsilasma_data.chatId);
      interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false });
      rapor_chat.permissionOverwrites.edit(karsilasma_data.userId, { ViewChannel: false });
      //yetkiliye izin verildi
      rapor_chat.permissionOverwrites.edit(config.anonim_yetkili, { ViewChannel: true });
      interaction.channel.permissionOverwrites.edit(config.anonim_yetkili, { ViewChannel: true });

      const channel_locked = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Bu sohbette bir kullanıcı raporlandı, bu sebeple **kanal kapatıldı**.`)

      interaction.channel.send({ embeds: [channel_locked], components: [lock_row] })
      rapor_chat.send({ embeds: [channel_locked], components: [lock_row] })
      db.set(`karsilasma_rapor_${karsilasma_data.chatId}`, { raporcu: interaction.user.id, raporedilen: karsilasma_data.userId });
      db.delete(`eslesti_${interaction.user.id}`)
      db.delete(`eslesti_${karsilasma_data.userId}`)
    }


    if (interaction.values[0] === "reklam") {
      const updated_embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`Raporun başarıyla gönderildi, yetkililer gerekeni yapacaktır.`)

      interaction.update({ content: " ", embeds: [updated_embed], components: [] })

      const karsilasma_data = db.get(`karsilasma_saved_${interaction.channel.id}`);
      const rapor_kullanici = client.users.cache.get(karsilasma_data.userId);

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Üyeyi Yasakla")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("yasakla_uye")
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Rapor Edeni Yasakla")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("yasakla_raporcu")
        )

      const rapor_embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setAuthor({ name: `Rapor bildirimi` })
        .setDescription(`${interaction.user} adlı kişi bir kullanıcıyı şikayet etti.`)
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: "Şikayet edilen kullanıcı:", value: `${rapor_kullanici}`, inline: true },
          { name: "Şikayet sebebi:", value: "Reklam yaptı", inline: true },
          { name: "Sohbet kanalları:", value: `${interaction.channel} <#${karsilasma_data.chatId}>`, inline: true },
        )
        .setThumbnail(interaction.user.displayAvatarURL())

      client.channels.cache.get(config.rapor_channel).send({ content: `${karsilasma_data.chatId}`, embeds: [rapor_embed], components: [row] })//sohbet mesajları gönderilecek

      const lock_row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Sohbeti Sil")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("sohbetten_ayril")
        )

      const rapor_chat = client.channels.cache.get(karsilasma_data.chatId);
      interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false });
      rapor_chat.permissionOverwrites.edit(karsilasma_data.userId, { ViewChannel: false });
      //yetkiliye izin verildi
      rapor_chat.permissionOverwrites.edit(config.anonim_yetkili, { ViewChannel: true });
      interaction.channel.permissionOverwrites.edit(config.anonim_yetkili, { ViewChannel: true });

      const channel_locked = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Bu sohbette bir kullanıcı raporlandı, bu sebeple **kanal kapatıldı**.`)

      interaction.channel.send({ embeds: [channel_locked], components: [lock_row] })
      rapor_chat.send({ embeds: [channel_locked], components: [lock_row] })
      db.set(`karsilasma_rapor_${karsilasma_data.chatId}`, { raporcu: interaction.user.id, raporedilen: karsilasma_data.userId });
      db.delete(`eslesti_${interaction.user.id}`)
      db.delete(`eslesti_${karsilasma_data.userId}`)
    }


    if (interaction.values[0] === "inceleme") {
      const updated_embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`Raporun başarıyla gönderildi, yetkililer gerekeni yapacaktır.`)

      interaction.update({ content: " ", embeds: [updated_embed], components: [] })

      const karsilasma_data = db.get(`karsilasma_saved_${interaction.channel.id}`);
      const rapor_kullanici = client.users.cache.get(karsilasma_data.userId);

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Üyeyi Yasakla")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("yasakla_uye")
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Rapor Edeni Yasakla")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("yasakla_raporcu")
        )

      const rapor_embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setAuthor({ name: `Rapor bildirimi` })
        .setDescription(`${interaction.user} adlı kişi bir kullanıcıyı şikayet etti.`)
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: "Şikayet edilen kullanıcı:", value: `${rapor_kullanici}`, inline: true },
          { name: "Şikayet sebebi:", value: "İnceleme istendi", inline: true },
          { name: "Sohbet kanalları:", value: `${interaction.channel} <#${karsilasma_data.chatId}>`, inline: true },
        )
        .setThumbnail(interaction.user.displayAvatarURL())

      client.channels.cache.get(config.rapor_channel).send({ content: `${karsilasma_data.chatId}`, embeds: [rapor_embed], components: [row] })//sohbet mesajları gönderilecek

      const lock_row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel("Sohbeti Sil")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("sohbetten_ayril")
        )

      const rapor_chat = client.channels.cache.get(karsilasma_data.chatId);
      interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false });
      rapor_chat.permissionOverwrites.edit(karsilasma_data.userId, { ViewChannel: false });
      //yetkiliye izin verildi
      rapor_chat.permissionOverwrites.edit(config.anonim_yetkili, { ViewChannel: true });
      interaction.channel.permissionOverwrites.edit(config.anonim_yetkili, { ViewChannel: true });

      const channel_locked = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Bu sohbette bir kullanıcı raporlandı, bu sebeple **kanal kapatıldı**.`)

      interaction.channel.send({ embeds: [channel_locked], components: [lock_row] })
      rapor_chat.send({ embeds: [channel_locked], components: [lock_row] })
      db.set(`karsilasma_rapor_${karsilasma_data.chatId}`, { raporcu: interaction.user.id, raporedilen: karsilasma_data.userId });
      db.delete(`eslesti_${interaction.user.id}`)
      db.delete(`eslesti_${karsilasma_data.userId}`)
    }
  }
//lourity
  if (interaction.customId === "yasakla_uye") {
    const rapor_data = db.get(`karsilasma_rapor_${interaction.message.content}`).raporedilen;

    const yasaklandi = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`<@${rapor_data}> adlı kullanıcı başarıyla yasaklandı.`)

    db.set(`yasaklanmis_${rapor_data}`, true)
    db.delete(`karsilasma_rapor_${interaction.message.content}`)
    interaction.update({ content: " ", embeds: [yasaklandi], components: [] })
  }


  if (interaction.customId === "yasakla_raporcu") {
    const rapor_data = db.get(`karsilasma_rapor_${interaction.message.content}`).raporcu;

    const yasaklandi = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`<@${rapor_data}> adlı kullanıcı başarıyla yasaklandı.`)

    db.set(`yasaklanmis_${rapor_data}`, true)
    db.delete(`karsilasma_rapor_${interaction.message.content}`)
    interaction.update({ content: " ", embeds: [yasaklandi], components: [] })
  }
})


client.on("messageCreate", async message => {
  const channel = db.get(`karsilasma_saved_${message.channel.id}`);
  if (!channel) return;
  if (message.author.bot) return;

  if (message.channel.name.includes("sohbet-")) {
    client.channels.cache.get(channel.chatId).send({ content: `${message.content}` })
  }
})
// lourity
//lourity