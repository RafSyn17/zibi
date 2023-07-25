function getUlamNumber(x, y) {
    const rad = Math.max(Math.abs(x), Math.abs(y));
    const basis = 1 + 2 * rad;
    const obenRechts = Math.pow(basis, 2);

    if (Math.abs(y) === rad) {
        return obenRechts + rad * (2 * Math.sign(y) - 3) + Math.sign(y) * x
    }
    else {
        return obenRechts - rad * (2 * Math.sign(x) + 5) - Math.sign(x) * y
    };

    /* 
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
    */
    throw new Error("Interner Fehler bei getUlamNumber()");
}



