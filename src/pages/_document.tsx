import Document, {Html, Head, Main, NextScript} from 'next/document';

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="prefetch"
            href="/fonts/Wotfard/wotfard-bold-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="prefetch"
            href="/fonts/Wotfard/wotfard-semibold-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="prefetch"
            href="/fonts/Wotfard/wotfard-regular-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
        </Head>
        <body className="font-sans">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
