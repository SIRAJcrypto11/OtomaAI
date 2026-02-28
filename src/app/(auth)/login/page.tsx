import Link from "next/link";
import { Bot, Mail, Lock, ShieldCheck } from "lucide-react";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Login | NEXUS AI",
};

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {

    const loginAction = async (formData: FormData) => {
        "use server";
        try {
            await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/dashboard",
            });
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case 'CredentialsSignin':
                        redirect('/login?error=InvalidCredentials');
                    default:
                        redirect('/login?error=SomethingWentWrong');
                }
            }
            throw error;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Aesthetic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-3xl"></div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 z-10">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center mb-6">
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md group-hover:bg-blue-700 transition-colors">
                                <Bot className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                NEXUS
                            </span>
                        </Link>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Sign in to your AI Agent Workspace
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                        {/* Social Logins */}
                        <div className="space-y-3">
                            <form
                                action={async () => {
                                    "use server";
                                    await signIn("google", { redirectTo: "/dashboard" });
                                }}
                            >
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </form>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500 rounded-full font-medium">Or log in with email</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            {searchParams?.error === "InvalidCredentials" && (
                                <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 py-2 border border-red-200 text-center rounded-lg">
                                    Email atau Password salah.
                                </div>
                            )}

                            <form action={loginAction} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors bg-white"
                                            placeholder="admin@nexus.ai"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                            Password
                                        </label>
                                        <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors bg-white"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-6">
                            <div className="text-xs text-slate-500 space-y-2">
                                <p className="font-semibold text-slate-700 mb-1">Predefined Demo Accounts:</p>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                                    <span>Admin: <code className="text-blue-600">admin@nexus.ai</code></span>
                                    <span className="font-mono bg-slate-200 px-1 rounded">admin</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                                    <span>Owner: <code className="text-blue-600">owner@nexus.ai</code></span>
                                    <span className="font-mono bg-slate-200 px-1 rounded">owner</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                                    <span>User: <code className="text-blue-600">user@nexus.ai</code></span>
                                    <span className="font-mono bg-slate-200 px-1 rounded">user</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Dihubungkan langsung dengan Vercel Postgres
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{" "}
                            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Create new workspace
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
