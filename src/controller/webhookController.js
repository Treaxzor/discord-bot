const { connection } = require('../db');
const config = require('config');
const discordService = require('../services/discordService');
const dbService = require('../services/dbService');

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
  if (!req.headers["x-auth"] || req.headers["x-auth"] != config.security) {
    return res.sendStatus(401);
  }

  const data = decodeURIComponent(req.body.raw);
  const rows = data.split('&');
  const obj = {};

  rows.map(x => {
    const row = x.split("=");
    obj[row[0]] = row[1]
    return row;
  })

  if (obj.product_name == 'My+first+plan' || obj.product_name == 'Year') {
    if (obj.txn_type == 'recurring_payment_suspended' || obj.txn_type == 'recurring_payment_profile_cancel') {
      const email = obj.payer_email;
      const customer = await dbService.get(email);
      if (customer) {
        if (customer.has_krypton) {
          await connection.query('update customers set has_telegram = false, subscription_id = null where email = :email', {
            replacements: {
              email,
            }
          })
        } else {
          await connection.query('delete from customers where email = :email', {
            replacements: {
              email,
            }
          })
        }
      }
    } else if (obj.txn_type == 'recurring_payment_profile_created') {
      const email = obj.payer_email;
      const subscriptionId = obj.recurring_payment_id;
      const customer = await dbService.get(email);
      if (customer) {
        await connection.query('update customers set has_telegram = true, subscription_id = :subId where email = :email', {
          replacements: {
            email,
            subId: subscriptionId
          }
        })
      } else {
        await connection.query('insert into customers (has_telegram,subscription_id,email) values(true,:subId,:email)', {
          replacements: {
            email,
            subId: subscriptionId
          }
        })
      }
    } else {
      await connection.query('insert into test_logs(data) values(:data)', {
        replacements: {
          data: JSON.stringify(obj)
        },
        type: 'INSERT'
      })
    }
  } else {
    await connection.query('insert into test_logs(data) values(:data)', {
      replacements: {
        data: JSON.stringify(obj)
      },
      type: 'INSERT'
    })
  }



  res.send();
}

module.exports = {
  payKickStartWeHook,
  paypal
}