import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("member_token");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || "default_secret_dev_only"
        );

        const { payload } = await jwtVerify(token.value, secret);
        const memberId = payload.id as string;

        const body = await request.json();
        const { otp, addressBuilding, addressArea, district, unit, pincode } = body;

        // Mock OTP Verification
        if (otp !== "123456") {
            return NextResponse.json(
                { message: "Invalid OTP. Use 123456" },
                { status: 400 }
            );
        }

        // Update Member Address
        const updatedMember = await prisma.member.update({
            where: { id: memberId },
            data: {
                addressBuilding,
                addressArea,
                district,
                unit,
                pincode,
            },
        });

        return NextResponse.json({ message: "Address updated successfully", member: updatedMember });

    } catch (error) {
        console.error("Update Address Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
