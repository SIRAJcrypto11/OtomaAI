import React from "react";
import { User, Shield, KeyRound, Bell, CreditCard, LogOut, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { updateProfile } from "@/app/actions/settings";

export const metadata = {
    title: "Settings | NEXUS AI",
};

export default async function SettingsPage() {
    const session = await auth();
    const userRole = session?.user?.role || "Operator";
    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "user@nexusai.local";
    const userInitial = userName[0].toUpperCase();

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workspace Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account, billing, security, and global workspace preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Side Nav for Settings */}
                <div className="w-full md:w-64 space-y-1 shrink-0">
                    {[
                        { name: "Profile Details", icon: User, active: true },
                        { name: "Security & Keys", icon: Shield, active: false },
                        { name: "Platform Plans", icon: CreditCard, active: false },
                        { name: "Notifications", icon: Bell, active: false },
                        { name: "Danger Zone", icon: KeyRound, active: false, color: "text-rose-600" },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-200/50'
                                } ${item.color || ''}`}
                        >
                            <item.icon className="w-5 h-5 opacity-70" />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Main Settings Content */}
                <div className="flex-1 space-y-8">

                    {/* Profile Section */}
                    <form action={async (formData) => {
                        "use server";
                        await updateProfile(formData);
                    }} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900">Profile Details</h2>
                            <p className="text-sm text-slate-500 mt-1">Update your personal information and email address.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                                    {userInitial}
                                </div>
                                <div className="space-y-3">
                                    <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                        Change Avatar
                                    </button>
                                    <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input name="name" type="text" defaultValue={userName} required className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input type="email" defaultValue={userEmail} disabled className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-sm text-slate-500" />
                                    <p className="text-xs text-slate-500 mt-1 flex items-center"><CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1" /> Verified</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role in Workspace</label>
                                    <input type="text" defaultValue={userRole} disabled className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-sm text-slate-500" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </form>

                    {/* Default Models Preferences */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900">System Preferences</h2>
                            <p className="text-sm text-slate-500 mt-1">Configure default behaviors across your agents.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Default AI Provider Fallback</label>
                                <select className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option value="gemini">Google Gemini 1.5</option>
                                    <option value="groq">Groq Mixtral Fast</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">If your primary agent model fails or hits limits, the system will fallback to this provider to prevent downtime.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                                <select className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option>Asia/Jakarta (WIB)</option>
                                    <option>Asia/Makassar (WITA)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
