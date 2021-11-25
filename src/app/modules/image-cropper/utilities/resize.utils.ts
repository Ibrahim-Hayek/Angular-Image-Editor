export function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
    const widthSource = canvas.width;
    const heightSource = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    const ratioW = widthSource / width;
    const ratioH = heightSource / height;
    const ratioWHalf = Math.ceil(ratioW / 2);
    const ratioHHalf = Math.ceil(ratioH / 2);

    const ctx = canvas.getContext('2d');
    if (ctx) {
        const img = ctx.getImageData(0, 0, widthSource, heightSource);
        const img2 = ctx.createImageData(width, height);
        const data = img.data;
        const data2 = img2.data;

        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                const x2 = (i + j * width) * 4;
                const centerY = j * ratioH;
                let weight = 0;
                let weights = 0;
                let weightsAlpha = 0;
                let gxR = 0;
                let gxG = 0;
                let gxB = 0;
                let gxA = 0;

                const xxStart = Math.floor(i * ratioW);
                const yyStart = Math.floor(j * ratioH);
                let xxStop = Math.ceil((i + 1) * ratioW);
                let yyStop = Math.ceil((j + 1) * ratioH);
                xxStop = Math.min(xxStop, widthSource);
                yyStop = Math.min(yyStop, heightSource);

                for (let yy = yyStart; yy < yyStop; yy++) {
                    const dy = Math.abs(centerY - yy) / ratioHHalf;
                    const centerX = i * ratioW;
                    const w0 = dy * dy; // pre-calc part of w
                    for (let xx = xxStart; xx < xxStop; xx++) {
                        const dx = Math.abs(centerX - xx) / ratioWHalf;
                        const w = Math.sqrt(w0 + dx * dx);
                        if (w >= 1) {
                            // pixel too far
                            continue;
                        }
                        // hermite filter
                        weight = 2 * w * w * w - 3 * w * w + 1;
                        const posX = 4 * (xx + yy * widthSource);
                        // alpha
                        gxA += weight * data[posX + 3];
                        weightsAlpha += weight;
                        // colors
                        if (data[posX + 3] < 255) {
                            weight = weight * data[posX + 3] / 250;
                        }
                        gxR += weight * data[posX];
                        gxG += weight * data[posX + 1];
                        gxB += weight * data[posX + 2];
                        weights += weight;
                    }
                }
                data2[x2] = gxR / weights;
                data2[x2 + 1] = gxG / weights;
                data2[x2 + 2] = gxB / weights;
                data2[x2 + 3] = gxA / weightsAlpha;
            }
        }
        canvas.width = width;
        canvas.height = height;

        // draw
        ctx.putImageData(img2, 0, 0);
    }
}
