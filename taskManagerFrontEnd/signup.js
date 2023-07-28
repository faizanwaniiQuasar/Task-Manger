const signUp = document.querySelector(".signUpForm");
const signInUser = async (signIn) => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signIn),
  });
  const data = await response.json();
  console.log(data.status);
  if (data.status === "succes") {
    window.location.replace("login.html");
  } else {
    alert(data.message);
  }
};
signUp.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = signUp.signUpName.value;
  const email = signUp.signUpEmail.value;
  const pass = signUp.signUpPass.value;
  const conPass = signUp.signUpConPass.value;
  const signIn = {
    name: name,
    email: email,
    password: pass,
    confirmPassword: conPass,
  };
  await signInUser(signIn);
});
