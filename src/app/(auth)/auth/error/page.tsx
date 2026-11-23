import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Authentication Error | NEXUS AI",
};

const ERROR_MESSAGES: Record<string, string> = {
    AccessDenied: "You do not have permission to sign in with that account.",
    Configuration: "Authentication is misconfigured. Check the server logs and auth environment variables.",
    CredentialsSignin: "Invalid email or password.",
    SessionExpired: "Your session has expired. Please sign in again.",
    OAuthAccountNotLinked: "That email is already registered with a different sign-in method.",
};

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
    const code = (await searchParams)?.code || "";
    const message = ERROR_MESSAGES[code] || "Something went wrong while signing you in. Please try again.";

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white border border-slate-100 shadow-xl rounded-2xl p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Sign-in problem</h1>
                <p className="mt-2 text-sm text-slate-600">{message}</p>
                {code && (
                    <p className="mt-2 text-xs font-mono text-slate-400">Error code: {code}</p>
                )}
                <Link
                    href="/login"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </Link>
            </div>
        </div>
    );
}
