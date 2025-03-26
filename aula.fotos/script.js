const video = document.getElementById("camera");
const buttonColor = document.getElementById("capturarColor");
const buttonBW = document.getElementById("capturarBW");
const buttonToggle = document.getElementById("toggleCamera");
const canva = document.getElementById("foto");
let stream = null;

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (erro) {
        alert('Erro ao abrir a câmera');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
    }
}

function capturarFoto(pretoEBranco = false) {
    const contexto = canva.getContext('2d');
    canva.width = video.videoWidth;
    canva.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canva.width, canva.height);

    if (pretoEBranco) {
        const imageData = contexto.getImageData(0, 0, canva.width, canva.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
        }

        contexto.putImageData(imageData, 0, 0);
    }

    canva.style.display = 'block';
}

buttonColor.addEventListener('click', function () {
    capturarFoto(false);
});

buttonBW.addEventListener('click', function () {
    capturarFoto(true);
});

buttonToggle.addEventListener('click', function () {
    if (stream) {
        stopCamera();
        buttonToggle.textContent = 'Ativar Câmera';
    } else {
        startCamera();
        buttonToggle.textContent = 'Desativar Câmera';
    }
});

function adicionarFoto(src) {
    const album = document.getElementById('album');
    const foto = document.createElement('div');
    foto.classList.add('photo');

    const img = document.createElement('img');
    img.src = src;

    foto.appendChild(img);
    album.appendChild(foto);

    // Salvar no localStorage
    let fotosSalvas = JSON.parse(localStorage.getItem('fotos')) || [];
    fotosSalvas.push(src);
    localStorage.setItem('fotos', JSON.stringify(fotosSalvas));

    // Mostrar o botão "Ver Álbum"
    const verAlbumBtn = document.getElementById('verAlbum');
    verAlbumBtn.style.display = 'block';
}

function carregarFotos() {
    const fotosSalvas = JSON.parse(localStorage.getItem('fotos')) || [];
    const album = document.getElementById('album');

    if (fotosSalvas.length > 0) {
        fotosSalvas.forEach(src => {
            const foto = document.createElement('div');
            foto.classList.add('photo');

            const img = document.createElement('img');
            img.src = src;

            foto.appendChild(img);
            album.appendChild(foto);
        });
        document.getElementById('verAlbum').style.display = 'block';
    }
}

document.getElementById('verAlbum').addEventListener('click', function() {
    const album = document.getElementById('album');
    album.style.display = album.style.display === 'none' ? 'grid' : 'none';
});

// Evento para capturar fotos
const capturarBtn = document.getElementById('capturar');
const videoo = document.getElementById('camera');
const canvas = document.getElementById('foto');

capturarBtn.addEventListener('click', function () {
    const contexto = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    const fotoData = canvas.toDataURL('image/png');
    adicionarFoto(fotoData);
});

// Carregar fotos ao iniciar
document.addEventListener('DOMContentLoaded', carregarFotos);
startCamera();
