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
  r01: {
    url: '/r01/',
  },
};

export default metadata;

