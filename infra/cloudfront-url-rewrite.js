// CloudFront Function: URL rewriting + redirects
// Associated with viewer-request event on CloudFront distribution E1ACQY3898IZF9
//
// Handles:
// 1. Exact-match redirects (old Squarespace URLs → new paths)
// 2. Clean URL rewriting (append .html for extensionless paths)
// 3. Index page rewriting (/blog/ → /blog.html)

// Exact-match redirect map (old URL → new URL)
var redirects = {
  '/meet-nic-haralambous': '/about',
  '/the-speaker': '/speaker',
  '/virtual-keynote-speaker': '/speaker',
  '/contact-me': '/contact',
  '/businesses': '/about',
  '/its-not-over': '/media',
  '/side-hustle-course': '/books/how-to-start-a-side-hustle'
};

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // 1. Check exact-match redirects
  if (redirects[uri]) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: redirects[uri] },
        'cache-control': { value: 'public, max-age=86400' }
      }
    };
  }

  // 2. Strip trailing slash (except root)
  if (uri.length > 1 && uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }

  // 3. If URI has no file extension, append .html
  //    Skip root (/), paths with dots (already have extension), and _next assets
  if (uri !== '/' && !uri.includes('.') && !uri.startsWith('/_next')) {
    request.uri = uri + '.html';
  }

  return request;
}
