import { binaryFileReader, binaryFileWriter, nodeReader } from 'f-streams';
import { run, wait } from 'f-promise';
import sharp = require('sharp');
import * as fs from 'fs-extra';
import * as path from 'path';
import * as child_process from 'child_process';


// 11 Files & 4 expect to fail
const files = ["resources/Sample1.jpg",
    "resources/Sample2.png", "resources/Sample2.jpg", "resources/Sample2.ppm", "resources/Sample2.tga", "resources/Sample2.tiff", "resources/Sample2.bmp",
    "resources/Sample3.gif", "resources/Sample3.png", "resources/Sample3.tif", "resources/Sample3.bmp"];
console.log(`${files.length} files to convert`);
const clean = () => {
    console.log(`Cleaning : output`);
    wait(fs.remove('output'));
    wait(fs.mkdirp('output/f'));
    wait(fs.mkdirp('output/m'));
};

interface IImage {
    file: string;
    fileExtension: string;
    fileName: string;
    outputPath: string;
}


const magick = (image: IImage) => {
    return new Promise((resolve, reject) => {
        try {
            const command = `convert ${image.file} -thumbnail 500x400 mpr:orig -auto-orient output/m/${image.outputPath}`;
            child_process.exec(command)
                .on('exit', resolve);
        } catch (e) {
            console.log(e);
            wait(fs.remove(image.outputPath));
            reject();
        }
    });
}
;

run(() => {
    clean();
    for (const i in files) {
        // CONFIG
        const file = files[i];
        const fileExtension = path.extname(file);
        const fileName = path.basename(file, fileExtension);
        const outputPath = `${fileName}-${fileExtension}-${i}.jpeg`;

        const image: IImage = {
            file,
            fileExtension,
            fileName,
            outputPath,
        };

        const transformer = sharp().rotate().resize(500, 400).jpeg({
            quality: 80,
            progressive: true,
        });

        // Timer start
        const startTimeSharp = Date.now();
        try {
            binaryFileReader(image.file)
                .nodeTransform(transformer)
                .pipe(binaryFileWriter(`output/f/${image.outputPath}`));
            console.log(`[SHARP] - ${image.fileName}${image.fileExtension} in ${(Date.now() - startTimeSharp) / 1000}s`);
            const startTimeIMM = Date.now();
            wait(magick(image));
            console.log(`[IMM] - ${image.fileName}${image.fileExtension} - in ${(Date.now() - startTimeIMM) / 1000}s\n`);
        } catch (e) {
            wait(magick(image));
            console.log(`\n[FALLBACK_IMM] - ${image.fileName}${image.fileExtension} - in ${(Date.now() - startTimeSharp) / 1000}s\n`);
        }
    }
});


// Useless
// const node = () => {
//     clean();
//     const libUsed = 'NODEJS';
//     const sharpTransform = (): any => {
//         return sharp().resize(500, 400).jpeg({
//             quality: 80,
//             progressive: true,
//         });
//     };
//     for (const i in files) {
//         const file = files[i];
//         const fileExtension = path.extname(file);
//         const fileName = path.basename(file, fileExtension);
//         const outputPath = `output/node/${fileName}-${fileExtension}-${i}.jpeg`;
//         let success: boolean = true;
//         try {
//             console.log(`[${libUsed}] Trying to convert : ${file} to ${outputPath}`);
//             const startTime = Date.now();
//             const outputStream = fs.createWriteStream(outputPath);
//             fs.createReadStream(file)
//                 .pipe(sharpTransform())
//                 .on('error', () => {
//                     console.log(`[${libUsed}] Caught error in ${file} convertion`);
//                     success = false;
//                     fs.remove(outputPath);
//                 })
//                 .pipe(outputStream)
//                 .on('close', () => {
//                     if (success) {
//                         console.log(`[${libUsed}] ${file} - Done - in ${(Date.now() - startTime) / 1000}s`);
//                     }
//                 });
//         } catch (e) {
//             console.log('[${libUsed}] Err : Catched while doing things', e, e.stack);
//         }
//     }
// };



