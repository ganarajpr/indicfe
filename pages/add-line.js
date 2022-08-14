// import { addLine } from '../fetches/line';
// import { getSession } from 'next-auth/client';
// import AccessDenied from '../components/accessDenied';
// import Layout from '../components/Layout';
// import Container from '@mui/material/Container';
// import AddLineForm from "../components/AddLineForm";
// import { useSession } from 'next-auth/client';
// import Head from 'next/head';

// export default function Line() {
//     const [session] = useSession();

//     if (!session) { return  <Layout><AccessDenied/></Layout> }

//     const onSubmit = async ({line, script, language, book, bookContext}) => {
//         try{
//         const resp = await addLine(line, script, language, book, bookContext);
//         } catch (e) {
//         }  
//     };

//     return (
//         <Layout>
//             <Head>
//                 <title>Smrthi - Add a new Verse</title>
//             </Head>
//             <Container maxWidth="sm">
//                 <AddLineForm onSubmit={onSubmit}/>
//             </Container>      
//         </Layout>    
//     );
// }



// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   return {
//     props: {
//       session
//     }
//   }
// }

export default function Line() {
  return (<></>);
}
