import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { identifier } = await request.json();

        if (!identifier) {
            return NextResponse.json({ message: "Identifier required" }, { status: 400 });
        }

        // Try finding by mobile, email, or membershipId
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
            return NextResponse.json(
                { message: "Member not found. Please register first." },
                { status: 404 }
            );
        }

        if (member.status !== "APPROVED" && member.status !== "ACTIVE") {
            return NextResponse.json(
                { message: `Your membership status is ${member.status}. You cannot login yet.` },
                { status: 403 }
            );
        }

        // MOCK OTP GENERATION
        // In production, we would generate a random 6 digit code, save it to DB (or Redis) with expiration,
        // and send via SMS/Email.

        console.log(`[MOCK OTP] Generated for ${identifier}: 123456`);

        return NextResponse.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
