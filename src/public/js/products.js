const cartTable = document.getElementById("productsContainer");

async function addProduct(cid, pid, uid) {
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST",
    });
    if (response.ok) {
      alert("Product added to cart");
    } else {
      alert("Error adding product to cart");
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(cid, pid, uid) {
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Product deleted from cart");
    } else {
      alert("Error adding product to cart");
    }
  } catch (error) {
    console.log(error);
  }
}
