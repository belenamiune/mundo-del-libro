let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {});
modal.show();

// Modal para guardar la información del usuario
saveUserData = () => {
    let userNameInput = document.getElementById("userName");
    let userEmailInput = document.getElementById("userEmail");
    
    const userObj = {
        userName: userNameInput.value,
        email: userEmailInput.value
    }
    localStorage.setItem("user", JSON.stringify(userObj));

    modal.hide();
};
