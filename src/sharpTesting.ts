import * as fs from 'fs-extra';
import * as path from 'path';

import { run, wait } from 'f-promise';
import { binaryFileReader, binaryFileWriter, nodeWriter } from 'f-streams';

import sharp = require('sharp');


// 11 Files & 4 expect to fail
const files = ["resources/Sample1.jpg",
    "resources/Sample2.png", "resources/Sample2.jpg", "resources/Sample2.ppm", "resources/Sample2.tga", "resources/Sample2.tiff", "resources/Sample2.bmp",
    "resources/Sample3.gif", "resources/Sample3.png", "resources/Sample3.tif", "resources/Sample3.bmp"];
console.log(`${files.length} files to convert`);
const clean = () => {
    console.log(`Cleaning : output`);
    wait(fs.remove('output'));
    wait(fs.mkdirp('output/node'));
    wait(fs.mkdirp('output/fstreams'));
};

if (process.argv[2] === 'node') {
    run(() => {
        clean();
        const libUsed = 'NODEJS';
        const sharpTransform = (): any => {
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
                let success: boolean = true;
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
            } catch (e) {
                console.log('[${libUsed}] Err : Catched while doing things', e, e.stack);
            }
        }
    });
} else {
    run(() => {
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
            try {
                console.log(`[${libUsed}] Trying to convert : ${file} to ${outputPath}`);

                const startTime = Date.now();
                const imageReader = binaryFileReader(file);
                const outputReader = imageReader.nodeTransform(transformer);
                const imageWriter = binaryFileWriter(outputPath);
                outputReader.pipe(imageWriter);

                console.log(`[${libUsed}] ${file} - Done - in ${(Date.now() - startTime) / 1000}s`);
            } catch (e) {
                console.log(`[${libUsed}] Err : Catched while doing things to ${files[i]}`);
                wait(fs.remove(outputPath));
            }
        }
    });

}


