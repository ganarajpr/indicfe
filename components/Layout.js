import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import HamburgerButton from "./HamburgerButton";
import UserButton from "./UserButton";

export default function Layout(props) {
    return (
        <div className="">
            <div className="grid grid-flow-col p-4 w-full border shadow-md row-span-1">
                <HamburgerButton className="col-span-1 ml-3 justify-self-start self-center" />
                <div className="grid grid-flow-col justify-center col-auto">
                    <Link href="/">
                        <img
                            src="/smrthi-text.png"
                            className="w-20 self-center cursor-pointer"
                        />
                    </Link>
                </div>
                <Link href="/api/auth/signin">
                    <UserButton className="col-span-1 mr-3 self-center justify-self-end" />
                </Link>
          </div>
          <div className="mt-4 h-full w-full grid ">
            {props.children}
          </div>
        </div>
    );
}
