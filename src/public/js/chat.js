const socketClient = io();

socketClient.on("messages", data => {
  render(data);
});

function render(data) {
  const html = data
    .map(item => {
      return `<div class="message">
      <p class="messageUser">${item.user}:</p> <p class="messageText">${item.message}</p>
      </div>
      `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
}

function paramsValidator(message) {
  if (message.user && message.message) {
    return true;
  } else {
    if (!message.user) {
      throw new Error(`Falta el nombre de usuario (mail)`);
    } else if (!message.message) {
      throw new Error(`Falta escribir el mensaje`);
    }
  }
}

function addMessage() {
  const message = {
    user: document.getElementById("user").value,
    message: document.getElementById("message").value,
  };
  if (paramsValidator(message)) {
    socketClient.emit("newMessage", message);
    const form = document.getElementById("addMessageForm");
    form.reset();
  }
}
