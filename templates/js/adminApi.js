function LogOut() {
  localStorage.clear();
  window.location.assign("http://192.168.0.134/bwahahaha/login");
}

// User Section
function userFetch(result, name) {
  document.getElementById("tbody").innerHTML = "";
  let t = result ? result : token;
  fetch(`/users`, {
    method: "Get",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + t,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      for (const user of result.users) {
        users = name ? name : username;
        if (user !== users) {
          let myHtmlContent = `<td>${user}</td>
                    <td><span  style='cursor:pointer;'data-bs-toggle="modal"
                data-bs-target="#deleteModal"  data-bs-whatever=${user}><i class="bi bi-trash3-fill"></i></span> </td>`;
          let tableRef = document.getElementById("tbody");
          let newRow = tableRef.insertRow(tableRef.rows.length);
          newRow.innerHTML = myHtmlContent;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
userFetch();
function AddUser() {
  let username = document.getElementById("addusername").value;
  let password = document.getElementById("addpassword").value;
  document.getElementById("adderror").innerHTML += "";
  fetch("/user", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((result) => {
      userFetch();
      document.getElementById("addClose").click();
    })
    .catch((error) => {
      document.getElementById("adderror").innerHTML += error.message;
    });
}
function EditUser() {
  let username = document.getElementById("editusername").value;
  document.getElementById("adderror").innerHTML += "";
  fetch(`/user/${username}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      userFetch();
      document.getElementById("modal-title").innerHTML = ``;
      document.getElementById("userName").innerHTML = "";
      document.getElementById("modal-title").innerHTML = `Hi ${username}`;
      document.getElementById("userName").innerHTML = username;
      localStorage.setItem("username", username);
      localStorage.setItem("token", result.token);
      userFetch(result.token, username);
      document.getElementById("editClose").click();
    })
    .catch((error) => {
      document.getElementById("editerror").innerHTML += error.message;
    });
}
let deleteUsername;
let exampleModal = document.getElementById("deleteModal");
exampleModal.addEventListener("show.bs.modal", function (event) {
  let button = event.relatedTarget;
  deleteUsername = button.getAttribute("data-bs-whatever");
});
function DeleteUser() {
  document.getElementById("adderror").innerHTML += "";
  fetch(`/user/${deleteUsername}`, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
  })
    .then((result) => {
      userFetch();
      document.getElementById("DeleteClose").click();
    })
    .catch((error) => {
      document.getElementById("adderror").innerHTML += error.message;
    });
}

// Type Section
function typeFetch() {
  document.getElementById("typestbody").innerHTML = "";
  fetch(`/type`, {
    method: "Get",
  })
    .then((response) => response.json())
    .then((result) => {
      for (const types of result) {
        let myHtmlContent = `<td>${types.type}</td>
        <td><span  style='cursor:pointer;'data-bs-toggle="modal"
    data-bs-target="#edittype"  data-bs-whatever=${types.id}><i class='bx bxs-edit-alt'></i></span> </td>
    <td><span  style='cursor:pointer;'data-bs-toggle="modal"
    data-bs-target="#deletetype"  data-bs-whatever=${types.id}><i class="bi bi-trash3-fill"></i></span> </td>`;
        let tableRef = document.getElementById("typestbody");
        let newRow = tableRef.insertRow(tableRef.rows.length);
        newRow.innerHTML = myHtmlContent;
        let option = `<option value=${types.type}>${types.type}</option>`;
        document.getElementById("floatingSelect").innerHTML += option;
        document.getElementById("editfloatingSelect").innerHTML += option;
        let showType = `<option value=${types.type}>${types.type}</option>`;
        document.getElementById("typeQuery").innerHTML += showType;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
typeFetch();
function AddType() {
  let typeName = document.getElementById("addnewType").value;
  document.getElementById("addtypeerror").innerHTML += "";
  fetch("/type", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      type: typeName,
    }),
  })
    .then((result) => {
      typeFetch();
      document.getElementById("addtypeClose").click();
    })
    .catch((error) => {
      document.getElementById("addtypeerrorr").innerHTML += error.message;
    });
}

let editType;
let editTypeModal = document.getElementById("edittype");
editTypeModal.addEventListener("show.bs.modal", function (event) {
  let button = event.relatedTarget;
  editType = button.getAttribute("data-bs-whatever");
});
function EditType() {
  let typeName = document.getElementById("editnewType").value;
  document.getElementById("edittypeerror").innerHTML += "";
  fetch(`/type/${editType}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      type: typeName,
    }),
  })
    .then((result) => {
      typeFetch();
      document.getElementById("edittypeClose").click();
    })
    .catch((error) => {
      document.getElementById("edittypeerror").innerHTML += error.message;
    });
}

let deleteType;
let deleteTypeModal = document.getElementById("deletetype");
deleteTypeModal.addEventListener("show.bs.modal", function (event) {
  let button = event.relatedTarget;
  deleteType = button.getAttribute("data-bs-whatever");
});
function deleteAlltypes() {
  fetch(`/type/${deleteType}`, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
  })
    .then((result) => {
      typeFetch();
      document.getElementById("DeletetypeClose").click();
    })
    .catch((error) => {
      console.log(error);
    });
}

// show Section
let nameQuery;
let totalEpsQuery;
let typeQuery;
let link = `/shows`;
function handleQuery() {
  nameQuery = document.getElementById("showNameQuery").value;
  totalEpsQuery = document.getElementById("totalEpsQuery").value;
  typeQuery = document.getElementById("typeQuery").value;

  function setUrlParams(url, key, value) {
    const dummyBaseUrl = "https://dummy-base-url.com";
    const result = new URL(url, dummyBaseUrl);
    result.searchParams.set(key, value);
    return result.toString().replace(dummyBaseUrl, "");
  }
  function deleteUrlParams(url, key) {
    const dummyBaseUrl = "https://dummy-base-url.com";
    const result = new URL(url, dummyBaseUrl);
    result.searchParams.delete(key);
    return result.toString().replace(dummyBaseUrl, "");
  }
  console.log(nameQuery, totalEpsQuery, typeQuery);
  if (
    nameQuery !== "none" &&
    totalEpsQuery !== "none" &&
    typeQuery !== "none"
  ) {
    link = `/show?name=${nameQuery}&totalEps=${totalEpsQuery}&type=${typeQuery}`;
  } else if (
    nameQuery !== "none" ||
    totalEpsQuery !== "none" ||
    typeQuery !== "none"
  ) {
    if (nameQuery !== "none") {
      link = setUrlParams(link, "name", nameQuery);
    } else if (totalEpsQuery !== "none") {
      link = setUrlParams(link, "totalEps", totalEpsQuery);
    } else if (typeQuery !== "none") {
      link = setUrlParams(link, "type", typeQuery);
    }
  } else if (
    nameQuery === "none" &&
    totalEpsQuery === "none" &&
    typeQuery === "none"
  ) {
    if (nameQuery === "none") {
      link = deleteUrlParams(link, "name");
    } else if (totalEpsQuery === "none") {
      link = deleteUrlParams(link, "totalEps");
    } else if (typeQuery === "none") {
      link = deleteUrlParams(link, "type");
    }
  }
  console.log(link);
  showFetch(link);
}

function showFetch(link) {
  document.getElementById("showstbody").innerHTML = "";
  let l = link ? link : `/shows`;
  fetch(l, {
    method: "Get",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      for (const show of result) {
        let myHtmlContent = `<td style='padding-left:13px;'>${show.name}</td> 
                               <td style='padding-left:18px;'>${show.totalEps}</td> 
                             <td style='padding-left:11px;'>${show.type}</td>
                      <td><span  style='cursor:pointer;'data-bs-toggle="modal"
                  data-bs-target="#editshow"  data-bs-whatever=${show.id}><i class='bx bxs-edit-alt'></i></span> </td>
                  <td><span  style='cursor:pointer;'data-bs-toggle="modal"
                  data-bs-target="#deleteshow"  data-bs-whatever=${show.id}><i class="bi bi-trash3-fill"></i></span> </td>
                  `;
        let tableRef = document.getElementById("showstbody");
        let newRow = tableRef.insertRow(tableRef.rows.length);
        newRow.innerHTML = myHtmlContent;
        let showName = `<option value=${show.name}>${show.name}</option>`;
        document.getElementById("showNameQuery").innerHTML += showName;
        let showEps = `<option value=${show.totalEps}>${show.totalEps}</option>`;
        document.getElementById("totalEpsQuery").innerHTML += showEps;
      }
      if (!link) dropdown();
    })
    .catch((error) => {
      console.log(error);
    });
}

showFetch();

function AddShow() {
  let showName = document.getElementById("showName").value;
  let totaeps = document.getElementById("totaeps").value;
  let type = document.getElementById("floatingSelect").value;
  document.getElementById("showerror").innerHTML += "";
  fetch("/show/", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      name: showName,
      totalEps: parseInt(totaeps),
      type: type,
    }),
  })
    .then((result) => {
      showFetch();
      document.getElementById("showClose").click();
    })
    .catch((error) => {
      document.getElementById("showerror").innerHTML += error.message;
    });
}

let deleteShow;
let showModal = document.getElementById("deleteshow");
showModal.addEventListener("show.bs.modal", function (event) {
  let button = event.relatedTarget;
  deleteShow = button.getAttribute("data-bs-whatever");
});
function deleteAllshows() {
  fetch(`/show/${deleteShow}`, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
  })
    .then((result) => {
      showFetch();
      document.getElementById("DeleteshowClose").click();
    })
    .catch((error) => {
      console.log(error);
    });
}

let editShow;
let editshowModal = document.getElementById("editshow");
editshowModal.addEventListener("show.bs.modal", function (event) {
  let button = event.relatedTarget;
  editShow = button.getAttribute("data-bs-whatever");
  fetch(`/show/${editShow}`, {
    method: "Get",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      document.getElementById("editshowName").value = result[0].name;
      document.getElementById("edittotaeps").value = result[0].totalEps;
      document.getElementById("editfloatingSelect").value = result[0].type;
    })
    .catch((error) => {
      console.log(error);
    });
});
function EditShow() {
  let showName = document.getElementById("editshowName").value;
  let totaeps = document.getElementById("edittotaeps").value;
  let type = document.getElementById("editfloatingSelect").value;
  document.getElementById("showerror").innerHTML += "";
  fetch(`/show/${editShow}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      name: showName,
      totalEps: parseInt(totaeps),
      type: type,
    }),
  })
    .then((result) => {
      showFetch();
      document.getElementById("editshowClose").click();
    })
    .catch((error) => {
      document.getElementById("showerror").innerHTML += error.message;
    });
}
