const { connection } = require('../db');

const bind = async (email, guildId, memberId, memberName) => {
  await connection.query('update customers set discord_id = :memberId, discord_name = :memberName, discord_guild_id = :guildId where email = :email', {
    replacements: {
      email,
      memberId,
      memberName,
      guildId
    }
  })
}

const get = async (email) => {
  const query = await connection.query('select id, has_telegram, has_krypton, discord_id,discord_guild_id, subscription_id from customers where email = :email', {
    replacements: {
      email
    },
    type: 'SELECT'
  });
  return query.length > 0 ? query[0] : null;
}


module.exports = {
  get,
  bind,
}