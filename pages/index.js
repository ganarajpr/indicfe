import Layout from "../components/Layout";
import { getBooks } from "../fetches/books";
import Link from "next/link";
import Head from "next/head";
import Sanscript from "@sanskrit-coders/sanscript";
import _ from "lodash-es";
export default function Home({ books }) {

    const getBookForKey = (key) => {
        return books[key].map((book) => {
            return (
                <Link href={`/book/${book}`} key={book}>
                    <div
                        className="col-span-12 shadow-md p-3 border cursor-pointer hover:bg-pink-900 hover:text-white"
                        key={book}
                    >
                        <p className="text-lg">
                            {Sanscript.t(book, "hk", "devanagari")} /{" "}
                            {Sanscript.t(book, "hk", "iast")}
                        </p>
                    </div>
                </Link>
            );
        });
    };

    const getBookList = () => {
        const keys = Object.keys(books);
        return keys.map((key) => {
            return (<>
                <div
                    className="col-span-12 shadow-md p-3 border cursor-pointer bg-pink-900 text-white my-4"
                    >{String.fromCharCode(key).toUpperCase()}</div>
                {getBookForKey(key)}
            </>);
            
            });
    };

    return (
        <Layout>
            <Head>
                <title>Smrthi - Home</title>
                <meta
                    name="description"
                    content={"Books of Ancient Sanskrit/Indic Literature"}
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://www.smrthi.com/`} />
                <meta property="og:title" content={`Smrithi - Home`} />
                <meta
                    property="og:description"
                    content={"Books of Ancient Sanskrit/Indic Literature"}
                />
                <meta
                    property="og:image"
                    content={`https://www.smrthi.com/logo.jpg`}
                />
                <meta property="twitter:card" content="summary" />
                <meta
                    property="twitter:url"
                    content={`https://www.smrthi.com/`}
                />
                <meta property="twitter:title" content={`Smrithi - Home`} />
                <meta
                    property="twitter:description"
                    content={"Smrithi - Home"}
                />
                <meta
                    property="twitter:image"
                    content={`https://www.smrthi.com/logo.jpg`}
                />
            </Head>
            <div className="grid grid-flow-row grid-cols-12 gap-1 p-4">
                {getBookList()}
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    const { books } = await getBooks();
    // books.sort((a, b) => {
    //     const numa = a.toLowerCase().charCodeAt(0);
    //     const numb = b.toLowerCase().charCodeAt(0);
    //     return numa - numb;
    // });
    const grouped = _.groupBy(books, (book) => {
        return book.toLowerCase().charCodeAt(0);
    });
    return {
        props: {
            books: grouped,
        },
    };
}
