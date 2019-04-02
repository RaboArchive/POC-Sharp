import * as fs from 'fs';
import sharp = require('sharp');

// console.log(sharp);

const sharpTransform = (): any => {
  return sharp().resize(50, 20).jpeg();
};

  console.log('WITHOUT CUSTOM LIBRARY');
  const filePNGPath = "resources/dice.png";
  const fileBMPPath = "resources/lena.bmp";

try {
  console.log(`Trying to convert : ${filePNGPath}`)
  const outputStream = fs.createWriteStream('output/dice-output-WITHOUT.jpeg');
  const inputStream = fs.createReadStream(filePNGPath)
  .pipe(sharpTransform())
  .on('error', () => { console.log('Caught error in PNG convertion'); })
  .pipe(outputStream)
  .on('close', () => { console.log(`${filePNGPath} - Done`); });
} catch (e) {
  console.log('Err : Catched while doing things with PNG', e, e.stack);
}

/*try {
  console.log(`Trying to convert : ${fileBMPPath}`)
  const outputStream = fs.createWriteStream('output/lena-output-WITHOUT.jpeg');
  const inputStream = fs.createReadStream(fileBMPPath)
  .pipe(sharpTransform())
  .on('error', () => { console.log('Caught error in BMP convertion'); })
  .pipe(outputStream)
  .on('close', () => { console.log(`${fileBMPPath} - Done`); });
} catch (e) {
  console.log('Err : Catched while doing things with  BMP', e, e.stack);
}*/
