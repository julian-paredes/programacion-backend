const ticket = document.getElementById("ticket");
const finish = document.getElementById("finish");

const ticketResponse = async () => {
  const user = await fetch("/api/sessions/current", {
    method: "GET",
  }).then((response) => response.json());

  const idCart = user.payload.cart;
  const resp = await fetch(`/api/carts/${idCart}/purchase`, {
    method: "POST",
  }).then((resp) => resp.json());

  const data = resp.payload;
  const newticket = data.newTicket
  const products = newticket.products


  if (data) {
    ticket.innerHTML = `<h4>Ticket: ${newticket.code}</h4>
                        <p>Usuario: ${data.name}</p>
                        <p>Email: ${user.payload.email}</p>
                        <p>Fecha: ${newticket.purchaser_datetime}</p>
                        <p>Productos:</p>
                       <table>
                       <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Precio unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${products
                        .map((product) => {
                          return `<tr>
                                    <td>${product.product.title}</td>
                                    <td>$ ${product.product.price}</td>
                                    <td>${product.quantity}</td>
                                    <td>$ ${
                                      product.quantity * product.product.price
                                    }</td>
                                  </tr>`;
                        })
                        .join("")}
                        <tr>
                        <td></td><td></td><td><strong>Total</strong></td><td><strong>$ ${
                            newticket.amount
                        }</strong></td>
                        </tr>
                        
                    </tbody>
                    </table>
                   `;
  }
  finish.addEventListener("click", async () => {
    Swal.fire({
      icon: "success",
      title: "Muchas gracias por tu compra!",
      text: "Se envió un correo con los detalles de su compra.",
      confirmButtonText: "Ok",
    }).then(async () => {

      const deleteCart = await fetch(`/api/carts/${idCart}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      ticket.innerHTML = "";
      window.location.href = "/";
    });
  });
};

ticketResponse();