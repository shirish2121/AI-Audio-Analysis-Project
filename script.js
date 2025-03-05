let currentHost = window.location.origin;

if (window.location.hostname != "localhost") {
  window.location.hostname = "localhost";
}

// document.addEventListener('DOMContentLoaded', (event) => {
//     const userId = localStorage.getItem('userId');

//     if (userId) {

//         // window.location.href = 'http://localhost:5503/dashboard.html'
//         window.location.href = `${currentHost}/dashboard.html`

//     } else{
//         window.location.href = 'http://localhost:5503/index.html';
//         window.location.href = `${currentHost}/index.html`
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const currentPage = window.location.pathname.split("/").pop(); // Get current page name

  if (!userId && currentPage !== "index.html") {
    // Redirect to login page if userId does not exist and not already on index.html
    // window.location.href = 'http://localhost:5503/index.html';
    window.location.href = `${currentHost}/index.html`;
  } else if (userId && currentPage !== "dashboard.html") {
    // Redirect to dashboard if userId exists and not already on dashboard.html
    // window.location.href = 'http://localhost:5503/dashboard.html';
    window.location.href = `${currentHost}/dashboard.html`;
  }
});

function signIn() {
  // let currentPageUri = window.location.href
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  let params = {
    client_id:
      "267548963194-rd8i1q3cbblnh5vvpj7goiircd0e1usf.apps.googleusercontent.com",
    // 'redirect_uri': 'http://localhost:5503/dashboard.html',
    // 'redirect_uri': 'http://localhost/dashboard.html',
    redirect_uri: `${currentHost}/dashboard.html`,
    response_type: "token",
    // 'scope': 'https://www.googleapis.com/auth/userinfo.profile',
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (const p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
