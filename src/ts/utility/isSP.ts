import config from '../../../.config';

export default function isSP(): boolean {
  const breakPoint = config.BREAK_POINT;
  const width = window.innerWidth;
  return width < breakPoint;
}
