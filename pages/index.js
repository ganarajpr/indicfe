import Layout from "../components/Layout";
import { getBooks } from "../fetches/books";
import Link from "next/link";
import Head from "next/head";
import Sanscript from "@sanskrit-coders/sanscript";

export default function Home({ books }) {

    const getBookList = () => {
        if (books?.length) {
            return books.map((book) => {
                return (
                    <Link href={`/book/${book}`}>
                        <div
                            className="col-span-3 p-3 border cursor-pointer"
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
        }
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
    return {
        props: {
            books,
        },
    };
}
