const express = require("express");
const app = express();
const path = require("path");
const dbService = require('./data/db-connection');

const prospectQueryService = require("./data/prospect-qeury-service");
const schemaQueryService = require("./data/table-schema-query-service");

const port = process.env.port || 3000;

app.use(express.json());
app.use("/", express.static("client"));

// error handling middleware
app.use(function(err, req, res, next) {
  res.sendStatus(500);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get('/api/table/prospects', async (req, res) => {
  const prospects = await prospectQueryService.getAllProspects();
  const tableSchema = await schemaQueryService.getSchema();

  const prospectTableData = {
    tableSchema,
    prospects
  }

  res.send(prospectTableData);
});

app.get("/api/prospects", async (req, res) => {
  res.send(await prospectQueryService.getAllProspects());
});

app.post("/api/prospects", (req, res) => {
  prospectService.createProspect(req.body.name, req.body.email);
  res.sendStatus(201);
});

app.put("/api/prospects/:id", (req, res) => {
  prospectService.updateProspect(req.params.id, req.body);
  res.sendStatus(204);
});

app.delete("/api/prospects/:id", (req, res) => {
  prospectService.deleteProspect(req.params.id);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listing on ${port}!`);
});