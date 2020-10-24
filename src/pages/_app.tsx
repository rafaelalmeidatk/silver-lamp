import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/cssreset.css';
import '../styles/base.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
