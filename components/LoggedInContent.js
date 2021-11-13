import { signIn, useSession } from 'next-auth/client'
import Link from 'next/link';
import Button from '@mui/material/Button';

export default function LoggedInContent (props) {
    const [session] = useSession();
    if(session) {
        return props.children;
    }
    return (
        <p>
            <Link href="/api/auth/signin"
                onClick={(e) => {
                e.preventDefault()
                signIn()
                }}>
                <Button color='secondary'>{ props.linkText }</Button>
            </Link>
        </p>
    )
}