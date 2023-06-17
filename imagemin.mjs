import { promises as fs } from 'fs';
import { mkdirp } from 'mkdirp';
import path from 'path';
import sharp from 'sharp';

const SERACH_EXT_LIST = ['.jpg', '.jpeg', '.png'];

const searchFiles = async (dirPath, pubDirPath) => {
  const allDirents = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const newDirPath = path.join(dirPath, dirent.name);
      const newPubPath = path.join(pubDirPath, dirent.name);
      const newFiles = await searchFiles(newDirPath, newPubPath);
      files.push(...newFiles);
    }
    if (
      dirent.isFile() &&
      SERACH_EXT_LIST.includes(path.extname(dirent.name))
    ) {
      files.push({
        dirName: path.join(dirPath),
        pubDirName: path.join(pubDirPath),
        fileName: dirent.name,
        ext: path.extname(dirent.name),
      });
      mkdirp(path.join(pubDirPath));
    }
  }
  return files;
};

(async () => {
  const SERACH_TARGET_DIR = './src/images';
  const PUBLIC_TARGET_DIR = './public/assets/images';
  const imageFileInfos = await searchFiles(
    SERACH_TARGET_DIR,
    PUBLIC_TARGET_DIR
  );
  const totalImages = imageFileInfos.length;

  for (const [
    index,
    { dirName, pubDirName, fileName, ext },
  ] of imageFileInfos.entries()) {
    const webpOption = { quality: 85, effort: 0, lossless: false };
    const avifOption = { quality: 85, effort: 0, lossless: false };

    const sharpStream = await sharp(`./${dirName}/${fileName}`, {
      sequentialRead: true,
    });

    await sharpStream
      .clone()
      .webp(webpOption)
      .toFile(`./${pubDirName}/${fileName.split('.')[0]}.webp`)
      .then(() => {
        console.log(`${index + 1}/${totalImages} : ${dirName}/${fileName}`);
      })
      .catch(function (err) {
        console.log(err);
      });

    await sharpStream
      .clone()
      .avif(avifOption)
      .toFile(`./${pubDirName}/${fileName.split('.')[0]}.avif`)
      .then(() => {
        console.log(`${index + 1}/${totalImages} : ${dirName}/${fileName}`);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
})();
