async function addProduct(id) {
    const cart = document.cookie.split("=")[1]

    const response = await fetch(`/api/carts/${cart}/product/${id}`,{
        method:'POST'
    })

    const result = await response.json()
    console.log(result);
}

