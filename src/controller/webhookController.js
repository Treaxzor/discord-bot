const { connection } = require('../db');
const config = require('config');
const discordService = require('../services/discordService');

const payKickStartWeHook = async (req, res) => {
  if (!req.headers["x-auth"] || req.headers["x-auth"] != config.security) {
    return res.sendStatus(401);
  }
  const { type, email, invoice } = req.body;

  const existingQuery = await connection.query('select id,has_telegram,discord_guild_id,discord_id   from customers where email = :email', {
    replacements: {
      email: email,
    },
    type: 'SELECT'
  });

  let existing = null;

  if (existingQuery.length > 0) {
    existing = existingQuery[0];
  }

  if (type == "order") {
    if (existing) {
      await connection.query('update customers set krypton_invoice_id = :invoice, has_krypton = true, modified_at = :modifiedAt where id = :id', {
        replacements: {
          id: existing.id,
          invoice: invoice,
          modifiedAt: new Date()
        },
        type: "UPDATE"
      })
    } else {
      await connection.query('insert into customers(email,krypton_invoice_id,has_krypton) values(:email,:invoice,true)', {
        replacements: {
          email: email.toLowerCase(),
          invoice: invoice
        },
        type: "INSERT"
      })
    }
  }

  if (type == "refund") {
    if (existing) {
      if (existing.has_telegram) {
        await connection.query('update customers set krypton_invoice_id = :invoice, has_krypton = false, modified_at = :modifiedAt where id = :id', {
          replacements: {
            id: existing.id,
            invoice: invoice,
            modifiedAt: new Date()
          },
          type: "UPDATE"
        })
      } else {
        if (existing.discord_guild_id) {
          await discordService.removeRole(existing.discord_guild_id, existing.discord_id, config.role.id)
        }
        await connection.query('delete from customers where id = :id', {
          replacements: {
            id: existing.id,
          },
          type: "DELETE"
        })
      }
    }
  }

  return res.send();
}

const paypal = async (req, res) => {
  await connection.query('insert into test_logs(data) values(:data)', {
    replacements: {
      data: JSON.stringify(req.body)
    },
    type: 'INSERT'
  })

  res.send();
}

module.exports = {
  payKickStartWeHook,
  paypal
}