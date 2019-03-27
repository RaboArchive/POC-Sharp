"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const sharp = require("sharp");
// console.log(sharp);
const sharpTransform = () => {
    return sharp().resize(50, 20).jpeg();
};
console.log('WITHOUT CUSTOM LIBRARY');
const filePNGPath = "resources/dice.png";
const fileBMPPath = "resources/lena.bmp";
try {
    console.log(`Trying to convert : ${filePNGPath}`);
    const outputStream = fs.createWriteStream('output/dice-output-WITHOUT.jpeg');
    const inputStream = fs.createReadStream(filePNGPath)
        .pipe(sharpTransform())
        .on('error', () => { console.log('Caught error in PNG convertion'); })
        .pipe(outputStream)
        .on('close', () => { console.log(`${filePNGPath} - Done`); });
}
catch (e) {
    console.log('Err : Catched while doing things with PNG', e, e.stack);
}
try {
    console.log(`Trying to convert : ${fileBMPPath}`);
    const outputStream = fs.createWriteStream('output/lena-output-WITHOUT.jpeg');
    const inputStream = fs.createReadStream(fileBMPPath)
        .pipe(sharpTransform())
        .on('error', () => { console.log('Caught error in BMP convertion'); })
        .pipe(outputStream)
        .on('close', () => { console.log(`${fileBMPPath} - Done`); });
}
catch (e) {
    console.log('Err : Catched while doing things with  BMP', e, e.stack);
}
//# sourceMappingURL=sharpWithoutCustomLib.js.map