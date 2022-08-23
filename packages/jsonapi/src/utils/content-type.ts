export function validateContentType (contentTypeStr: string, allowed = 'application/vnd.api+json', ignoreMedia = false) {
  const contentType = contentTypeStr.split(';');

  console.log(contentType);

  if (contentType[0] !== allowed) {
    return false;
  }

  if (!ignoreMedia && contentType.length > 1) {
    return contentType.slice(1).every((v) => ['ext', 'profile'].includes(v.split('=')[0].trim()));
  }

  return true;
}
