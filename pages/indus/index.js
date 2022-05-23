import Layout from "../../components/Layout";
import Container from '@mui/material/Container';
import Head from 'next/head';
import content from './indus.json';
export default function Indus( ) {

  
  return (
    <Layout>
        <Head>
            <title>Smrthi - Indus</title>
        </Head>
        <Container maxWidth="lg">
              {
                  Object.keys(content).map(key => {
                      if (content[key].glyph !== '.' && content[key].glyph !== '?') {
                        return (
                            <div>
                              <span>{key}</span>&nbsp;
                              <span style={{fontFamily: 'Indus'}}>{content[key].glyph}</span>
                            </div>
                          )
                      }
                      return null;
                  }) 
            }
        </Container> 
    </Layout>
  )
}


export async function getServerSideProps() {
  return {
    props: {
    }
 };
}
