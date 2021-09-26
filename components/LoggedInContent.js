import { signIn, useSession } from 'next-auth/client'

export default function LoggedInContent (props) {
    const [session] = useSession();
    if(session) {
        return props.children;
    }
    return (
        <p>
            <a href="/api/auth/signin"
            onClick={(e) => {
            e.preventDefault()
            signIn()
            }}>{ props.linkText } </a>
        </p>
    )
}