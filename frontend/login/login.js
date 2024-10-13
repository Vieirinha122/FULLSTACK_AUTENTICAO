const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("https://fullstack-autenticao.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg);
            // Redirecionar ou salvar token localmente
        } else {
            alert(data.msg);
        }
    } catch (error) {
        console.error("Erro ao fazer login", error);
    }
});