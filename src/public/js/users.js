async function deleteInactiveUsers() {
  try {
    const response = await fetch(`/api/users`, {
      method: "DELETE",
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert("Error removing inactive users");
    }
  } catch (error) {
    console.log(error);
  }
}

async function changeRole(id) {
  try {
    const response = await fetch(`/api/users/premium/${id}`, {
      method: "GET",
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert("Error changing users role");
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert("Error removing user");
    }
  } catch (error) {
    console.log(error);
  }
}
