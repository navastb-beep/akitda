import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
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

        const member = await prisma.member.findUnique({
            where: { id: memberId },
            include: {
                payments: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                },
                partners: true
            }
        });

        if (!member) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        return NextResponse.json({ member });

    } catch (error) {
        return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 }
        );
    }
}
