var express = require("express");
var router = express.Router();
var mProd = require("../models/userModel");

router.post('/register',async function(req, res, next) {
    let nome = req.body.nome;
    let email = req.body.email;
    let pass = req.body.pass;
    let result = await mProd.registerPessoa(nome,email,pass);
    res.status(result.status).send(result.result);
});

router.post('/login1', async function(req, res, next) {

    let user = req.body
    console.log("[pessoaroutes] Login: " + JSON.stringify(user));
    let result = await mProd.getLogin(user);
    res.status(result.status).send(result.data);

});

router.post('/login2', async function(req, res, next) {

    let user = req.body
    console.log("[pessoaroutes] Login: " + JSON.stringify(user));
    let result = await mProd.getLogin1(user);
    res.status(result.status).send(result.data);

});
router.get("/:id", async function(req, res, next) {
    let id = req.params.id;
    console.log("Sending Profile with id "+id);
    let result = await mProd.GetProfileById(id);

    res.status(result.status).send(result.result);
});

router.get("/", async function (req, res, next) {
    let result = await mProd.getAllPessoas();
    res.status(result.status).send(result.result);
});
module.exports = router;