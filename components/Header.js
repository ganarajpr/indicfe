import { Container, Divider, Grid } from 'semantic-ui-react';
export default function Header (props) {
    return (
      <Container>
        <Grid columns='equal'>
            <Grid.Column>
                <a href='/'>Home</a>
            </Grid.Column>
            <Grid.Column width={2}>
                <a>Sign In</a>
            </Grid.Column>
        </Grid>
          <Divider/>
      </Container>
    )
  }