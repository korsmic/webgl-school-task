interface Config {
  SITE_URL: string | null; //* サイトURL 'https://www.a.co.jp/'
  SITE_PATH: string | null; //* サイトのパス 'a/b/'
  WP_PATH: string | null; //* WordPressのパス 'wp-content/themes/a/'
  IMAGE_URL: string | null; //* 画像のパス 'https://www.a.co.jp/'
  BREAK_POINT: number;
  PC_DESIGN_SIZE: number;
  SP_DESIGN_SIZE: number;
}


const config: Config = {
  SITE_URL: 'https://korsmic.github.io/',
  SITE_PATH: '',
  WP_PATH: '',
  IMAGE_URL: '',
  BREAK_POINT: 768,
  PC_DESIGN_SIZE: 1400,
  SP_DESIGN_SIZE: 375,
} as const satisfies Config;

export default config;
