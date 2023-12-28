const form = document.getElementById('restoreForm')

const urlParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams,param) => searchParams.get(param)
})

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value,key) => obj[key] = value)
    obj.token = urlParams.token
    const response = await fetch('/api/sessions/password-restore',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    })