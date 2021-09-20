import { useState } from "react";
import { addLine } from '../fetches/line';
import { getSession } from 'next-auth/client';
import Layout from '../components/Layout';
import AccessDenied from '../components/accessDenied';
import { Container, Segment, Form } from "semantic-ui-react";

const scriptOptions = [
  { key: 'devanagari', text: 'Devanagari', value: 'devanagari' },
  { key: 'roman', text: 'Roman', value: 'roman' }
];

const languageOptions = [
  { key: 'sanskrit', text: 'Sanskrit', value: 'sanskrit' },
  { key: 'english', text: 'english', value: 'english' }
];

export default function Line({session}) {

  if (!session) { return  <Layout><AccessDenied/></Layout> }
  const [script, setScript] = useState('devanagari');
  const [language, setLanguage] = useState('sanskrit');
  const [line, setLine] = useState('');
  const [book, setBook] = useState('');
  const [bookContext, setBookContext] = useState('');

  const onScriptChange = (e, {value}) => {
    setScript(value);
  };

  const onLineChange = (e, {value}) => {
    setLine(value);
  };

  const onLanguageChange = (e, {value}) => {
    setLanguage(value);
  };

  const onBookChange = (e, {value}) => {
    setBook(value);
  };

  const onBookContextChange = (e, {value}) => {
    setBookContext(value);
  };


  const onSubmit = async () => {
    console.log(line, script, language, book, bookContext);
    try{
      const resp = await addLine(line, script, language, book, bookContext);
      setLine('');
    } catch (e) {
      setResult("Error setting data" + e.toString());
    }  
  };

  return (
    <Layout>
      <Container>
        <Segment>
            <Form onSubmit={onSubmit}>
            <Form.Field>
                <Form.Select label="Script" value={script} onChange={onScriptChange} options={scriptOptions}>
                  </Form.Select>                
              </Form.Field>
              <Form.Field>
                <Form.Select label="Language" options={languageOptions} value={language} onChange={onLanguageChange}>
                  </Form.Select>                
              </Form.Field>
              <Form.Field>
                <Form.TextArea label="Paragraph" placeholder="1 Paragraph or Shloka or Mantra" value={line} onChange={onLineChange}>
                </Form.TextArea>                
              </Form.Field>
              <Form.Field>
                <Form.Input label="Book" placeholder="Book it belongs to" value={book} onChange={onBookChange}>
                </Form.Input>
              </Form.Field>
              <Form.Field>
                <Form.Input label="Book Context" placeholder="ex: 10.3.1" value={bookContext} onChange={onBookContextChange}>
                </Form.Input>                  
              </Form.Field>
              <Form.Button>Add Paragraph</Form.Button>
            </Form>
        </Segment>   
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