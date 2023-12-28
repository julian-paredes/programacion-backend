
const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(loginForm)
    const obj = {}
    data.forEach((value,key) => obj[key] = value);

    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    const result = await response.json()
    if (response.status === 200) {
        window.location.replace('/')
    }
})

async function restorePassword() {
    Swal.fire({
        text: 'Ingresa tu correo electrónico para restaurar tu contraseña',
        input: 'text',
        inputValidator: (value) => {
            return !value && 'Es necesario un correo electrónico para enviar el enlace de restauración'
        },
        inputLabel: 'Tu correo',
        inputPlaceholder: 'Ingresa tu correo electrónico'
    }) .then(async result => {
        try {
            console.log(result)
            if(result.value){
                const email = result.value
                const response = await fetch('/api/sessions/restorePassword', {
                    method: 'POST',
                    body: JSON.stringify({email}),
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
                Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado',
                    text: 'Se ha enviado un correo electrónico para restaurar tu contraseña'
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al enviar el correo electrónico'
            })
        }
    })
}
