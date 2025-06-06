import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"
import { APP_NAME } from "@/lib/constants";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Authentication',
}

const SignUpPage = async (props: {
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
                    Create Account
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your information to sign up for an account.
                    <br/>
                   
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <SignUpForm/>
            </CardContent>
        </Card>
    </div> );
}
 
export default SignUpPage;