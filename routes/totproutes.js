var express = require('express');
var router = express.Router();
var tModel = require("../models/totpModel");


router.put('/refreshToken',async function(req, res, next) {
    console.log("Tokens Refreshed");
    let result = await tModel.refreshToken();
    res.status(result.status).send(result.result);
});

router.put('/ativar2fa',async function(req, res, next) {
    let PessoaId = req.body.id;
    console.log("Pedido enviado with id "+PessoaId);
    let result = await tModel.ativar2fa(PessoaId);
    res.status(result.status).send(result.result);
});


router.put('/updatetokens', async function(req, res, next) {
    let result = await tModel.updateTokens();
    res.status(result.status).send(result.result);
});

router.put('/verifysecret', async function(req, res, next) {
    let secret = req.body;
    let result = await tModel.verifySecret(secret);
    res.status(result.status).send(result.result);
});

module.exports = router;