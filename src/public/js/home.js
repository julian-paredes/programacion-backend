async function addProduct(id) {
    const cart = getCookie('cart')

    try {
        if (cart) {
            const response = await fetch(`/api/carts/${cart}/product/${id}`,{
                method:'POST'
            })
        
            const result = await response.json()
            console.log(result);
        } else {
    
            const response = await fetch(`/api/carts/product/${id}`,{
                method:'POST'
            })
        
            const result = await response.json()
            console.log(result);
        }
    } catch (error) {
        console.log(error);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}