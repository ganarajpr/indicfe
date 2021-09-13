import { Container } from 'semantic-ui-react';
import Header from './Header';
export default function Layout (props) {
    return (
      <>
      <Header/>
      <Container>
          {props.children}
      </Container>
      </>
    )
  }