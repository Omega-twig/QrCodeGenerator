const contentInput = document.getElementById('content');
const logoFile = document.getElementById('logo-file');
const fgColor = document.getElementById('fg-color');
const bgColor = document.getElementById('bg-color');
const marginInput = document.getElementById('margin');
const radiusInput = document.getElementById('radius');
const sizeInput = document.getElementById('size-input');
const qrBox = document.getElementById('qr-box');
const qrImage = document.getElementById('photo');

let base64Logo = "";

logoFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            base64Logo = event.target.result;
            generateQR();
        };
        reader.readAsDataURL(file);
    }
});

const getHex = (el) => el.value.replace('#', '');

function generateQR(forceSize = null) {
    const text = encodeURIComponent(contentInput.value.trim() || "QR Studio");
    const fg = getHex(fgColor);
    const bg = getHex(bgColor);
    const margin = marginInput.value;
    const radius = radiusInput.value;
    const size = forceSize || sizeInput.value;

    document.getElementById('m-val').innerText = margin;
    document.getElementById('r-val').innerText = radius;
    document.getElementById('s-val').innerText = sizeInput.value;

    qrBox.style.borderRadius = `${radius}px`;
    qrImage.style.borderRadius = `${radius}px`;
    qrBox.style.backgroundColor = bgColor.value;

    let url = `https://quickchart.io/qr?text=${text}&dark=${fg}&light=${bg}&margin=${margin}&size=${size}`;
    if (base64Logo) {
        url += `&centerImageUrl=${encodeURIComponent(base64Logo)}&centerImageSize=0.2`;
    }
    qrImage.src = url;
    return url;
}

async function downloadQR() {
    const size = 1000;
    const radius = parseInt(radiusInput.value) * (size / 300);
    const highResUrl = generateQR(size);

    try {
        const response = await fetch(highResUrl);
        const blob = await response.blob();
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = window.URL.createObjectURL(blob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;

            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.arcTo(size, 0, size, size, radius);
            ctx.arcTo(size, size, 0, size, radius);
            ctx.arcTo(0, size, 0, 0, radius);
            ctx.arcTo(0, 0, size, 0, radius);
            ctx.closePath();
            ctx.clip();

            ctx.fillStyle = bgColor.value;
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);

            const finalUrl = canvas.toDataURL("image/png");
            const a = document.createElement('a');
            a.href = finalUrl;
            a.download = `QR-Studio-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    } catch (e) {
        alert("Download Failed");
    }
}

[fgColor, bgColor, marginInput, radiusInput, sizeInput].forEach(input => {
    input.addEventListener('input', () => generateQR());
});

document.getElementById('gen-btn').addEventListener('click', () => generateQR());
document.getElementById('save-btn').addEventListener('click', downloadQR);

document.getElementById('reset-btn').addEventListener('click', () => {
    contentInput.value = '';
    logoFile.value = '';
    base64Logo = '';
    fgColor.value = '#000000';
    bgColor.value = '#ffffff';
    marginInput.value = 2;
    radiusInput.value = 20;
    sizeInput.value = 300;
    generateQR();
});

generateQR();