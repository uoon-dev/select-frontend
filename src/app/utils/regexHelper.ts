import Env from 'app/config/env';

export function isRidiselectUrl(url: string) {
  const schemeReg = /^https?:\/\//;
  const selectUrl = schemeReg.test(Env.SELECT_URL)
    ? Env.SELECT_URL.replace('https', '')
    : Env.SELECT_URL;
  const ridiselectReg = new RegExp(`^https?:${selectUrl}`);

  return ridiselectReg.test(url) || !schemeReg.test(url);
}
