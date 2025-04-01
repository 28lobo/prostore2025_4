import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"
import { APP_NAME } from "@/lib/constants";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Authentication',
}

const SignInPage = async (props: {
    searchParams: Promise<{
        callbackUrl: string;
    }>
}) => {
    const { callbackUrl } = await props.searchParams
    const session = await auth()
    if (session) {
        redirect(callbackUrl || '/')
    }
    return ( <div className="w-full max-w-md mx-auto p-4">
        <Card>
            <CardHeader className="space-y-4">
                <Link href='/' className="flex justify-center items-center">
                    <Image src="/images/logo.svg" width={100} height={100} alt={`${APP_NAME} logo`} priority={true}/> 
                </Link>
                <CardTitle className="text-center">
                    Sign In
                </CardTitle>
                <CardDescription className="text-center">
                    Welcome back! Please sign in to your account.
                    <br/>
                   
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <CredentialsSignInForm />
            </CardContent>
        </Card>
    </div> );
}
 
export default SignInPage;