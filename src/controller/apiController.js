const { connection } = require('../db');
const config = require('config');
const CsvParser = require('csv-parser');
const { Duplex } = require('stream');
const dbService = require('../services/dbService')
const discordService = require('../services/discordService');

const filter = async (req, res) => {
  let { search, limit, offset } = req.query;

  if (limit == undefined) {
    limit = 10;
  }

  if (offset == undefined) {
    offset = 0
  }

  let total = 0;
  if (!search) {
    const totalQuery = await connection.query('select count(1) as count from customers', {
      type: 'SELECT'
    });
    total = totalQuery[0].count;
  } else {
    const totalQuery = await connection.query("select count(1) as count from customers where email  LIKE '%' || :search || '%';", {
      replacements: {
        search
      },
      type: 'SELECT'
    });
    total = totalQuery[0].count;
  }

  let records = [];

  if (!search) {
    records = await connection.query("select * from customers order by created_at desc limit :limit offset :offset", {
      replacements: {
        limit,
        offset
      },
      type: 'SELECT'
    });
  } else {
    records = await connection.query("select * from customers where email  LIKE '%' || :search || '%' order by created_at desc limit :limit offset :offset", {
      replacements: {
        limit,
        offset,
        search
      },
      type: 'SELECT'
    });
  }

  res.json({
    total,
    rows: records.map(x => {
      return {
        email: x.email,
        invoice: x.krypton_invoice_id,
        hasTelegram: x.has_telegram,
        telegramId: x.telegram_id,
        hasKrypton: x.has_krypton,
        isManual: x.is_manual,
        discordUserName: x.discord_name
      }
    })
  })
}

const add = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      isValid: false,
      errors: ['Email is mandatory']
    })
  }

  const customer = await dbService.get(email);
  if (customer) {
    return res.json({
      isValid: false,
      errors: ['Customer with email allready exists']
    })
  }

  await connection.query('INSERT INTO customers (email,is_manual) values(:email,true)', {
    replacements: {
      email: email.toLowerCase()
    }
  })

  res.json({
    isValid: true,
    errors: []
  })
}

const remove = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      isValid: false,
      errors: ['Email is mandatory']
    })
  }

  const customer = await dbService.get(email);
  if (!customer) {
    return res.json({
      isValid: false,
      errors: ['Customer with email does not exist']
    })
  }
  if (customer.discord_guild_id) {
    await discordService.removeRole(customer.discord_guild_id, customer.discord_id, config.role.id)
  }
  await connection.query('delete from customers where email = :email', {
    replacements: {
      email
    }
  })

  res.json({
    isValid: true,
    errors: []
  })
}

const telegramUpload = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.json({
      isValid: false,
      errors: ['Invalid input']
    })
  }

  try {
    const rows = await new Promise((resolve, err) => {
      const results = [];
      var duplex = new Duplex();
      duplex.push(req.files.file.data);
      duplex.push(null)
      duplex.pipe(CsvParser({ separator: ';' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => resolve(results))
    });

    await Promise.all(rows.map(async (row) => {
      const customer = await dbService.get(row.email);
      if (customer && !customer.has_telegram) {
        await connection.query('update customers set has_telegram = true, telegram_id = :telegramId where email =:email', {
          replacements: {
            email: row.email,
            telegramId: row.userId
          },
          type: 'UPDATE'
        })
      }
      if (!customer) {
        await connection.query('insert into customers (email,has_telegram,telegram_id) values(:email,true,:telegramId)', {
          replacements: {
            email: row.email.toLowerCase(),
            telegramId: row.userId
          },
          type: 'INSERT'
        })
      }
    }))

  } catch (e) {
    console.log(e.message);
    return res.json({
      isValid: false,
      errors: ['Failed to proccess csv file']
    })
  }
  return res.json({
    isValid: true,
    errors: []
  });
}

const kryptonUpload = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.json({
      isValid: false,
      errors: ['Invalid input']
    })
  }

  try {
    const rows = await new Promise((resolve, err) => {
      const results = [];
      var duplex = new Duplex();
      duplex.push(req.files.file.data);
      duplex.push(null)
      duplex.pipe(CsvParser({ separator: ',' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => resolve(results))
    });

    await Promise.all(rows.map(async (row) => {
      await connection.query('insert into customers (email,has_krypton) values (:email,true)', {
        replacements: {
          email: row['Customer Email'].toLowerCase()
        },
        type: 'INSERT'
      })
    }))
  } catch (e) {
    console.log(e.message);
    return res.json({
      isValid: false,
      errors: ['Failed to proccess csv file']
    })
  }
  return res.json({
    isValid: true,
    errors: []
  });
}

module.exports = {
  filter,
  add,
  remove,
  telegramUpload,
  kryptonUpload
}