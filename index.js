const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.db"
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
// Post to Zoos
server.post("/", (req, res) => {
  db("zoos")
    .insert(req.body)
    .then(ids => {
      const [id] = ids;

      db("zoos")
        .where({ id })
        .first()
        .then(zoo => {
          res.status(200).json(zoo);
        })
        .catch(err => {
          res.status(500).json(err);
        });
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
