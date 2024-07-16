const sql = require("./mysql");
const { Router, json } = require("express");

const router = Router();

router.use(json());

router.get("/users", async (req, res, next) => {
  try {
    const { n = 10, p = 0 } = req.query;
    const limit = +n || 10;
    const skip = n * p || 0;
    const [[count]] = await sql.query("SELECT COUNT(*) AS count FROM users");
    const [users] = await sql.query("SELECT * FROM users LIMIT ?, ?", [skip, limit]);
    res.status(200).json({ data: { users, count } });
  } catch (error) {
    console.log(error);
    next({ status: 500, message: error.message });
  }
});

router.post("/user", async (req, res, next) => {
  try {
    const { name = null, email = null } = req.body;
    const [result] = await sql.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    console.log("post result", result);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    next({ status: 500, message: error.message });
  }
});

router.get("/user/:uid", async (req, res, next) => {
  try {
    const { uid = "" } = req.params;
    if (!uid) return next({ status: 400, message: "Missing user id in path" });
    const [[user]] = await sql.query("SELECT * FROM users WHERE id = ?", [uid]);
    if (!user) return next({ status: 400, message: `User with id ${uid} not found` });
    res.status(200).json({ data: { user } });
  } catch (error) {
    console.log(error);
    next({ status: 500, message: error.message });
  }
});

router.put("/user/:uid", async (req, res, next) => {
  try {
    const { uid = "" } = req.params;
    const { name = null, email = null } = req.body;
    if (!uid) return next({ status: 400, message: "Missing user id in path" });
    const [result] = await sql.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      uid,
    ]);
    console.log("put result", result);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    next({ status: 500, message: error.message });
  }
});

router.patch("/user/:uid", async (req, res, next) => {
  try {
    const { uid = "" } = req.params;
    const { name = null, email = null } = req.body;
    if (!uid) return next({ status: 400, message: "Missing user id in path" });
    if (!(name || email)) return next({ status: 400, message: "Missing user data for update" });
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    const [result] = await sql.query("UPDATE users SET ? WHERE id = ?", [updates, uid]);
    console.log("patch result", result);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    next({ status: 500, message: error.message });
  }
});

router.delete("/user/:uid", async (req, res, next) => {
  try {
    const { uid = "" } = req.params;
    if (!uid) return next({ status: 400, message: "Missing user id in path" });
    const [result] = await sql.query("DELETE FROM users WHERE id = ?", [uid]);
    console.log("delete result", result);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    next({ status: 500, message: error.message });
  }
});

router.use("*", (req, res) => {
  console.log("Route Not Found ❌", req.originalUrl);
  res.status(404).json({ error: "Not Found ❌" });
});

router.use((error, _, res, __) => {
  console.log("Something went wrong ❗", error);
  res.status(error.status ?? 500).json({ error: error.message ?? "Something went wrong ❗" });
});

module.exports = router;
