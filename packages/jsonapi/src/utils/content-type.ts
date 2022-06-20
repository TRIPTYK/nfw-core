export function validateContentType (contentTypeStr: string) {
  const contentType = contentTypeStr.split(';');

  if (contentType[0] !== 'application/vnd.api+json') {
    return false;
  }

  if (contentType.length > 1) {
    return contentType.slice(1).every((v) => ['ext', 'profile'].includes(v.split('=')[0].trim()));
  }

  return true;
}
