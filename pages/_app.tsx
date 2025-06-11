import type { AppProps } from 'next/app';
import BaseLayout from '../components/BaseLayout';
import '../styles/globals.css';

console.log('BaseLayout typeof:', typeof BaseLayout);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default MyApp;
