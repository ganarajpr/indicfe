import { getBookChapter, getLine } from "../../../../fetches/line";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import _ from "lodash-es";
import Head from "next/head";
import { getSum } from "../../../../lib/util";
import LanguageText from "../../../../components/LanguageText";
import Sanscript from "@sanskrit-coders/sanscript";
import ChevronLeftButton from "../../../../components/ChevronLeftButton";
import ChevronRightButton from "../../../../components/ChevronRightButton";

const getLines = (para) => {
    const lines = para.text.split("\n");
    return (
        <Link href={`/book/${para.book}/${para.bookContext}`}>
            <div className="grid grid-flow-col">
            <div className="grid justify-center self-center mr-6">
                {para.bookContext}
            </div>
            <div className="grid grid-flow-row justify-start">
                        {lines.map((line) => {
                            return (
                                <h5 className="text-2xl"
                                    key={line}
                                    data-test="line"
                                >
                                    <LanguageText source={para.script}>
                                        {line}
                                    </LanguageText>
                                </h5>
                            );
                        })}
                    
            </div>
            
            </div>
                
            </Link>
    );
};

const displayLines = (paragraphs) => {
    paragraphs.sort((a, b) => {
        const numa = getSum(a.bookContext);
        const numb = getSum(b.bookContext);
        return numa - numb;
    });
    return paragraphs.map((para) => {
        return (
            <div key={para.bookContext} className="grid grid-flow-row container mx-auto justify-start p-5 border-b cursor-pointer hover:shadow-md hover:bg-pink-900 hover:text-white">
                {getLines(para)}
            </div>
        );
    });
};

export default function Book({
    lines,
    bookName,
    chapter,
    nextContext,
    prevContext,
}) {
    return (
        <>
            <Layout>
                <Head>
                    <title>
                        Smrthi - {bookName} - {chapter}
                    </title>
                    <meta
                        name="description"
                        content={
                            "Chapters of " +
                            Sanscript.t(bookName, "hk", "devanagari")
                        }
                    />
                    <meta property="og:type" content="website" />
                    <meta
                        property="og:url"
                        content={`https://www.smrthi.com/book/${bookName}/chapter/${chapter}`}
                    />
                    <meta
                        property="og:title"
                        content={`Smrithi - ${Sanscript.t(
                            bookName,
                            "hk",
                            "devanagari"
                        )} `}
                    />
                    <meta
                        property="og:description"
                        content={
                            "Chapter " +
                            chapter +
                            " of " +
                            Sanscript.t(bookName, "hk", "devanagari")
                        }
                    />
                    <meta
                        property="og:image"
                        content={`https://www.smrthi.com/logo.jpg`}
                    />
                    <meta property="twitter:card" content="summary" />
                    <meta
                        property="twitter:url"
                        content={`https://www.smrthi.com/book/${bookName}/chapter/${chapter}`}
                    />
                    <meta
                        property="twitter:title"
                        content={`Chapter ${chapter} of ${Sanscript.t(
                            bookName,
                            "hk",
                            "devanagari"
                        )}`}
                    />
                    <meta
                        property="twitter:description"
                        content={
                            "Chapter " +
                            chapter +
                            " of " +
                            Sanscript.t(bookName, "hk", "devanagari")
                        }
                    />
                    <meta
                        property="twitter:image"
                        content={`https://www.smrthi.com/logo.jpg`}
                    />
                </Head>
                <Link href={`/book/${lines[0].book}`}>
                    <div className="grid grid-flow-col justify-self-center gap-2 cursor-pointer">
                        <img className="w-14" src="/smrthi-symbol.png" />
                        <p
                            className="text-4xl inline justify-center self-center text-slate-700"
                            data-test="bookLocation"
                        >
                            <LanguageText source="hk">
                                {lines[0].book}
                            </LanguageText>
                            {" " + chapter}
                        </p>
                    </div>
                </Link>
                <div className="grid mt-8 mb-20 mx-4">
                    <div className="grid grid-flow-row">
                        {displayLines(lines)} 
                    </div>
                </div>

            </Layout>
            <div className="grid grid-flow-col w-full h-16 border-4 bottom-0 fixed bg-pink-900 text-white">
                {prevContext && (
                    <Link
                        href={`/book/${lines[0].book}/chapter/${prevContext}`}
                    >
                        <ChevronLeftButton
                            data-test="prevContext"
                            className="justify-self-start grid grid-flow-col place-items-center text-2xl font-bold ml-5 p-1 hover:bg-white hover:text-pink-900"
                        >
                            Previous
                        </ChevronLeftButton>
                    </Link>
                )}
                {nextContext && (
                    <Link
                        href={`/book/${lines[0].book}/chapter/${nextContext}`}
                    >
                        <ChevronRightButton
                            data-test="nextContext"
                            className="justify-self-end grid grid-flow-col place-items-center font-bold text-2xl mr-5 p-1 hover:bg-white hover:text-pink-900"
                        >
                            Next
                        </ChevronRightButton>
                    </Link>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { name, chpNo } = context.params;
    const { lines, chapter, nextContext, prevContext } = await getBookChapter(
        name,
        chpNo
    );
    return {
        props: {
            lines,
            chapter,
            bookName: name,
            nextContext,
            prevContext,
        },
    };
}
