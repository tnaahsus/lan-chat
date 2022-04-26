let token = localStorage.getItem("token");
let username = localStorage.getItem("username");
let admin = localStorage.getItem("isAdmin");
if (!token) window.location.assign("http://192.168.0.134/bwahahaha/login");

function ciCompare(a, b) {
  return typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
    : a === b;
}
window.onload = () => {
  let url = window.location.href;
  url = url.split("?").pop();
  const argArray = new URLSearchParams(url);
  let query = argArray.has("section") ? argArray.get("section") : "";
  const data = ["users", "shows", "videos", "types"];
  if (query === "") {
    url = new URL(window.location.href);
    url.searchParams.append("section", data[0]);
    window.location.assign(url.href);
  } else {
    for (const datas of data) {
      if (ciCompare(query, datas)) {
        document.getElementById(`${datas}Section`).style.display = "flex";
        document.getElementById(`${datas}Icon`).style.color = "#11101d";
        document.getElementById(`${datas}linkName`).style.color = "#11101d";
        document.getElementById(`${datas}Sidebar`).style.background = "#fff";
        document.getElementById(`${datas}Section`).style.flexDirection =
          "column";
        document.getElementById(`${datas}Section`).style.justifyContent =
          "center";
        if (window.innerWidth > 420) {
          document.getElementById(`${datas}-table`).style.width =
            "calc(100% - 700px)";
          document.getElementById(`${datas}-Addbutton`).style.padding =
            "24px 40px";
        } else {
          document.getElementById(`${datas}-table`).style.width =
            "calc(100% - 100px)";
          document.getElementById(`${datas}-Addbutton`).style.padding = "15px";
        }
      }
      if (!ciCompare(query, datas)) {
        document.getElementById(`${datas}Section`).style.display = "none";
      }
    }
  }
};

function usernameFetcher(username) {
  fetch(`/user?username=${username}`, {
    method: "Get",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      // console.log(result)
    })
    .catch((error) => {
      // console.log(error)
    });
}
usernameFetcher(username);
