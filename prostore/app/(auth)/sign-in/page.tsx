import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Authentication',
}

const SignInPage = () => {
    return ( <div className="w-full max-w-md mx-auto p-4">
        <Card>
            <CardHeader className="space-y-4">
                <Link href='/' className="">
                    <Image src="/images/logo.svg" width={100} height={100} alt={`${APP_NAME} logo`} priority={true}/>
                </Link>
                <CardTitle className="text-center">
                    Sign In
                </CardTitle>
                <CardDescription className="text-center">
                    Welcome back! Please sign in to your account.
                    <br/>
                    Don&#39;t have an account? <Link href="/auth/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* form here */}
            </CardContent>
        </Card>
    </div> );
}
 
export default SignInPage;