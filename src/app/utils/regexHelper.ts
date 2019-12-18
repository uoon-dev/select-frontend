import Env from 'app/config/env';

export function isRidiselectUrl(url: string) {
  const schemeReg = /^https?:\/\//;

  const ridiselectReg = schemeReg.test(Env.SELECT_URL)
    ? new RegExp(`${Env.SELECT_URL}`)
    : new RegExp(`https:${Env.SELECT_URL}`);

  return ridiselectReg.test(url) || !schemeReg.test(url);
}
