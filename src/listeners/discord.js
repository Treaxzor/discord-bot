const config = require('config');
const discordService = require('../services/discordService');
const dbService = require('../services/dbService');

if (config.discord.enabled) {
  discordService.client.ws.on('INTERACTION_CREATE', async interaction => {
    if (interaction.data.name == "enroll") {
      const email = interaction.data.options.filter(x => x.name == 'email')[0].value.trim().toLowerCase();

      // ack interaction
      discordService.client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 2,
        }
      });

      if (!interaction.guild_id) {
        const user = await discordService.getUser(interaction.user.id);
        user.send("This command needs to be executed in server's channel");
        return;
      }


      const guild = await discordService.getGuild(interaction.guild_id);
      const member = await discordService.getGuildMember(guild, interaction.member.user.id)
      const role = await discordService.getGuildRole(guild, config.role.id)

      if (member.roles.cache.has(role.id)) {
        member.send('You are allready in the group');
        return;
      }


      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!re.test(email)) {
        member.send('Invalid email format');
        return;
      }
      const customer = await dbService.get(email);
      if (!customer) {
        member.send('This email address has not enrolled to krypton! Telegram support coming soon!');
        return;
      }

      if (customer.discord_id) {
        member.send('This email address has been allready binded');
        return;
      }

      await dbService.bind(email, guild.id, member.id, member.user.username);
      member.roles.add(role.id);
      member.send('Thank you! You have been granted access to Krypton Chats');
    }
  });

  discordService.client.on("message", (message) => {
    if (message.channel.id == config.channels.activation.id) {
      message.delete();
    }
  });
}
