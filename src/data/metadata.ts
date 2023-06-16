import config from '../../.config';
const IMAGE_URL = config.IMAGE_URL === '' ? '/' : config.IMAGE_URL;

const genUrl = (id) => {
  return `/${config.SITE_URL}${config.SITE_PATH}${id}/`;
};

const genHeadUrl = (id) => {
  return `${config.SITE_URL}${config.SITE_PATH}${id}/`;
};

const metadata = {
  global: {
    title: 'WebGL School Task',
  },
  top: {
    url: '/',
  },
  t01: {
    title: '01',
    url: '/01/',
    github: 'https://github.com/korsmic/webgl-school-task/blob/main/src/ts/t01.ts',
  },
  t02: {
    title: '02',
    url: '/02/',
    github: 'https://github.com/korsmic/webgl-school-task/blob/main/src/ts/t02.ts',
  },
  t03: {
    title: '03',
    url: '/03/',
    github: 'https://github.com/korsmic/webgl-school-task/blob/main/src/ts/t03.ts',
  },
};

export default metadata;

