import { Container, Divider, Grid } from 'semantic-ui-react';
import { signIn } from 'next-auth/client'

export default function Header (props) {
    const onClick = (e) => {
      e.preventDefault();
      signIn();

    };
    return (
      <Container>
        <Grid columns='equal'>
            <Grid.Column>
                <a href='/'>Home</a>
            </Grid.Column>
            <Grid.Column width={2}>
            <a href="/api/auth/signin"
                onClick={onClick}>Sign In</a>
            </Grid.Column>
        </Grid>
          <Divider/>
      </Container>
    )
  }