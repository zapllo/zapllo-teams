
"use client"

import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useContext, useState } from "react";
// import { DataContext } from "@/store/GlobalState";
import { useRouter } from "next/navigation";
// import { postData } from "@/utils/fetchData";
// import Cookie from 'js-cookie';
// import { toast, Toaster } from 'sonner'

export function LoginForm() {
    const initialState = { email: "", password: "" };
    const [userData, setUserData] = useState(initialState);
    const [error, setError] = useState(false);
    const { email, password } = userData;
    // const { state = {}, dispatch } = useContext(DataContext);
    // const { auth = {} } = state;
    const router = useRouter();

    const handleChangeInput = (e: any) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        router.push('/adminprivatesecured/dashboard');
        // const res = await postData('auth/login', userData)

        // if (res.error) {
        //     window.location.reload();
        //     return;
        // }

        // dispatch({
        //     type: 'AUTH', payload: {
        //         token: res.access_token,
        //         user: res.user
        //     }
        // })

        // Cookie.set('refreshtoken', res.refresh_token, {
        //     path: '/api/auth/accessToken',
        //     expires: 7
        // })

        // localStorage.setItem('firstLogin', 'true')
        // check if user has admin privileges
        // if (res.user && res.user.role === 'user') {
        //     router.push("/dashboard"); // Redirect to home page or any other page
        //     // toast(" Welcome");
        // }
    }
    return (
        <div className="flex flex-col items-center bg-[#04071F] justify-center h-screen ">

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email"
                            name="email"
                            value={email}
                            onChange={handleChangeInput} />

                        {/* <Input id="whatsappNumber" placeholder="+91 1234567890" required type="tel" /> */}
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password"
                            name="password"
                            value={password}
                            onChange={handleChangeInput}
                        />

                        {/* <Input id="password" required type="password" /> */}
                    </div>
                    <Button className="w-full" type="submit">
                        Login
                    </Button>
                    <div className="text-center">
                        <Link className="text-primary-500 hover:underline" href="/Register">
                            Don&apos;t have an account? Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
