const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    try {
        const response = await fetch("https://fullstack-autenticao.onrender.com/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, senha, confirmpassword }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg);
            // Redirecionar ou fazer algo após o cadastro
        } else {
            alert(data.msg);
        }
    } catch (error) {
        console.error("Erro ao fazer cadastro", error);
    }
});