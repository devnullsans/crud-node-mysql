require("dotenv").config();
const { env } = require("node:process");
const apiv0 = require("./apiv0");
const express = require("express");
const app = express();

app.use("/api/v0", apiv0);

app.listen(env.PORT, env.HOST, () => console.log(`server started at port ${env.PORT}`));
