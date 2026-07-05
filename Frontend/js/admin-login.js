const adminLoginForm = document.getElementById("adminLoginForm");
const adminUsername = document.getElementById("adminUsername");
const adminPassword = document.getElementById("adminPassword");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const loginMessage = document.getElementById("loginMessage");

if(adminLoginForm){

    adminLoginForm.addEventListener("submit",function(e){

        e.preventDefault();

        usernameError.textContent="";
        passwordError.textContent="";

        const username=adminUsername.value.trim();
        const password=adminPassword.value.trim();

        if(username===""){
            usernameError.textContent="Enter Username";
            return;
        }

        if(password===""){
            passwordError.textContent="Enter Password";
            return;
        }

        if(username==="admin" && password==="1234"){

            localStorage.setItem("smartQueueAdminLoggedIn","true");

            window.location.href="admin-dashboard.html";

        }else{

            loginMessage.textContent="Invalid Username or Password";
            loginMessage.style.color="red";

        }

    });

}