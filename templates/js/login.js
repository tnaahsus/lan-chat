function handle(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    document.getElementById("logInBtn").click();
  }
}

function logIN() {
  let username = document.getElementById("floatingInput").value;
  let password = document.getElementById("floatingPassword").value;
  document.getElementById("error").innerHTML += "";
  fetch("/login", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      Authorization: "Basic " + btoa(username + ":" + password),
    },
  })
    .then((response) => response.json())
    .then((result) => {
      localStorage.setItem("username", username);
      localStorage.setItem("token", result.token);
      localStorage.setItem("isAdmin", result.isAdmin);
      window.location.assign("http://192.168.0.134/bwahahaha/admin?section=users");
    })
    .catch((error) => {
      document.getElementById("error").innerHTML += error.message;
    });
}
