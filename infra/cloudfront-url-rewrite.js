// CloudFront Function: URL rewriting + redirects
// Associated with viewer-request event on CloudFront distribution E1ACQY3898IZF9
//
// Handles:
// 1. Exact-match redirects (old Squarespace URLs → new paths)
// 2. Squarespace blog URL pattern redirect (/blog/YYYY/MM/DD/slug → /blog/slug)
// 3. Clean URL rewriting (append .html for extensionless paths)

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

  // 1. Exact-match redirects
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

  // 2. Squarespace dated blog URLs: /blog/YYYY/MM/DD/slug → /blog/slug
  var datedBlogMatch = uri.match(/^\/blog\/\d{4}\/\d{1,2}\/\d{1,2}\/(.+)/);
  if (datedBlogMatch) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: '/blog/' + datedBlogMatch[1] },
        'cache-control': { value: 'public, max-age=86400' }
      }
    };
  }

  // 3. Strip trailing slash (except root)
  if (uri.length > 1 && uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }

  // 4. Append correct extension for extensionless paths (skip root, files with extensions, _next assets)
  // Next.js client-side nav fetches RSC payload with Accept: text/x-component — serve .txt
  // Normal document requests (browser, crawlers) — serve .html
  if (uri !== '/' && !uri.includes('.') && !uri.startsWith('/_next')) {
    var accept = request.headers?.accept?.value || '';
    var isRscRequest = accept.indexOf('text/x-component') !== -1;
    request.uri = isRscRequest ? uri + '.txt' : uri + '.html';
  }

  return request;
}
