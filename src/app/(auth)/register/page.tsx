import Link from "next/link";
import { Bot, Mail, Building, User, Lock } from "lucide-react";
import { signIn } from "@/auth";
import { registerUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Create Workspace | NEXUS AI",
};

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
    return (
        <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-3xl"></div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 z-10 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">

                    {/* Left Text Detail */}
                    <div className="hidden md:flex flex-col text-left max-w-lg">
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer mb-8 w-fit">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md group-hover:bg-blue-700 transition-colors">
                                <Bot className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                NEXUS
                            </span>
                        </Link>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Start building autonomous AI agents for your business
                        </h1>
                        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                            Create your secure workspace. Bring Your Own Key (BYOK) for LLMs like Gemini and Groq, and connect to WhatsApp and Telegram instantly. No credit card required.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                "Dual-Layer Memory System (Postgres + Redis)",
                                "Drag & Drop React Flow Workflow Builder",
                                "Cloudinary Auto-optimized Media Pipeline",
                                "Enterprise-grade Security (AES-256)"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center text-slate-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Register Card */}
                    <div className="w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center md:text-left mb-6">
                                Create new workspace
                            </h2>

                            <div className="space-y-3 mb-6">
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
                                        Register with Google
                                    </button>
                                </form>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500 rounded-full font-medium">Or register with email</span>
                                </div>
                            </div>

                            <form action={async (formData) => {
                                "use server";
                                const res = await registerUser(formData);
                                if (res?.error) {
                                    // Normally we'd use a client component or useActionState,
                                    // but we can pass error via URL param for simplicity in RSC
                                    redirect(`/register?error=${encodeURIComponent(res.error)}`);
                                }

                                // On success, redirect to login with a success message
                                redirect(`/login?registered=true`);
                            }} className="mt-6 space-y-4">
                                {searchParams?.error && (
                                    <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 py-2 border border-red-200 text-center rounded-lg">
                                        {searchParams.error}
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full name</label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input id="name" name="name" type="text" required className="pl-10 block w-full py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="John Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Work email</label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input id="email" name="email" type="email" required className="pl-10 block w-full py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input id="password" name="password" type="password" required className="pl-10 block w-full py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors mt-2">
                                        Create Account
                                    </button>
                                </div>
                            </form>

                            <p className="mt-6 text-xs text-center text-slate-500">
                                By registering, you agree to our <a href="#" className="underline hover:text-slate-800">Terms of Service</a> and <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>.
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600">
                                Already have an account?{" "}
                                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
