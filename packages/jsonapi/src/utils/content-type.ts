export function validateContentType (contentTypeStr: string, allowed = 'application/vnd.api+json') {
  const contentType = contentTypeStr.split(';');

  if (contentType[0] !== allowed) {
    return false;
  }

  if (contentType.length > 1) {
    return contentType.slice(1).every((v) => ['ext', 'profile'].includes(v.split('=')[0].trim()));
  }

  return true;
}
