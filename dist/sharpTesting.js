"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const f_promise_1 = require("f-promise");
const sharp = require("sharp");
const sharpTransform = () => {
    return sharp().resize(500, 400).jpeg();
};
const files = ["resources/Sample1.jpg",
    "resources/Sample2.png", "resources/Sample2.jpg", "resources/Sample2.ppm", "resources/Sample2.tga", "resources/Sample2.tif",
    "resources/Sample3.gif", "resources/Sample3.png", "resources/Sample3.tif", "resources/Sample3.bmp"];
f_promise_1.run(() => {
    f_promise_1.wait(fs.remove('output/*'));
    console.log('WITHOUT CUSTOM LIBRARY');
    for (const i in files) {
        try {
            const file = files[i];
            const fileExtension = path.extname(file);
            const fileName = path.basename(file, fileExtension);
            const startTime = Date.now();
            const outputPath = `output/${fileName}-${fileExtension}-${i}.jpeg`;
            let success = true;
            console.log(`Trying to convert : ${file}`);
            const outputStream = fs.createWriteStream(outputPath);
            fs.createReadStream(file)
                .pipe(sharpTransform())
                .on('error', () => {
                console.log(`Caught error in ${file} convertion`);
                success = false;
                fs.remove(outputPath);
            })
                .pipe(outputStream)
                .on('close', () => {
                if (success) {
                    console.log(`${file} - Done - in ${(Date.now() - startTime) / 1000}s`);
                }
            });
        }
        catch (e) {
            console.log('Err : Catched while doing things', e, e.stack);
        }
    }
});
//# sourceMappingURL=sharpTesting.js.map