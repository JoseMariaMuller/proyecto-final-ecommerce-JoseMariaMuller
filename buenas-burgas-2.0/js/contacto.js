document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const submitBtn = form.querySelector("button[type='submit']");

    if (!form) return;

    // Validaciones personalizadas
    function validarCampos() {
        const campos = ["nombre", "email", "asunto", "mensaje"];
        for (let campo of campos) {
            const input = form[campo];
            if (!input.value.trim()) {
                input.classList.add("is-invalid");
                return false;
            } else {
                input.classList.remove("is-invalid");
            }
        }
        return true;
    }

    // Mostrar alerta animada
    function mostrarAlerta(tipo, mensaje, icono) {
        status.innerHTML = `
      <div class="alert alert-${tipo} mt-3 animate__animated animate__fadeIn">
        <span class="me-2">${icono}</span>${mensaje}
      </div>
    `;
        setTimeout(() => {
            status.innerHTML = "";
        }, 6000);
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        status.innerHTML = "";

        if (!validarCampos()) {
            mostrarAlerta("danger", "Por favor completá todos los campos obligatorios.", "❗");
            return;
        }

        // Loader en el botón
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...`;

        const data = {
            nombre: form.nombre.value,
            email: form.email.value,
            telefono: form.telefono.value,
            asunto: form.asunto.value,
            mensaje: form.mensaje.value
        };

        try {
            const res = await fetch("https://formspree.io/f/xrbgggkv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                mostrarAlerta("success", "Mensaje enviado correctamente.", "✅");
                form.reset();
            } else {
                mostrarAlerta("danger", "Hubo un error al enviar el mensaje.", "❌");
            }
        } catch (err) {
            mostrarAlerta("danger", "Error de red. Intentalo de nuevo.", "⚠️");
        }

        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Enviar";
    });
});
