import * as fs from 'fs-extra';
import * as path from 'path';

import { run, wait } from 'f-promise';

import sharp = require('sharp');


const sharpTransform = (): any => {
  return sharp().resize(500, 400).jpeg();
};

// 11 Files & 4 expect to fail
const files = ["resources/Sample1.jpg",
  "resources/Sample2.png", "resources/Sample2.jpg", "resources/Sample2.ppm", "resources/Sample2.tga", "resources/Sample2.tiff", "resources/Sample2.bmp",
  "resources/Sample3.gif", "resources/Sample3.png", "resources/Sample3.tif", "resources/Sample3.bmp"];
console.log(`${files.length} files to convert`);

run(() => {
  console.log('Cleaning : output');
  wait(fs.remove('output'));
  wait(fs.mkdirp('output'));

  console.log('WITHOUT CUSTOM LIBRARY');
  for(const i in files) {
    try {
      const file = files[i];
      const fileExtension = path.extname(file);
      const fileName = path.basename(file, fileExtension);
      const startTime = Date.now();
      const outputPath = `output/${fileName}-${fileExtension}-${i}.jpeg`;
      let success: boolean = true;

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
    } catch (e) {
      console.log('Err : Catched while doing things', e, e.stack);
    }
  }
});

