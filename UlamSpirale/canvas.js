function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

let j = 2;
let j_max = 3;
function MaleUlamSpirale() {
    var Canvas = document.getElementById("MeinCanvas");
    ctx = Canvas.getContext("2d");
    ctx.strokeStyle = "rgb(0, 0, 255)"; // blau
    ctx.fillStyle = "rgb(0, 255, 0)"; // grün

    let i = (j - 2) * 1441201 + 2;
    let n = MeinCanvas.width;
    let m = MeinCanvas.height;
    ctx.clearRect(0, 0, n, m);
    ctx.strokeRect(0, 0, n, m);

    const center = Math.floor(n / 2);
    let x = center;
    let y = center;
    let dx = 1;
    let dy = 1;

    for (let j = 1; j <= n; j++) {
        for (let k = 1; k <= 2 * j; k++) {

            if (k <= j) {
                x += dx
            }
            else {
                y += dy
            }

            if (isPrime(i)) {
                ctx.fillRect(x, y, 1, 1);
            }

            i++;
        }

        dx = -dx;
        dy = -dy;
    }

    j++;
    if (j <= j_max)
        setTimeout(MaleUlamSpirale, 1000);

}

MaleUlamSpirale();