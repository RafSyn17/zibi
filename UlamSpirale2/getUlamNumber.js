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