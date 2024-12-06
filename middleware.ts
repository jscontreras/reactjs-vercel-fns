export default function middleware(request: Request) {
  console.log('Middleware: Incoming request!');
  console.log(request.url)
  // if (url.pathname.startsWith('/api')) {
  //   console.log('Middleware Intercepting API');
  // } else {
  //   console.log('MIddlewar running for Page');
  // }
}

export const config = {
  matcher: ['/api/:path*']
};