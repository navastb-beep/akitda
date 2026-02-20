"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="border-b border-white/10 bg-slate-950/75 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo Removed as per user request */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        About
                    </Link>
                    <Link href="#committee" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Committee
                    </Link>
                    <Link href="/gallery" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Gallery
                    </Link>
                    <Link href="#benefits" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Benefits
                    </Link>
                    <Link href="#contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Contact
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 hidden sm:inline-flex">Member Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 hidden sm:inline-flex">Join Now</Button>
                    </Link>
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-t border-white/10 absolute top-16 left-0 right-0 p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
                    <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors p-2" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors p-2" onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    <Link href="#committee" className="text-sm font-medium text-slate-300 hover:text-white transition-colors p-2" onClick={() => setIsOpen(false)}>
                        Committee
                    </Link>
                    <Link href="/gallery" className="text-sm font-medium text-slate-300 hover:text-white transition-colors p-2" onClick={() => setIsOpen(false)}>
                        Gallery
                    </Link>
                    <Link href="#benefits" className="text-sm font-medium text-slate-300 hover:text-white transition-colors p-2" onClick={() => setIsOpen(false)}>
                        Benefits
                    </Link>
                    <Link href="#contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors p-2" onClick={() => setIsOpen(false)}>
                        Contact
                    </Link>
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 w-full justify-start">Member Login</Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 w-full">Join Now</Button>
                        </Link>
                    </div>
                </div>
            )}

        </nav>
    );
}
