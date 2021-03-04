const config = require('config');
const util = require('util');
const fs = require('fs');
const Sequelize = require('sequelize');
const credentials = config.database;

const connection = new Sequelize(credentials.database, credentials.user, credentials.password, credentials.options);


const migrate = async () => {
  const migrationsTableExistQuery = await connection.query("SELECT to_regclass('public.migrations_history')", {
    type: "SELECT"
  });

  if (migrationsTableExistQuery.length == 0 || !migrationsTableExistQuery[0].to_regclass) {
    await connection.query('CREATE TABLE migrations_history (id BIGSERIAL NOT NULL,created_at timestamp with time zone not null default now(),name VARCHAR NOT NULL)', {
      type: "CREATE"
    })
  }

  const existingMigrations = await connection.query("select name from migrations_history", {
    type: "SELECT"
  })

  const readDirAsync = util.promisify(fs.readdir);
  const readFileASync = util.promisify(fs.readFile);
  const files = await readDirAsync("migrations");
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (existingMigrations.map((x) => x.name).indexOf(file) !== -1) {
      continue;
    }
    const content = await readFileASync("migrations" + "/" + file);
    try {
      await connection.query(content.toString());
      await connection.query('insert into migrations_history(name) values(:name)', {
        replacements: {
          name: file,
        },
        type: "INSERT"
      })
    }
    catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = {
  migrate,
  connection
}