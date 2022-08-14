import Layout from "../../components/Layout";
import Head from 'next/head';
import { getSeals } from "../../fetches/indus";
export default function Indus({seals}) {

  
  return (
    <Layout>
        <Head>
            <title>Smrthi - Indus</title>
        </Head>
        <div className="grid grid-flow-row justify-center">
              {/* {
                  Object.keys(content).map(key => {
                      if (content[key][0].glyph !== '.' && content[key][0].glyph !== '?') {
                        return (
                            <div>
                              <span>{key}</span>&nbsp;
                              <span style={{fontFamily: 'Indus', fontSize: '40px'}}>{content[key][0].glyph}</span>
                            </div>
                          )
                      }
                      return null;
                  }) 
            } */}
              {
                  seals.map( (seal) => { 
                      return (
                            <div key={seal.text}>
                            {
                                seal.glyphs.map( (symbol, index) => {
                                    return (
                                        <span key={index} style={{ fontFamily: 'Indus', fontSize: '40px' }}>{symbol}</span>
                                    )
                                })
                            }
                            </div>
                        )
                  })
              }
        </div> 
    </Layout>
  )
}


export async function getServerSideProps() {
    const { seals } = await getSeals();
  return {
      props: {
        seals
    }
 };
}
