"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const f_streams_1 = require("f-streams");
const f_promise_1 = require("f-promise");
const sharp = require("sharp");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const child_process = __importStar(require("child_process"));
// 11 Files & 4 expect to fail
const files = ["resources/Sample1.jpg",
    "resources/Sample2.png", "resources/Sample2.jpg", "resources/Sample2.ppm", "resources/Sample2.tga", "resources/Sample2.tiff", "resources/Sample2.bmp",
    "resources/Sample3.gif", "resources/Sample3.png", "resources/Sample3.tif", "resources/Sample3.bmp"];
console.log(`${files.length} files to convert`);
const clean = () => {
    console.log(`Cleaning : output`);
    f_promise_1.wait(fs.remove('output'));
    f_promise_1.wait(fs.mkdirp('output/node'));
    f_promise_1.wait(fs.mkdirp('output/fstreams'));
    f_promise_1.wait(fs.mkdirp('output/imageMagick'));
};
function magick(file) {
    const fileExtension = path.extname(file);
    const fileName = path.basename(file, fileExtension);
    const outputPath = `output/imageMagick/${fileName}-${fileExtension}-.jpeg`;
    try {
        const command = `convert - -thumbnail 400x500 mpr:orig -auto-orient -format JPEG -`;
        const startTime = Date.now();
        const imageReader = fs.createReadStream(file);
        // console.log(nodeReader(imageReader).readAll());
        const proc = child_process.exec(command);
        imageReader.pipe(proc.stdin);
        const tmpReader = f_streams_1.nodeReader(proc.stdout); //.pipe(imageWriter.nodify());
        tmpReader.pipe(f_streams_1.binaryFileWriter(outputPath));
        console.log(` ${file} - Done - in ${(Date.now() - startTime) / 1000}s`);
    }
    catch (e) {
        // console.log(`[${libUsed}] Err : Catched while doing things to ${files[i]}`);
        f_promise_1.wait(fs.remove(outputPath));
    }
}
f_promise_1.run(() => {
    if (process.argv[2] === 'node') {
        clean();
        const libUsed = 'NODEJS';
        const sharpTransform = () => {
            return sharp().resize(500, 400).jpeg({
                quality: 80,
                progressive: true,
            });
        };
        for (const i in files) {
            const file = files[i];
            const fileExtension = path.extname(file);
            const fileName = path.basename(file, fileExtension);
            const outputPath = `output/node/${fileName}-${fileExtension}-${i}.jpeg`;
            let success = true;
            try {
                console.log(`[${libUsed}] Trying to convert : ${file} to ${outputPath}`);
                const startTime = Date.now();
                const outputStream = fs.createWriteStream(outputPath);
                fs.createReadStream(file)
                    .pipe(sharpTransform())
                    .on('error', () => {
                    console.log(`[${libUsed}] Caught error in ${file} convertion`);
                    success = false;
                    fs.remove(outputPath);
                })
                    .pipe(outputStream)
                    .on('close', () => {
                    if (success) {
                        console.log(`[${libUsed}] ${file} - Done - in ${(Date.now() - startTime) / 1000}s`);
                    }
                });
            }
            catch (e) {
                console.log('[${libUsed}] Err : Catched while doing things', e, e.stack);
            }
        }
    }
    else if (process.argv[2] === 'f') {
        clean();
        const libUsed = 'F-STREAMS';
        for (const i in files) {
            const file = files[i];
            const fileExtension = path.extname(file);
            const fileName = path.basename(file, fileExtension);
            const outputPath = `output/fstreams/${fileName}-${fileExtension}-${i}.jpeg`;
            const transformer = sharp().rotate().resize(500, 400).jpeg({
                quality: 80,
                progressive: true,
            });
            const startTime = Date.now();
            try {
                // console.log(`[${libUsed}] Trying to convert : ${file} to ${outputPath}`);
                const imageReader = f_streams_1.binaryFileReader(file);
                const outputReader = imageReader.nodeTransform(transformer);
                const imageWriter = f_streams_1.binaryFileWriter(outputPath);
                outputReader.pipe(imageWriter);
                console.log(`[${libUsed}] ${file} - [SHARP]] - in ${(Date.now() - startTime) / 1000}s`);
                magick(file);
                console.log(`[${libUsed}] ${file} - [IMM] - in ${(Date.now() - startTime) / 1000}s`);
            }
            catch (e) {
                magick(file);
                console.log(`[${libUsed}] ${file} - [__IMM] - in ${(Date.now() - startTime) / 1000}s`);
            }
        }
    }
});
//# sourceMappingURL=sharpTesting.js.map