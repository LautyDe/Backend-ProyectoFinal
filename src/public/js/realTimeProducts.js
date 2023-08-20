const socketClient = io();
const user = owner.value;
const userRole = role.value;

socketClient.on("products", data => {
  render(data);
});

function render(data) {
  const html = data
    .map(item => {
      const deleteButtonVisibility =
        user === item.owner || userRole === "admin" ? "block" : "none";
      return `<div class="product">
      <div>${item.title}</div>
      <div>${item.description}</div>
      <div>${item.price}</div>
      <img src='${
        item.thumbnail ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
      }' class='img'>
      <div>${item.category}</div>  
      <div>${item.stock}</div>
      <input type="button" value="Delete product 😭" onclick="deleteProduct('${
        item._id
      }')" style="display: ${deleteButtonVisibility}"></input>
      </div>
      `;
    })
    .join(" ");
  document.getElementById("productsContainer").innerHTML = html;
}

function paramsValidator(product) {
  if (
    product.title &&
    product.description &&
    product.price &&
    product.stock &&
    product.category
  ) {
    return true;
  } else {
    if (!product.title) {
      throw new Error(`Falta el title del producto.`);
    } else if (!product.description) {
      throw new Error(`Falta la descripcion del producto.`);
    } else if (!product.price) {
      throw new Error(`Falta el precio del producto.`);
    } else if (!product.stock) {
      throw new Error(`Falta el stock del producto.`);
    } else if (!product.category) {
      throw new Error(`Falta la categoria del producto.`);
    }
  }
}

function addProduct() {
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const productOwner = document.getElementById("owner").value;
  const userRole = document.getElementById("role").value;
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: parseInt(price),
    thumbnail: document.getElementById("thumbnail").value,
    category: document.getElementById("category").value,
    stock: parseInt(stock),
    owner: productOwner,
    role: userRole,
  };
  socketClient.emit("newProduct", product);
  const form = document.getElementById("formAddProduct");
  form.reset();
}

function deleteProduct(id) {
  socketClient.emit("deleteProduct", id);
}
