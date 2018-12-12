let pixels = []
let output;
const scale = 1;
const shift = 200;
function gri(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pixelsToRows(pixels, width) {
    let rows = []
    for (let i = 0; i < pixels.length; i += width) {
        let row = pixels.slice(i, i + width)
        rows.push(row)
    }
    return rows;
}

function pixelsToColumns(pixels, width) {
    let rows = pixelsToRows(pixels, width)
    let columns = [];
    for (let a = 0; a < rows[0].length; a++) {
        columns.push([0])
    }
    for (let i = 0; i < rows.length; i += 1) {
        let row = rows[i];
        for (let j = 0; j < row.length; j++) {
            columns[j][i] = row[j]
        }
    }

    return columns;
}

function rowsToPixels(rows) {
    let pixels = rows.flat()
    return pixels;
}
function columnsToPixels(cols) {
    let height = cols[0].length;
    let width = cols.length;
    let pixels = []
    for (let a = 0; a < height; a++) {
        for (let i = 0; i < width; i++) {
            pixels.push(cols[i][a])
        }
    }
    return pixels;
}

function drawOutput(pixels, width, output) {
    let rows = pixelsToRows(pixels, width)
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        for (let j = 0; j < row.length; j++) {
            let pixel = row[j]
            let x = j * scale;
            let y = i * scale;
            output.fillStyle = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')'
            output.fillRect(x, y, scale, scale)
        }
    }
}

function shiftRows(pixels, key, w) {
    let rows = pixelsToRows(pixels, w)
    let x = 0
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let n = key[x];
        x++
        if (x > key.length) { x = 0 }
        if (n >= 0) {
            for (let j = 0; j < n; j++) {
                row.unshift(row.pop());
            }
        } else {
            for (let j = 0; j < Math.abs(n); j++) {
                row.push(row.shift());
            }
        }
    }
    return rowsToPixels(rows);
}
function shiftColumns(pixels, key, width) {
    let columns = pixelsToColumns(pixels, width)
    let x = 0
    for (let i = 0; i < columns.length; i++) {
        let col = columns[i];
        let n = key[x];
        x++
        if (x > key.length) { x = 0 }
        if (n >= 0) {
            for (let j = 0; j < n; j++) {
                col.unshift(col.pop());
            }
        } else {
            for (let j = 0; j < Math.abs(n); j++) {
                col.push(col.shift());
            }
        }
    }
    return columnsToPixels(columns);
}

function encrypt(pixels, key, w) {
    for (let i = 0; i < key.n; i++) {
        if (i % 2 === 0) {
            pixels = shiftRows(pixels, key.transform, w)
        } else {
            pixels = shiftColumns(pixels, key.transform, w)
        }
    }
    return pixels;
}
function decrypt(pixels, key, w) {
    for (let a = 0; a < key.transform.length; a++) {
        key.transform[a] *= -1;
    }

    //    key.transform = key.transform.reverse()

    console.log(key)
    for (let i = key.n - 1; i >= 0; i--) {
        if (i % 2 === 0) {
            pixels = shiftRows(pixels, key.transform, w)
        } else {
            pixels = shiftColumns(pixels, key.transform, w)
        }
    }
    return pixels;
}

function generateKey(n = 3, l = 100, method = 'linear') {
    let key = {
        n: n,
        transform: []
    }
    for (let i = 0; i < l; i++) {
        if (method === 'linear') {
            key.transform.push(i * 2)
        } else if (method === 'sin') {
            key.transform.push(Math.round(Math.sin(i / 10) * 10))
        } else if (method === 'random') {
            key.transform.push(gri(-100, 100))
        } else {
            console.error('Invalid key generation method: ' + method)
        }
    }
    return key;
}

function encodeImage(key) {
    let img = document.querySelector('.source')
    let outputWindow = document.querySelector('.encrypt-output')
    if (!key){
        key = generateKey(2, 50, 'random')
    }
    console.log(img)
    console.log(img.width)
    let canvas = document.querySelector('#world')
    output = document.querySelector('#output').getContext('2d')
    canvas.width = img.width;
    canvas.height = img.height;
    output.canvas.width = img.width;
    output.canvas.height = img.height;
    let c = canvas.getContext('2d')
    // Copy the image contents to the canvas
    c.drawImage(img, 0, 0);
    let imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
        let a = imageData.data[i + 3];
        pixels.push([r, g, b])
    }
    
    pixels = encrypt(pixels, key, canvas.width)
    drawOutput(pixels, canvas.width, output)
    outputWindow.style.width = canvas.width + 2 + 'px';
    outputWindow.classList.remove('hidden')
}
function decodeImage(key) {
    let img = document.querySelector('.source-decrypt')
    let outputWindow = document.querySelector('.decrypt-output')
    console.log(img)
    console.log(img.width)
    let canvas = document.querySelector('#world')
    output = document.querySelector('#output-decrypt').getContext('2d')
    canvas.width = img.width;
    canvas.height = img.height;
    output.canvas.width = img.width;
    output.canvas.height = img.height;
    let c = canvas.getContext('2d')
    // Copy the image contents to the canvas
    c.drawImage(img, 0, 0);
    let imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
        let a = imageData.data[i + 3];
        pixels.push([r, g, b])
    }
    
    pixels = decrypt(pixels, key, canvas.width)
    drawOutput(pixels, canvas.width, output)
    outputWindow.style.width = canvas.width + 2 + 'px';
    outputWindow.classList.remove('hidden')
}

window.onload = function () {
}