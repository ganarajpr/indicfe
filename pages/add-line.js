import { useState } from "react";
import { addLine } from '../fetches/line';
import { getSession } from 'next-auth/client';
import AccessDenied from '../components/accessDenied';
import { Form, Message, Dropdown } from "semantic-ui-react";
import Layout from '../components/Layout';
import Container from '@mui/material/Container';
import AddLineForm from "../components/AddLineForm";

const scriptOptions = [
  { key: 'devanagari', text: 'Devanagari', value: 'devanagari' },
  { key: 'roman', text: 'Roman', value: 'roman' }
];

const languageOptions = [
  { key: 'sanskrit', text: 'Sanskrit', value: 'sanskrit' },
  { key: 'english', text: 'English', value: 'english' }
];
let positive = true;
const numberOfHindiCharacters = 128;
const unicodeShift = 0x0900;
const hindiAlphabet = [];
for(let i = 0; i < numberOfHindiCharacters; i++) {
  hindiAlphabet.push("\\u0" + (unicodeShift + i).toString(16));
}

const devanagariRegex = new RegExp("(?:^|\\s)["+hindiAlphabet.join("")+"]+?(?:\\s|$)", "g");


export default function Line({session}) {

  let errorMessage = 'Have you filled all required fields, Is the content in devanagari script?';

  if (!session) { return  <Layout><AccessDenied/></Layout> }


  const onSubmit = async () => {
    try{
      if(!book || !bookContext ) {
        // show message that something is not submitted.
        positive = false;
        setShowMessage(true);
        return;
      }
      if(!/^[^a-zA-Z]+$/.test(line) || !devanagariRegex.test(line) ){
        positive = false;
        errorMessage = 'Content is not devanagari';
        setShowMessage(true);
        return;        
      }
      const resp = await addLine(line, script, language, book, bookContext);
      setLine('');
      positive = true;
      setShowMessage(true);
    } catch (e) {
      positive = false;
      setShowMessage(true);
    }  
  };

  return (
    <Layout>
        <Container maxWidth="sm">
            <AddLineForm/>
        </Container>      
    </Layout>    
  );
}



export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session
    }
  }
}