import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css';
import { Provider } from 'next-auth/client'
import Head from 'next/head';
export default function App ({ Component, pageProps }) {
  return (
    <>
      <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Vesper+Libre&display=swap" rel="stylesheet"/>
      </Head>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}