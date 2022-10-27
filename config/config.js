
module.exports = {
"development": {
  "username": process.env.USERNAME,
  "password": process.env.PASSWORD,
  "database": process.env.DATABASE,
  "host": process.env.USERNAME,
  "dialect": "mysql",
  "use_env_variable": "JAWSDB_URL"
},
"test": {
  "username": process.env.USERNAME,
  "password": process.env.PASSWORD,
  "database": process.env.DATABASE,
  "host": process.env.USERNAME,
  "dialect": "mysql",
  "use_env_variable": "JAWSDB_URL"
},
"production": {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.USERNAME,
    "dialect": "mysql",
    "use_env_variable": "JAWSDB_URL"
}
};

