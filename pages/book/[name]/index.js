import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import Link from 'next/link';
import _ from 'lodash-es';
import Head from 'next/head';
import Sanscript from '@sanskrit-coders/sanscript';
import LanguageText from "../../../components/LanguageText";

const getBookContextList = (bookContexts, bookName) => {
    if(bookContexts?.length) {
        return _.map(bookContexts, (spl) => {
            return (
                <Link href={`/book/${bookName}/chapter/${spl}`} key={spl}>
                    <div
                        className="col-span-12 md:col-span-6 lg:col-span-3 shadow-md p-3 border cursor-pointer items-center justify-items-center hover:bg-pink-900 hover:text-white">
                        <div className="text-lg text-center">
                            {spl}
                        </div>
                    </div>
                </Link>
            );
        });
    }
  };
export default function Book({ bookContexts,bookName }) {

  return (
    <Layout>
        <Head>
            <title>Smrthi - {bookName}</title>
            <meta name="description" content={ "Chapters of " + Sanscript.t(bookName, 'hk', 'devanagari') }/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`https://www.smrthi.com/book/${bookName}`}/>
            <meta property="og:title" content={`Smrithi - ${Sanscript.t(bookName, 'hk', 'devanagari')} `}/>
            <meta property="og:description" content={ "Chapters of " + Sanscript.t(bookName, 'hk', 'devanagari') }/>
            <meta property="og:image" content={`https://www.smrthi.com/logo.jpg`}/>
            <meta property="twitter:card" content="summary"/>
            <meta property="twitter:url" content={`https://www.smrthi.com/book/${bookName}`}/>
            <meta property="twitter:title" content={`${Sanscript.t(bookName, 'hk', 'devanagari')}`}/>
            <meta property="twitter:description" content={ "Chapters of " + Sanscript.t(bookName, 'hk', 'devanagari') }/>
            <meta property="twitter:image" content={`https://www.smrthi.com/logo.jpg`}/>
        </Head>
        <div className="grid grid-flow-col justify-center gap-2">
            <img className="w-14" src="/smrthi-symbol.png" height="50" />
            <p className="text-4xl inline justify-center self-center text-slate-700" data-test="bookName">
                <LanguageText source="hk">{bookName}</LanguageText>
            </p>
        </div>
        <div className="grid grid-flow-row grid-cols-12 gap-1 p-4">
            {getBookContextList(bookContexts, bookName)}
        </div>
    </Layout>
  )
}



export async function getServerSideProps(context) {
  const { name } = context.params;
  const { bookContexts }  = await getBook(name);
  return {
    props: {
      bookContexts,
      bookName: name
    }
 };
}
