"use strict";

const login = document.querySelector(".loginForm");

const loginFn = async (user) => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();

  const token = data.token;
  localStorage.setItem("token", token);
  if (data.status === "success") {
    window.location.replace("task.html");
  } else {
    console.log(data);
    alert(data.message);
  }
};

login.addEventListener("submit", async (e) => {
  e.preventDefault();
  const loginEmail = login.loginName.value;
  const loginPass = login.loginPwd.value;
  const loginUser = {
    email: loginEmail,
    password: loginPass,
  };
  await loginFn(loginUser);
});
