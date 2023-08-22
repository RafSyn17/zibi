let pixelSize = 4;
let xOff = 0;
let yOff = 0;
let canvas;
let ctx;
let tooltip;
let markedNumbers = new Set();

function setXOff(x) {
    xOff = Math.round(x);
}

function setYOff(y) {
    yOff = Math.round(y);
}

function addXOff(x) {
    setXOff(xOff + x);
}

function addYOff(y) {
    setYOff(yOff + y);
}


let imageData;

// Funktion zum Färben der Pixel
function paintPixel(x, y) {
    let zahl = getUlamNumber(x + xOff, -(y + yOff));
    let r, g, b, a; // red, green, blue, alpha
    if (isPrime(zahl)) {
        if (markedNumbers.has(zahl)) {
            // ctx.fillStyle = 'blue';
            r = 0;
            g = 0;
            b = 255;
            a = 255;

        }
        else
        /**  if (Math.abs(x + xOff) == Math.abs(y + yOff)) {
            // ctx.fillStyle = 'red';
            r = 255;
            g = 0;
            b = 0;
            a = 255;
        }
        else
        */ {
            // ctx.fillStyle = 'black';
            r = 0;
            g = 0;
            b = 0;
            a = 255;
        }
    }
    else if (Math.abs(x + xOff) == 0 || Math.abs(y + yOff) == 0) {
        // ctx.fillStyle = 'red';
        r = 255; g = 0; b = 0; a = 64;

        /*if (Math.abs(x + xOff) == Math.abs(y + yOff)) {
            // ctx.fillStyle = 'yellow';
            r = 255;
            g = 255;
            b = 0;
            a = 255;
        }
    */
    }
    else {
        // white
        r = 255;
        g = 255;
        b = 255;
        a = 255;

    }

    drawRectangle(imageData, r, g, b, a, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    // ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize); // Ein einzelnes Pixel malen
}

const fps = 60;
let canvasStepStart;
let drawCanvasStepTimeout;

function drawCanvasStep(x, y, xMin, xMax, yMax) {
    canvasStepStart = new Date();
    do {
        if (y >= yMax) {
            ctx.putImageData(imageData, 0, 0);
            return;
        }
        if (x >= xMax) {
            x = xMin;
            y++;
        }
        paintPixel(x, y);
        ++x;
    } while ((new Date() - canvasStepStart) < 1000 / fps);
    ctx.putImageData(imageData, 0, 0);
    drawCanvasStepTimeout = setTimeout(function () {
        drawCanvasStepTimeout = null;
        drawCanvasStep(x, y, xMin, xMax, yMax);
    }, 0)
}

function drawCanvas(xMin, xMax, yMin, yMax) {
    tooltip.style.display = 'none';
    if (drawCanvasStepTimeout) {
        clearTimeout(drawCanvasStepTimeout);
        xMin = xMax = yMin = yMax = undefined;
    }
    xMin = xMin ?? 0;
    xMax = xMax ?? canvas.width / pixelSize;
    yMin = yMin ?? 0;
    yMax = yMax ?? canvas.height / pixelSize;
    // if (xMin === 0 && xMax === canvas.width / pixelSize && yMin === 0 && yMax === canvas.height / pixelSize)
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawCanvasStep(xMin, yMin, xMin, xMax, yMax);
}

function resizeCanvas() {
    let wDiff = canvas.width - window.innerWidth;
    let hDiff = canvas.height - window.innerHeight;
    addXOff(wDiff / 2 / pixelSize);
    addYOff(hDiff / 2 / pixelSize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas();
}

function adjustOffPct(x, y) {
    const xDiff = Math.round(canvas.width * (x / 100) / pixelSize);
    const yDiff = Math.round(canvas.height * (y / 100) / pixelSize);
    if (xDiff === 0 && yDiff === 0)
        return;
    addXOff(xDiff);
    addYOff(yDiff);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Löschen Sie den aktuellen Inhalt
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichnen Sie das ImageData-Objekt an der neuen Position
    ctx.putImageData(imageData, -xDiff * pixelSize, -yDiff * pixelSize);
    let xMin, xMax, yMin, yMax;
    if (xDiff > 0) {
        xMax = Math.floor(canvas.width / pixelSize);
        xMin = xMax - xDiff;
    }
    if (xDiff < 0) {
        xMin = 0;
        xMax = -xDiff;
    }
    if (yDiff > 0) {
        yMax = Math.floor(canvas.height / pixelSize);
        yMin = yMax - yDiff;
    }
    if (yDiff < 0) {
        yMin = 0;
        yMax = -yDiff;
    }
    drawCanvas(xMin, xMax, yMin, yMax);
}

function goToCenter() {
    setXOff(- canvas.width / 2 / pixelSize);
    setYOff(- canvas.height / 2 / pixelSize);
    drawCanvas();
}

function zoomIn() {
    pixelSize = Math.round(pixelSize * 2);
    setXOff(xOff + (canvas.width / pixelSize) / 2);
    setYOff(yOff + (canvas.height / pixelSize) / 2);
    resizeCanvas();
}

function zoomOut() {
    pixelSize = Math.round(pixelSize / 2);
    setXOff(xOff - (canvas.width / pixelSize) / 4);
    setYOff(yOff - (canvas.height / pixelSize) / 4);
    resizeCanvas();
}


function getTooltipData(x, y) {
    xA = Math.floor(x / pixelSize);
    yA = Math.floor(y / pixelSize);
    let xRel = xA + xOff;
    let yRel = - (yA + yOff);
    let delta = (yRel - xRel);

    const zahl = getUlamNumber(xA + xOff, -(yA + yOff));
    const zahlStr = zahl.toLocaleString();
    const isPrime = isPrimeSimple(zahl);
    const iProben = 1000;
    let iProbenPositiv1 = 0;
    let iProbenPositiv2 = 0;
    if (isPrime) {
        //if (markedNumbers.has(zahl))
        //    markedNumbers.delete(zahl);
        //else {
        //    markedNumbers.add(zahl);
        for (i = - (iProben / 2); i < (iProben / 2); i++) {
            xi = x + i * pixelSize;
            yi = y - i * pixelSize;
            xReli = xRel + i;
            yReli = yRel + i;
            zahli = getUlamNumber(xReli, yReli);
            if (isPrimeSimple(zahli)) {
                iProbenPositiv1++;
                if (markedNumbers.has(zahli)) {
                    markedNumbers.delete(zahli);
                    ctx.fillStyle = 'black';
                }
                else {
                    markedNumbers.add(zahli);
                    ctx.fillStyle = 'blue';
                };
                ctx.fillRect(xi - xi % pixelSize, yi - yi % pixelSize, pixelSize, pixelSize);
            }

            xi = x - i * pixelSize;
            yi = y - i * pixelSize;
            xReli = xRel - i;
            yReli = yRel + i;
            zahli = getUlamNumber(xReli, yReli);
            if (isPrimeSimple(zahli)) {
                iProbenPositiv2++;
                if (markedNumbers.has(zahli)) {
                    markedNumbers.delete(zahli);
                    ctx.fillStyle = 'black';
                }
                else {
                    markedNumbers.add(zahli);
                    ctx.fillStyle = 'green';
                };
                ctx.fillRect(xi - xi % pixelSize, yi - yi % pixelSize, pixelSize, pixelSize);
            }

        }
    }
    let txt;

    if (isPrime) {
        // if (yRel >= 0 && yRel >= Math.abs(xRel) || xRel >= 0 && xRel >= Math.abs(yRel)) {
        // es geht doch viel einfacher :-)
        if (yRel >= - xRel) {
            let n = (Math.sqrt(zahl + delta) - 1) / 2;  // ( zahl + delta ) = (2*n + 1)²
            let c = 1 - delta;
            //txt = `(${xRel}, ${yRel}). Formel: f(n) = 4n² + 4n  + 1 - ${delta}. Primzahl: ${zahl}= f(${n}). `;
            if (c > 0) {
                txt = `Primzahl: ${zahl}=(${xRel}, ${yRel})=<span style='color: blue;'>f(${n}). f(n) = 4n² + 4n + ${c}</span>.`
            }
            else {
                if (c < 0)
                    txt = `Primzahl: ${zahl}=(${xRel}, ${yRel})=<span style='color: blue;'>f(${n}). f(n) = 4n² + 4n - ${-c}</span>.`
                else
                    txt = `Primzahl: ${zahl}=(${xRel}, ${yRel})=<span style='color: blue;'>f(${n}). f(n) = 4n² + 4n + 1</span>.`
            }
        }

        else {
            let n = Math.sqrt((zahl - delta - 1) / 4);  // (zahl - delta) = (2*n)² + 1
            let c = 1 + delta;
            //txt = `(${xRel}, ${yRel}). Formel: f(n) = 4n² + 1 + ${delta}. Primzahl: ${zahl}= f(${n}). `;

            if (c > 0) {
                txt = `Primzahl: ${zahlStr}=(${xRel}, ${yRel})=<span style='color: blue;'>f(${n}). f(n) = 4n² + ${c}</span>.`
            }
            else {
                if (c < 0)
                    txt = `Primzahl: ${zahlStr}=(${xRel}, ${yRel})=<span style='color: blue;'>f(${n}). f(n) = 4n² - ${-c}</span>.`
                else
                    txt = `Primzahl: ${zahlStr}=(${xRel}, ${yRel})=<span style='color: blue;'>f(${n}). f(n) = 4n² + 1</span>.`
            }
        }
        prHa1 = Math.round(iProbenPositiv1 / iProben * 10000) / 100;
        txt = txt + ` Primzahlenhäufigkeit1: <span style='color: blue;'>${prHa1}</span>%.`;
        txt += "&#010;";

        let summe = yRel + xRel;

        if (yRel >= xRel) {
            let n = Math.max(Math.abs(xRel), Math.abs(yRel));  // ( zahl + delta ) = (4*n² + 2*n + 1)
            let c = 1 + summe;
            //txt = `(${xRel}, ${yRel}). Formel: f(n) = 4n² + 2n  + 1 - ${delta}. Primzahl: ${zahl}= f(${n}). `;
            if (c > 0) {
                txt += `Primzahl: ${zahl}=(${xRel}, ${yRel})=<span style='color: green;'>f(${n}). f(n) = 4n² + 2n + ${c}</span>.`
            }
            else {
                if (c < 0)
                    txt += `Primzahl: ${zahl}=(${xRel}, ${yRel})=<span style='color: green;'>f(${n}). f(n) = 4n² + 2n - ${-c}</span>.`
                else
                    txt += `Primzahl: ${zahl}=(${xRel}, ${yRel})=<span style='color: green;'>f(${n}). f(n) = 4n² + 2n + 1</span>.`
            }
        }

        else {
            let n = Math.max(Math.abs(xRel), Math.abs(yRel));;  // (zahl - delta) = (2*n)² -2n + 1

            let c = 1 - summe;

            if (c > 0) {
                txt += `Primzahl: ${zahlStr}=(${xRel}, ${yRel})=<span style='color: green;'>f(${n}). f(n) = 4n² -2n + ${c}</span>.`
            }
            else {
                if (c < 0)
                    txt += `Primzahl: ${zahlStr}=(${xRel}, ${yRel})=<span style='color: green;'>f(${n}). f(n) = 4n² -2n - ${-c}</span>.`
                else
                    txt += `Primzahl: ${zahlStr}=(${xRel}, ${yRel})=<span style='color: green;'>f(${n}). f(n) = 4n² -2n + 1</span>.`
            }
        }
        prHa2 = Math.round(iProbenPositiv2 / iProben * 10000) / 100;
        txt = txt + ` Primzahlenhäufigkeit2: <span style='color: green;'>${prHa2}</span>%.`;


    }
    else {
        txt = `${zahlStr} = (${xRel}, ${yRel})`
    };

    return [txt, isPrime];
}

function toggleMark(zahl, x, y) {
    if (markedNumbers.has(zahl)) {
        markedNumbers.delete(zahl);
        /** if (Math.abs( Math.floor(x/pixelSize) + xOff) == Math.abs(Math.floor(y/pixelSize) + yOff))
            ctx.fillStyle = 'red';
        else
        */
        ctx.fillStyle = 'black';
    }
    else {
        markedNumbers.add(zahl);
        ctx.fillStyle = 'blue';
    }
    let xX = x - x % pixelSize;
    let yY = y - y % pixelSize;
    ctx.fillRect(xX, yY, pixelSize, pixelSize); // Ein einzelnes Pixel malen
}

function makeToolTip(zahl, x, y) {
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = 'block';
    // tooltip.textContent = `${zahl}`;
    tooltip.innerHTML = zahl;
}

function init() {
    canvas = document.getElementById('canvas');
    tooltip = document.getElementById('tooltip');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    goToCenter();
}

function addButtonListeners() {
    document.getElementById("centerButton").addEventListener("click", goToCenter);

    document.getElementById("zoomInButton").addEventListener("click", zoomIn);

    document.getElementById("zoomOutButton").addEventListener("click", zoomOut);

    // Eventlistener für den "upButton"
    document.getElementById("upButton").
        addEventListener("click",
            function () { adjustOffPct(0, -20); });

    // Eventlistener für den "leftButton"
    document.getElementById("leftButton").
        addEventListener("click",
            function () { adjustOffPct(-20, 0); });

    // Eventlistener für den "rightButton"
    document.getElementById("rightButton").
        addEventListener("click",
            function () { adjustOffPct(20, 0); });

    // Eventlistener für den "downButton"
    document.getElementById("downButton").
        addEventListener("click",
            function () { adjustOffPct(0, 20); });
}

window.onload = function () {
    init();
    window.addEventListener('resize', resizeCanvas);

    addButtonListeners();

    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const [txt, isPrime] = getTooltipData(x, y);

        /*if (isPrime)
            toggleMark(zahl, x, y);
        */

        makeToolTip(txt, event.pageX + pixelSize, event.pageY + pixelSize);
    });

    // Schließen-Symbol hinzufügen und Event-Listener
    document.getElementById('tooltip').addEventListener('click', function () {
        tooltip.style.display = 'none';
    });

    // Holen Sie sich das Popup
    var settingsPopup = document.getElementById("settingsPopup");

    // Wenn der Benutzer auf den Button klickt, öffnen Sie das Popup
    document.getElementById("settingsButton").onclick = function () {
        settingsPopup.style.display = "block";
    }

    // Wenn der Benutzer auf <span> (x) klickt, schließen Sie das Popup
    document.getElementsByClassName("close")[0].onclick = function () {
        settingsPopup.style.display = "none";
    }

    // Wenn der Benutzer irgendwo außerhalb des Popups klickt, schließen Sie es
    window.onclick = function (event) {
        if (event.target == settingsPopup) {
            settingsPopup.style.display = "none";
        }
    }

}