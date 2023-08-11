function roleIsChosen() {
    if (!$("input[name='role']:checked").val()) {
        return false;
    }
    return true;
}
/*document.getElementById('auth_reg_form').onsubmit = function() {
    return roleIsChosen()
};*/
async function getMessage(event){
    event.preventDefault(); // предотвратить действие по умолчанию при отправке формы
    const form = document.getElementById('auth_reg_form')
    const prePayload = new FormData(form)
    const payload = new URLSearchParams(prePayload)

    console.log([...payload]);
    fetch('/auth/registration',{
        method: "POST",
        body: payload,
    })
        .then(res=>res.json())
        .then(data=>alert(data.message))
        .catch(err=>console.log(err))
}
window.onload = function() {
    const form = document.getElementById('auth_reg_form');
    form.addEventListener('submit', function(event) {
        if (roleIsChosen()) {
            getMessage(event);
        }else {
            alert("Вы не выбрали роль!");
        }
    });
}
