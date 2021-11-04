import { Provider } from 'next-auth/client'
import Head from 'next/head';
import axios from "axios";
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';
axios.defaults.baseURL = process.env.NEXTAUTH_URL;
export default function App ({ Component, pageProps }) {
  return (
    <>
      <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
      <link href="https://fonts.googleapis.com/css2?family=Vesper+Libre&display=swap" rel="stylesheet"/>
      </Head>
      <CssBaseline>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
      </CssBaseline>
    </>
  )
}