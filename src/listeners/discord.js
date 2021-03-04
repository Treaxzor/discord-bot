const { Client } = require('discord.js');
const config = require('config');
const dbService = require('../services/dbService');

const client = new Client();

client.ws.on('INTERACTION_CREATE', async interaction => {
  if (interaction.data.name == "enroll") {
    const email = interaction.data.options.filter(x => x.name == 'email')[0].value.trim().toLowerCase();

    // ack interaction
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 2,
      }
    });

    if (!interaction.guild_id) {
      const user = await client.users.fetch(interaction.user.id);
      user.send("This command needs to be executed in server's channel");
      return;
    }


    const guild = await client.guilds.fetch(interaction.guild_id);
    const member = await guild.members.fetch(interaction.member.user.id)
    const role = await guild.roles.fetch(config.role.id)

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
      member.send('This email address has not enrolled to krypton or subscribed to telegram');
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

client.login(config.token);