const { Client } = require('discord.js');
const config = require('config');

const client = new Client();
client.login(config.token);

const getGuild = async (id) => {
  return client.guilds.fetch(id);
}

const getGuildMember = async (guild, id) => {
  return guild.members.fetch(id)
}

const getGuildRole = async (guild, id) => {
  return guild.roles.fetch(id);
}

const removeRole = (guildId, memberId, roleId) => {
  const guild = await getGuild(guildId);
  const member = await getGuildMember(guild, memberId);
  member.roles.remove(roleId);
}

module.exports = {
  client,
  getGuild,
  getGuildMember,
  getGuildRole,
  removeRole
}