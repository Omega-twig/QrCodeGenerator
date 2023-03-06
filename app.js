let btn = document.getElementById("button-addon2");
let btnReset = document.getElementById("reset");
let input = document.getElementById("name");
let img = document.getElementById("photo");

btn.addEventListener("click", function () {

    let img = document.getElementById("photo");
    let input = document.getElementById("name");

    if (input.value === "") {
        alert("Enter Url To Generate Qr Code")
    } else {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${input.value}`
    }
});

btnReset.addEventListener("click",() =>{
    let img = document.getElementById("photo");
    let input = document.getElementById("name");
    input.value = ""
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example}`
});