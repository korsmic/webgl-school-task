import config from '.config';

export default function bgi(src: string, retina: boolean = false): string {
  const IS_WP = process.env.IS_WP === 'true';
  const SITE_PATH = IS_WP ? config.WP_PATH : config.SITE_PATH;
  const IMAGE_URL = config.IMAGE_URL === '' ? '/' : config.IMAGE_URL;
  const PATH = 'assets/images';
  const pcSrc = `${IMAGE_URL}${SITE_PATH}${PATH}/${src}`;
  const retinaSrc = `${IMAGE_URL}${SITE_PATH}${PATH}/${src}@2x`;
  const defaultBgi = `background-image: url('${pcSrc}.webp');`;
  const retinaBgi = retina
    ? `background-image: image-set(url('${pcSrc}.webp') 1x, url('${retinaSrc}.webp') 2x);background-image: -webkit-image-set(url('${pcSrc}.webp') 1x, url('${retinaSrc}.webp') 2x);`
    : ``;
  const bgi = `${defaultBgi}${retinaBgi}`;
  return bgi;
}
