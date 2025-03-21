const x1 = [' ','.',':','-','=','+','*','#','%','@','&',')','(','/','*','"',"'",':',';','!','?','.',',','_','~','`','|','•','√','Π','÷','×','¶','∆',',','{','}','=','°','^','¢','¥','€','£','[',']','℅','™','®','©','\\','█'];

function x2(image,x3 = 100) {
    const x4 = document.createElement('canvas');
    const x5 = x4.getContext('2d');
    const x6 = image.height / image.width / 2;
    const x7 = Math.floor(x3 * x6);
    x4.width = x3;
    x4.height = x7;
    x5.drawImage(image,0,0,x3,x7);
    return x4;
}

function x8(image) {
    const x9 = x2(image,55);
    const x10 = x9.getContext('2d');
    const x11 = x10.getImageData(0,0,x9.width,x9.height);
    const x12 = x11.data;
    let x13 = '';

    for (let x14 = 0; x14 < x9.height; x14++) {
        for (let x15 = 0; x15 < x9.width; x15++) {
            const x16 = (x14 * x9.width + x15) * 4;
            const x17 = x12[x16];
            const x18 = x12[x16 + 1];
            const x19 = x12[x16 + 2];
            const x20 = Math.floor(0.2126 * x17 + 0.7152 * x18 + 0.0722 * x19);
            x13 += x1[Math.floor(x20 / 25)];
        }
        x13 += '\n';
    }
    return x13;
}

document.getElementById('imageInput').addEventListener('change',function(event) {
    const x21 = event.target.files[0];
    if (x21) {
        const x22 = document.getElementById('loader');
        x22.style.display = 'flex';

        setTimeout(() => {
            const x23 = new FileReader();
            x23.onload = function(e) {
                const x24 = new Image();
                x24.src = e.target.result;
                x24.onload = function() {
                    const x25 = x8(x24);
                    document.getElementById('asciiArt').textContent = x25;

                    // Show the copy and download buttons
                    document.querySelector('.copy-btn').style.display = 'inline-block';
                    document.querySelector('.download-btn').style.display = 'inline-block';

                    x22.style.display = 'none';
                };
            };
            x23.readAsDataURL(x21);
        },1900);
    }
});

function copyToClipboard() {
    const x27 = document.getElementById('asciiArt').textContent;
    navigator.clipboard.writeText(x27).then(() => {
        const x28 = document.getElementById('copyNotification');
        x28.classList.add('show');
        setTimeout(() => {
            x28.classList.remove('show');
        },2000);
    }).catch(() => {
        alert('Failed to copy text');
    });
}

function downloadAsciiArt() {
    const x29 = document.getElementById('asciiArt').textContent;
    const x30 = new Blob([x29],{ type: 'text/plain' });
    const x31 = URL.createObjectURL(x30);
    const x32 = document.createElement('a');
    x32.href = x31;
    x32.download = 'ascii-art.txt';
    x32.click();
    URL.revokeObjectURL(x31);
}

function toggleNightMode() {
    document.body.classList.toggle('night-mode');
}

document.addEventListener('dblclick',() => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

window.onload = function() {
    const x33 = document.getElementById('loader');
    x33.style.display = 'none';
};