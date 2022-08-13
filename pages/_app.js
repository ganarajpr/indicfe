import { Provider } from "next-auth/client";
import Head from "next/head";
import axios from "axios";
import LanguageProvider from "../components/LanguageProvider";
import "../styles/globals.css";
axios.defaults.baseURL = process.env.NEXTAUTH_URL;
export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Vesper+Libre&display=swap"
                    rel="stylesheet"
                />
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-YMJXKTXSRF"
                ></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-YMJXKTXSRF', {
                    page_path: window.location.pathname,
                    });
                `,
                    }}
                />
            </Head>
            <Provider session={pageProps.session}>
                <LanguageProvider>
                    <Component {...pageProps} />
                </LanguageProvider>
            </Provider>
        </>
    );
}
