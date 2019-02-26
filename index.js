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
server.post("/api/zoos/", (req, res) => {
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
//get list of zoos

server.get("/api/zoos/", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// get list of zoos by id

server.get("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//update zoos
server.put("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db("zoos")
          .where({ id: req.params.id })
          .first()
          .then(zoo => {
            res.status(200).json(zoo);
          });
      } else {
        res.status(404).json({ message: "zoo not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
/*
server.put("/api/zoos/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  db("zoos")
    .where("id", id)
    .update(changes)
    .then(change => {
      res.status(200).json(change);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
*/
const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
