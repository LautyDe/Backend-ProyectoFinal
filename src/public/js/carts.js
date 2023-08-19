const cartTable = document.getElementById("table");

cartTable?.addEventListener("click", async e => {
  e.preventDefault();
  const cartId = cartTable.getAttribute("data-cart-id");
  const element = e.target;
  const productId = element.getAttribute("data-product-id");
  if (element.className === "delete") {
    try {
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        document.location.reload();
      } else {
        alert("Error removing product from the cart");
      }
    } catch (error) {
      console.error(error);
    }
  } else if (element.className === "increase") {
    try {
      const quantity = parseInt(element.getAttribute("data-quantity"));
      const stock = parseInt(element.getAttribute("data-stock"));
      if (quantity + 1 > stock) {
        alert("Not enough stock");
        return;
      }
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: quantity + 1 }),
        }
      );
      if (response.ok) {
        document.location.reload();
      } else {
        alert("Error increasing quantity");
      }
    } catch (error) {
      console.error(error);
    }
  } else if (element.className === "decrease") {
    try {
      const quantity = parseInt(element.getAttribute("data-quantity"));
      if (quantity - 1 <= 0) {
        return;
      }
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: quantity - 1 }),
        }
      );
      if (response.ok) {
        document.location.reload();
      } else {
        alert("Error decreasing quantity");
      }
    } catch (error) {
      console.error(error);
    }
  } else if (element.className === "purchase") {
    try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Purchase complete!!!");
        document.location.reload();
      } else {
        alert("Error completing purchase");
      }
    } catch (error) {
      console.error(error);
    }
  }
});
