const socketClient = io();

function addProduct(cid, pid) {
  socketClient.emit("addToCart", { cid, pid });
}

socketClient.on("addedToCart", data => {
  alert(data.message);
});

function deleteProduct(cid, pid) {
  socketClient.emit("deleteFromCart", { cid, pid });
}

socketClient.on("deletedFromCart", data => {
  alert(data.message);
});
