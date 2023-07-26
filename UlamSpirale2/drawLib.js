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