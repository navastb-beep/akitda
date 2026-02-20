import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("[Verifying OTP] Request Body:", body);

        const { identifier, otp } = body;

        // MOCK VERIFICATION
        if (otp !== "123456") {
            console.log("[Verifying OTP] Invalid OTP provided:", otp);
            return NextResponse.json(
                { message: "Invalid OTP. Use 123456" },
                { status: 401 }
            );
        }

        const member = await prisma.member.findFirst({
            where: {
                OR: [
                    { primaryMobile: identifier },
                    { primaryEmail: identifier },
                    { membershipId: identifier },
                ],
            },
        });

        if (!member) {
            console.log("[Verifying OTP] Member not found for:", identifier);
            return NextResponse.json(
                { message: "Member not found" },
                { status: 404 }
            );
        }

        console.log("[Verifying OTP] Member found:", member.companyName, member.status);

        if (member.status !== "APPROVED" && member.status !== "ACTIVE" && member.status !== "PAYMENT_PENDING") {
            return NextResponse.json(
                { message: "Membership not approved yet. Please wait for admin approval." },
                { status: 403 }
            );
        }

        // Generate Member Token
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || "default_secret_dev_only"
        );
        const token = await new SignJWT({ id: member.id, role: "MEMBER" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(secret);

        // Set Cookie
        (await cookies()).set("member_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        console.log("[Verifying OTP] Login successful");

        return NextResponse.json({ message: "Login successful" });

    } catch (error) {
        console.error("[Verifying OTP] Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
