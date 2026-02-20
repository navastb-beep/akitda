import { Navbar } from "@/components/Navbar";
import { MemberLoginForm } from "@/components/MemberLoginForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="mb-8 flex flex-col items-center">
                    <div className="relative h-24 w-48 mb-4">
                        <Image
                            src="/akitda-logo.png"
                            alt="AKITDA Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Member Portal</h1>
                    <p className="text-slate-400 mt-2">Access your digital membership certificate</p>
                </div>
                <MemberLoginForm />
            </div>
        </div>
    );
}
