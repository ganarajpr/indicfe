import { Container, Divider, Grid, Image } from 'semantic-ui-react';
import { signIn, useSession } from 'next-auth/client'
import styled from 'styled-components';

const HeaderContainer = styled(Container)`
  margin-top:10px;
`;


export default function Header (props) {
  const [session] = useSession();
    const onClick = (e) => {
      e.preventDefault();
      signIn();
    };

    const getSignIn = () => {
      if (session?.user?.name) {
        return (<div>
          <Image src={session.user.image}avatar />
          <span>{session.user.name}</span>
        </div>);
      }
      return (<a href="/api/auth/signin"
           onClick={onClick}>Sign In</a>
        );
    };
    return (
      <HeaderContainer>
        <Grid columns='equal'>
            <Grid.Column>
                <a href='/'>Home</a>
            </Grid.Column>
            <Grid.Column width={3}>
              {getSignIn()}
            </Grid.Column>    
        </Grid>
          <Divider/>
      </HeaderContainer>
    )
  }