var PessoaId;

async function login() {
    try {
        let obj = {
            email: document.getElementById("email").value,
            password: document.getElementById("pass").value,
        };

        let pessoa = await $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://twofaapi.fly.dev/user/login1",
            method: "post",
            dataType: "json",
            data: JSON.stringify(obj),
            contentType: "application/json",
        });

        sessionStorage.setItem("PessoaId", JSON.stringify(pessoa.user_id));
        PessoaId = sessionStorage.getItem("PessoaId", JSON.stringify(pessoa.user_id));

        let pessoas = await $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://twofaapi.fly.dev/user/"+PessoaId,
            method: "get",
            dataType: "json",
            contentType: "application/json",
        });

        if(pessoas.user_secret == null){
            window.location = "events.html";
        }
        else{
            let token = prompt("Please enter your token:");

            if(pessoas.user_token == token){
                window.location = "events.html";
            }
            else{
                alert("ERRRO")
            }
        }

    } catch (err) {
        document.getElementById("msg").innerText = err.responseJSON.msg;
    }
}