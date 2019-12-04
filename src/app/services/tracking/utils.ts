export function prefixDot(string?: string) {
  return string && string.length > 0 ? `.${string}` : '';
}

export function getSectionStringForTracking(serviceTitle: string, pageTitle: string, uiPartTitle?: string, filter?: string) {
  return `${serviceTitle}${prefixDot(pageTitle)}${prefixDot(uiPartTitle)}${prefixDot(filter)}`;
}
