import { Container, Divider, Grid, Image, Dropdown, Header } from 'semantic-ui-react';
import { signIn, signOut, useSession } from 'next-auth/client';
import styled from 'styled-components';

const HeaderContainer = styled(Container)`
  margin-top:10px;
`;

const LogoLink = styled.a`
  font-family: Samarkan;

`;


export default function MyHeader () {
  const [session] = useSession();
    const onClick = (e) => {
      e.preventDefault();
      signIn();
    };

    const getSignIn = () => {
      if (session?.user?.name) {
        const trigger = (
          <div> 
            <Image src={session.user.image}avatar />
            <span>{session.user.name}</span>
          </div>
        );
        const options = [
          { key: 'sign-out', text: 'Sign Out', icon: 'sign out' },
        ]
        return (<Dropdown
          trigger={trigger}
          options={options}
          onChange={signOut}
          pointing='top left'
          icon={null}
        />);
      }
      return (<a href="/api/auth/signin"
           onClick={onClick}>Sign In</a>
        );
    };
    return (
      <HeaderContainer>
        <Grid relaxed columns='equal'>
            <Grid.Column width={3}>
            </Grid.Column>
            <Grid.Column textAlign='center'>
                <Header as='h1'><LogoLink href='/'>DHRTA</LogoLink></Header>
            </Grid.Column>
            <Grid.Column width={3}>
              {getSignIn()}
            </Grid.Column>    
        </Grid>
          <Divider/>
      </HeaderContainer>
    )
  }