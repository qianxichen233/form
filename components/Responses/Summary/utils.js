import html2canvas from "html2canvas";

const randomRange = (l, r) => {
    if(typeof(l) === 'object')
        return Math.floor(Math.random() * (l[1] - l[0]) + l[0]);
    return Math.floor(Math.random() * (r - l) + l);
}

export const generateRandomColor = (color) => {
    const scheme = {
        red: {r: [200, 255], g: [0, 100], b: [0, 100]},
        blue: {r: [0, 100], g: [0, 100], b: [200, 255]},
        green: {r: [0, 100], g: [100, 200], b: [0, 100]},
        yellow: {r: [200, 255], g: [150, 200], b: [0, 50]},
        purple: {r: [100, 200], g: [0, 30], b: [100, 200]},
    }
    return {
        r: randomRange(scheme[color].r),
        g: randomRange(scheme[color].g),
        b: randomRange(scheme[color].b),
    }
}

export const copyToClipBoard = async (cart) => {
    if(!cart) return;
    const canvas = await html2canvas(cart);
    canvas.toBlob(function(blob) { 
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]); 
    });
}