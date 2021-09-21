import { useState } from "react";
import { addLine } from '../fetches/line';
import { getSession } from 'next-auth/client';
import AccessDenied from '../components/accessDenied';
import { Container, Segment, Form, Message, Accordion } from "semantic-ui-react";
import Layout from '../components/Layout';

const scriptOptions = [
  { key: 'devanagari', text: 'Devanagari', value: 'devanagari' },
  { key: 'roman', text: 'Roman', value: 'roman' }
];

const languageOptions = [
  { key: 'sanskrit', text: 'Sanskrit', value: 'sanskrit' },
  { key: 'english', text: 'english', value: 'english' }
];
let positive = true;

export default function Line({session}) {

  if (!session) { return  <Layout><AccessDenied/></Layout> }
  const [script, setScript] = useState('devanagari');
  const [language, setLanguage] = useState('sanskrit');
  const [line, setLine] = useState('');
  const [book, setBook] = useState('');
  const [bookContext, setBookContext] = useState('');
  const [showMessage, setShowMessage] = useState(false);

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
  const handleDismiss = () => { setShowMessage(false); };

  // const formFields = (<>
  //   <Form.Field>
  //     <Form.Select label="Script" value={script} onChange={onScriptChange} options={scriptOptions}>
  //       </Form.Select>                
  //   </Form.Field>
  //   <Form.Field>
  //     <Form.Select label="Language" options={languageOptions} value={language} onChange={onLanguageChange}>
  //       </Form.Select>                
  //   </Form.Field>
  // </>);

  // const panels = [
  //   {
  //     key: 'script details',
  //     title: 'Optional Details',
  //     content: formFields
  //   }
  // ];


  const getMessage = () => {
    if(positive) {
      return (<Message positive
        onDismiss={handleDismiss}
        header='Submission Success!'
        content='The paragraph was submitted successfully.'
      />);
    }
    return (<Message negative
      onDismiss={handleDismiss}
      header='Something went wrong!'
      content='There was a problem in submitting this paragraph.'
    />);    
    
  };


  const onSubmit = async () => {
    try{
      if(!book || !bookContext ) {
        // show message that something is not submitted.
        positive = false;
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
      console.log('Error setting data', e.message);
    }  
  };

  return (
    <Layout>
      <Container>
        <Segment>
            <Form onSubmit={onSubmit}>
              { showMessage ? getMessage() : null}
            {/* <Accordion panels={panels}  defaultActiveIndex={-1} /> */}
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