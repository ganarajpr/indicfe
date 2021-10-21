import { signIn, useSession } from 'next-auth/client'
import Link from 'next/link';

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
            }}>{ props.linkText } </Link>
        </p>
    )
}