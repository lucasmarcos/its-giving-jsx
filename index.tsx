/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment, StrictMode } from "https://esm.sh/react";
import { renderToStaticMarkup } from "https://esm.sh/react-dom/server";

// import { jsx, jssx } from "https://esm.sh/react/jsx-runtime";

const App = () => {
  return (
    <StrictMode>
      <html lang="pt">
        <head>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>

          <title>Olá</title>

          <style>{`
            * { font-family: sans-serif; }
          `}</style>

          <link rel="icon" href="data:"/>
        </head>
        <body>
          <div className="container">
            <h1>Bem-vindo</h1>
          </div>
        </body>
      </html>
    </StrictMode>
  );
};

const rendered = renderToStaticMarkup(createElement(App));

const handleRequest = (req: Request): Response => {
  const headers = new Headers({
    "Content-Type": "text/html; charset=UTF-8"
  });

  return(
    new Response(`<!doctype html>${rendered}`, { status: 200, headers: headers })
  );
};

const server = Deno.listen({ port: 9091 });

for await (const connection of server) {

  (async () => {
    const httpConnection = Deno.serveHttp(connection);

    for await (const requestEvent of httpConnection) {
      requestEvent.respondWith(
        handleRequest(requestEvent.request)
      );
    }
  })();

}
