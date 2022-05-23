import Layout from "../../components/Layout";
import Container from '@mui/material/Container';
import Head from 'next/head';
import { getSeals } from "../../fetches/indus";
export default function Indus({seals}) {

  
  return (
    <Layout>
        <Head>
            <title>Smrthi - Indus</title>
        </Head>
        <Container maxWidth="lg">
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
        </Container> 
    </Layout>
  )
}


export async function getServerSideProps() {
    const { seals } = await getSeals();
    // console.log(seals[0]);
  return {
      props: {
        seals
    }
 };
}
