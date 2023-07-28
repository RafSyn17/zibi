function prevMultiple(n, m) {
    if (m == 0) {
        return 0;
    }
    return Math.floor(n / m) * m;
}

function posModulo(n, m) {
    let ret = n % m;
    if (ret >= 0)
        return ret;
    return ret + m;
}

function getUlamNumber(x, y) {
    const rad = Math.max(Math.abs(x), Math.abs(y));
    const basis = 1 + 2 * rad;
    const obenRechts = Math.pow(basis, 2);

    const obenMitte = obenRechts - rad;
    if (y === rad)
        return obenMitte + x;

    const linksMitte = obenMitte - 2 * rad;
    if (x === -rad)
        return linksMitte + y;

    const untenMitte = linksMitte - 2 * rad;
    if (y === -rad)
        return untenMitte - x;

    const rechtsMitte = untenMitte - 2 * rad;
    if (x == rad)
        return rechtsMitte - y;

    throw new Error("Interner Fehler bei getUlamNumber()");
}

function drawRectangle(imageData, r, g, b, a, x, y, w, h) {
    // Grenzen des Rechtecks anpassen, um sicherzustellen, dass sie innerhalb des ImageData liegen
    const xStart = Math.max(0, x);
    const yStart = Math.max(0, y);
    const xEnd = Math.min(x + w, imageData.width);
    const yEnd = Math.min(y + h, imageData.height);

    for (let i = yStart; i < yEnd; i++) {
        for (let j = xStart; j < xEnd; j++) {
            const index = (i * imageData.width + j) * 4;

            imageData.data[index] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = a;
        }
    }
}

function isPrimeSimple(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++)
        if (num % i === 0) return false;
    return true;
}