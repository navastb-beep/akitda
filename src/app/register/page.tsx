import { Navbar } from "@/components/Navbar";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans">
            <Navbar />

            {/* Header */}
            <div className="py-12 md:py-20 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        AKITDA Membership Registration
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Join the premier association for IT dealers in Kerala. Please fill out the form below to apply for membership.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-10">
                <div className="max-w-4xl mx-auto">
                    <RegistrationForm />
                </div>
            </div>
        </div>
    );
}
