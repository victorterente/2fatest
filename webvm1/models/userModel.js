const  pool  = require("../models/connection");


module.exports.getAllPessoas = async function () {
    try {
        let sql = "Select * from users";
        let result = await pool.query(sql);
        let pessoa = result.rows;

        return { status: 200, result: pessoa };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
};

module.exports.GetProfileById = async function(id) {
    try {
        let sql = "select * from users where user_id = $1";
        let result = await pool.query(sql,[id]);
        console.log("id= "+ result)
        let pessoa = result.rows.length
        console.log("id= "+ JSON.stringify(result))

        if (result.rows.length > 0)

            return {status: 200, result: result.rows[0] };
        else return {status: 404, result: {msg: "Pessoa  not found!"}};
    } catch(err) {
        console.log(err);
        return {status:500, result: err};
    }
};

module.exports.registerPessoa = async function (nome, email, pass) {
    try {
        var sql = "SELECT * FROM users WHERE user_email =$1";
        let result = await pool.query(sql, [email]);
        if (result.length > 0)
            return { status: 401, result: { msg: "Já está registado" } };
        else {
            var sql = 'INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3)';
            let result = await pool.query(sql, [nome, email, pass,])
            return { status: 200, result: { msg: "registado com sucesso" } };;
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
};

module.exports.getLogin = async function (pessoa) {
    console.log("[PessoaModels.getUser] Login = " + JSON.stringify(pessoa));
    if (typeof pessoa != "object") {
        if (pessoa.errMsg)
            return {status: 400, data: {msg: pessoa.errMsg}};
        else
            return {status: 400, data: {msg: "Malformed data"}};
    }
    try {
        let sql = `select * from users WHERE user_email = $1 AND user_password = $2`;
        let result = await pool.query(sql,[pessoa.email,pessoa.password]);
        let pessoaResult = result.rows;
        if (pessoaResult.length > 0) {
            console.log("[userModel.getUser] user = " + JSON.stringify(pessoaResult[0]));
            return {status: 200, data: pessoaResult[0]};
        } else {
            return {status: 404, data: {msg: "User not found."}};
        }

    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    }

}

module.exports.getLogin1 = async function (pessoa) {
    console.log("[PessoaModels.getUser] Login = " + JSON.stringify(pessoa));
    if (typeof pessoa != "object") {
        if (pessoa.errMsg)
            return {status: 400, data: {msg: pessoa.errMsg}};
        else
            return {status: 400, data: {msg: "Malformed data"}};
    }
    try {
        let sql = `select * from users WHERE user_email = $1 AND user_password = $2 AND user_token = $3`;
        let result = await pool.query(sql,[pessoa.email,pessoa.password,pessoa.token]);
        let pessoaResult = result.rows;
        if (pessoaResult.length > 0) {
            console.log("[userModel.getUser] user = " + JSON.stringify(pessoaResult[0]));
            return {status: 200, data: pessoaResult[0]};
        } else {
            return {status: 404, data: {msg: "User not found."}};
        }

    } catch (err) {
        console.log(err);
        return {status: 500, data: err};
    }

}
