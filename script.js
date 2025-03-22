const x1 = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@', '&', ')', '(', '/', '*', '"', "'", ':', ';', '!', '?', '.', ',', '_', '~', '`', '|', '•', '√', 'Π', '÷', '×', '¶', '∆', ',', '{', '}', '=', '°', '^', '¢', '¥', '€', '£', '[', ']', '℅', '™', '®', '©', '\\', '█'];

function x2(image, x3 = 100) {
    const x4 = document.createElement('canvas');
    const x5 = x4.getContext('2d');
    const x6 = image.height / image.width / 2;
    const x7 = Math.floor(x3 * x6);
    x4.width = x3;
    x4.height = x7;
    x5.drawImage(image, 0, 0, x3, x7);
    return x4;
}

function x8(image, isColored = false) {
    const x9 = x2(image, 55);
    const x10 = x9.getContext('2d');
    const x11 = x10.getImageData(0, 0, x9.width, x9.height);
    const x12 = x11.data;
    let x13 = '';

    for (let x14 = 0; x14 < x9.height; x14++) {
        for (let x15 = 0; x15 < x9.width; x15++) {
            const x16 = (x14 * x9.width + x15) * 4;
            const x17 = x12[x16];     // Red
            const x18 = x12[x16 + 1]; // Green
            const x19 = x12[x16 + 2]; // Blue
            const x20 = Math.floor(0.2126 * x17 + 0.7152 * x18 + 0.0722 * x19); // Grayscale value

            const char = x1[Math.floor(x20 / 25)];

            if (isColored) {
                x13 += `<span style="color: rgb(${x17}, ${x18}, ${x19})">${char}</span>`;
            } else {
                x13 += char;
            }
        }
        x13 += '<br>';
    }
    return x13;
}

function isImageWhiteOnly(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r !== 255 || g !== 255 || b !== 255) {
            return false;
        }
    }
    return true;
}

document.getElementById('imageInput').addEventListener('change', function (event) {
    const x21 = event.target.files[0];
    if (x21) {
        const x22 = document.getElementById('loader');
        x22.style.display = 'flex';

        document.getElementById('asciiArtBW').innerHTML = '';
        document.getElementById('asciiArtColored').innerHTML = '';
        document.getElementById('coloredSection').style.display = 'none';
        document.querySelectorAll('.copy-btn, .download-btn').forEach(btn => btn.style.display = 'none');

        setTimeout(() => {
            const x23 = new FileReader();
            x23.onload = function (e) {
                const x24 = new Image();
                x24.src = e.target.result;
                x24.onload = function () {
                    const x25BW = x8(x24, false);
                    const x25Colored = x8(x24, true);

                    document.getElementById('asciiArtBW').innerHTML = x25BW;
                    document.querySelector('.copy-btn[onclick="copyToClipboard(\'asciiArtBW\')"]').style.display = 'inline-block';
                    document.querySelector('.download-btn[onclick="downloadAsciiArt(\'asciiArtBW\')"]').style.display = 'inline-block';

                    const canvas = x2(x24, 55);
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const isWhiteOnly = isImageWhiteOnly(imageData);

                    if (!isWhiteOnly) {
                        document.getElementById('asciiArtColored').innerHTML = x25Colored;
                        document.getElementById('coloredSection').style.display = 'block';
                        document.querySelector('.copy-btn[onclick="showLanguageModal(\'copy\')"]').style.display = 'inline-block';
                        document.querySelector('.download-btn[onclick="showLanguageModal(\'download\')"]').style.display = 'inline-block';
                    }

                    x22.style.display = 'none';
                };
            };
            x23.readAsDataURL(x21);
        }, 1900);
    }
});

function showLanguageModal(action) {
    const modal = document.getElementById('languageModal');
    modal.dataset.action = action;
    modal.style.display = 'block';
}

function hideLanguageModal() {
    const modal = document.getElementById('languageModal');
    modal.style.display = 'none';
}

function handleLanguageSelection(language) {
    const action = document.getElementById('languageModal').dataset.action;
    if (action === 'copy') {
        copyWithLanguage(language);
    } else if (action === 'download') {
        downloadWithLanguage(language);
    }
}

function copyWithLanguage(language) {
    const asciiArt = document.getElementById('asciiArtColored').innerHTML;
    let formattedText = '';

    switch (language) {
        case "Python":
            formattedText = asciiArt.replace(/<span style="color: rgb\((\d+), (\d+), (\d+)\)">(.*?)<\/span>/g, (match, r, g, b, char) => {
                return `\x1b[38;2;${r};${g};${b}m${char}\x1b[0m`;
            });
            formattedText = formattedText.replace(/<br>/g, '\n');
            formattedText = `ascii_art = """\n${formattedText}\n"""`;
            break;
        case 'JavaScript':
            formattedText = asciiArt.replace(/<span style="color: rgb\((\d+), (\d+), (\d+)\)">(.*?)<\/span>/g, (match, r, g, b, char) => {
                return `\\x1b[38;2;${r};${g};${b}m${char}\\x1b[0m`;
            });
            formattedText = formattedText.replace(/<br>/g, '\n');
            formattedText = `const asciiArt = \`\n${formattedText}\n\`;`;
            break;
        case 'Html':
            formattedText = asciiArt.replace(/<br>/g, '\n');
            break;
        case 'Css':
            formattedText = asciiArt.replace(/<span style="color: rgb\((\d+), (\d+), (\d+)\)">(.*?)<\/span>/g, (match, r, g, b, char) => {
                return `<span style="color: rgb(${r}, ${g}, ${b})">${char}</span>`;
            });
            formattedText = formattedText.replace(/<br>/g, '\n');
            break;
        default:
            formattedText = asciiArt.replace(/<br>/g, '\n');
    }

    navigator.clipboard.writeText(formattedText).then(() => {
        const notification = document.getElementById('copyNotification');
        notification.textContent = `Done Cope | ${language.toUpperCase()}`;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }).catch(() => {
        alert('Failed to copy text');
    });

    hideLanguageModal();
}

function downloadWithLanguage(language) {
    const asciiArt = document.getElementById('asciiArtColored').innerHTML;
    let formattedText = '';

    switch (language) {
        case 'Python':
            formattedText = asciiArt.replace(/<span style="color: rgb\((\d+), (\d+), (\d+)\)">(.*?)<\/span>/g, (match, r, g, b, char) => {
                return `\x1b[38;2;${r};${g};${b}m${char}\x1b[0m`;
            });
            formattedText = formattedText.replace(/<br>/g, '\n');
            formattedText = `ascii_art = """\n${formattedText}\n"""`;
            break;
        case 'JavaScript':
            formattedText = asciiArt.replace(/<span style="color: rgb\((\d+), (\d+), (\d+)\)">(.*?)<\/span>/g, (match, r, g, b, char) => {
                return `\\x1b[38;2;${r};${g};${b}m${char}\\x1b[0m`;
            });
            formattedText = formattedText.replace(/<br>/g, '\n');
            formattedText = `const asciiArt = \`\n${formattedText}\n\`;`;
            break;
        case 'Html':
            formattedText = asciiArt.replace(/<br>/g, '\n');
            break;
        case 'Css':
            formattedText = asciiArt.replace(/<span style="color: rgb\((\d+), (\d+), (\d+)\)">(.*?)<\/span>/g, (match, r, g, b, char) => {
                return `<span style="color: rgb(${r}, ${g}, ${b})">${char}</span>`;
            });
            formattedText = formattedText.replace(/<br>/g, '\n');
            break;
        default:
            formattedText = asciiArt.replace(/<br>/g, '\n');
    }

    const blob = new Blob([formattedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art.${language}`;
    a.click();
    URL.revokeObjectURL(url);

    hideLanguageModal();
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    let text = element.innerHTML;

    text = text.replace(/<br>/g, '\n');
    text = text.replace(/<[^>]*>/g, '');

    navigator.clipboard.writeText(text).then(() => {
        const notification = document.getElementById('copyNotification');
        notification.textContent = 'Done Cope > ';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }).catch(() => {
        alert('Failed to copy text');
    });
}

function downloadAsciiArt(elementId) {
    const element = document.getElementById(elementId);
    let text = element.innerHTML;

    text = text.replace(/<br>/g, '\n');
    text = text.replace(/<[^>]*>/g, '');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function toggleNightMode() {
    document.body.classList.toggle('night-mode');
}

document.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

window.onload = function () {
    const x33 = document.getElementById('loader');
    x33.style.display = 'none';
};
