const  pool  = require("../models/connection");
const authenticator = require('otplib');
const totp = require('otplib');
const { all } = require("express/lib/application");

var CryptoJS = require("crypto-js");


module.exports.ativar2fa = async function (id) {
    try {
        let secret = totp.authenticator.generateSecret(20);
        let token = totp.authenticator.generate(secret);
        let sql = "UPDATE users SET user_secret = $1 , user_token = $2 WHERE user_id = $3";
        let result = await pool.query(sql, [secret,token,id]);
        return { status: 200, result: { msg: "Secret gerado com sucesso" } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
};

module.exports.refreshToken = async function () {
    try {

        let sql1 = "select * from users";
        var users = JSON.parse(JSON.stringify(await pool.query(sql1)))
        // console.log(pessoas.length)

        for(let i=0; i < users.length; i++){
            if(users[i].user_secret == null){
                void(0)
            }
            else{
                let token = totp.totp.generate(users[i].user_secret);
                let sql = "UPDATE users SET user_token = $1 where user_id = $2";

                let result = await pool.query(sql, [token, i+1]);
                let pessoa = result.rows
                console.log("boas"+ JSON.stringify(result))
                // console.log(pessoas[i].pessoa_token);
                // console.log(totp.totp.timeRemaining());
            }
        }
        return { status: 200, result: { msg: "Token updated com sucesso" } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
};

setInterval(this.refreshToken, 1000, "Updating...");

module.exports.updateTokens = async function() {
    try {

        let users = "select * from users";
        let usersresult = await pool.query(users);

        for (let i = 0; i < usersresult.rows.length; i++) {
            let token = totp.totp.generate(usersresult.rows[i].user_secret);
            console.log({user_id: i+1},{user_token: token});

            var JsonFormatter = {
                stringify: function(cipherParams) {
                    // create json object with ciphertext
                    var jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };

                    if (cipherParams.iv) {
                        jsonObj.iv = cipherParams.iv.toString();
                    }

                    // stringify json object
                    return JSON.stringify(jsonObj);
                },
                parse: function(jsonStr) {
                    // parse json string
                    var jsonObj = JSON.parse(jsonStr);

                    // extract ciphertext from json object, and create cipher params object
                    var cipherParams = CryptoJS.lib.CipherParams.create({
                        ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
                    });

                    if (jsonObj.iv) {
                        cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
                    }

                    return cipherParams;
                }
            };

            var encrypted = CryptoJS.AES.encrypt(token, usersresult.rows[i].user_secret, {
                format: JsonFormatter
            });
            var decrypted = CryptoJS.AES.decrypt(encrypted, usersresult.rows[i].user_secret, {
                format: JsonFormatter
            });
            decrypted.toString(CryptoJS.enc.Utf8);

            console.log( {
                "key": CryptoJS.enc.Base64.stringify(encrypted.key),
                "iv": CryptoJS.enc.Base64.stringify(encrypted.iv),
                "encrypted": CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
                "decrypted": decrypted.toString(CryptoJS.enc.Utf8),
            });


            let sql ="update users "+
                "set user_token = $1, user_tokeniv = $2, user_tokenkey = $3 where user_id = $4";
            let result = await pool.query(sql,[CryptoJS.enc.Base64.stringify(encrypted.ciphertext),CryptoJS.enc.Base64.stringify(encrypted.iv),CryptoJS.enc.Base64.stringify(encrypted.key),i+1]);
        }
        return { status:200 };

    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
}

module.exports.verifySecret = async function(secret) {
    try {

        let user ="select * from users where user_secret = $1";
        let resultuser = await pool.query(user,[secret.secretcode]);

        if(resultuser.rowCount == 1) {
            if(resultuser.rows[0].user_check == false) {
                let sql ="update users "+
                    "set user_check = true where user_id = $1";
                let result = await pool.query(sql,[resultuser.rows[0].user_id]);
                console.log("Secret: "+secret.secretcode+" atualizada")
                return { status:200, result:result.rows[0]};
            } else {
                return { status:500, result:"Secret em uso"};
            }
        } else {
            return { status:500, result:"Secret inválida"};
        }
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
}

module.exports.getTokenBySecret = async function(secret) {
    try {
        let sql ="select user_token, user_tokenkey, user_tokeniv from users where user_secret = $1";
        let result = await pool.query(sql,[secret]);
        let token = result.rows[0];
        return { status:200, result:token};
    } catch (err) {
        console.log(err);
        return { status:500, result: err};
    }
}