import * as React from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { signIn, signOut, useSession } from 'next-auth/client';
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'

const SignInMenu = () => {
  const [session] = useSession();
  const popupState = usePopupState({ variant: 'popover', popupId: 'signInMenu' })
  const onSignOut = () => {
    signOut();
    popupState.close();
  };
  if(session?.user?.name) {
    return (
        <div>
          <Button {...bindTrigger(popupState)}>
            Username
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={onSignOut}>SignOut</MenuItem>
          </Menu>
        </div>
      )
  }
  return (<Button onClick={signIn}>
    Sign In
  </Button>);
}

export default SignInMenu