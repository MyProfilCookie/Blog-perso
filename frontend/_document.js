import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Préchargement des polices */}
        <link
          as="font"
          crossOrigin="anonymous"
          href="/static/media/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw-s.p.7b3669ea.woff2"
          rel="preload"
          type="font/woff2"
        />
        <link
          as="font"
          crossOrigin="anonymous"
          href="/static/media/uU9NCBsR6Z2vfE9aq3bh3dSDqFGedA-s.p.b416adcb.woff2"
          rel="preload"
          type="font/woff2"
        />
        <link
          as="font"
          crossOrigin="anonymous"
          href="/static/media/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7NuzlojwUKQ-s.p.a2cd1f4f.woff2"
          rel="preload"
          type="font/woff2"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
