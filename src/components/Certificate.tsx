"use client";

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Define styles to match the certificate design
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
    },
    leftPanel: {
        width: "30%",
        height: "100%",
        backgroundColor: "#FFFFFF", // We will draw the blue shape with SVG
        position: "relative",
    },
    rightPanel: {
        width: "70%",
        height: "100%",
        padding: 40,
        flexDirection: "column",
    },
    header: {
        fontSize: 22,
        color: "#1e3a8a", // Navy Blue
        fontWeight: "bold", // Helvetica-Bold
        textAlign: "center",
        fontFamily: "Helvetica-Bold",
        marginBottom: 5,
        textTransform: "uppercase",
    },
    subHeader: {
        fontSize: 12,
        color: "#000000",
        textAlign: "center",
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        marginBottom: 30,
    },
    certificateTitle: {
        fontSize: 28,
        color: "#dc2626", // Red
        textAlign: "center",
        fontFamily: "Helvetica-Bold", // Serif look if possible, but standard is Helvetica
        letterSpacing: 2,
        marginBottom: 20,
    },
    certifyText: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "Helvetica",
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        marginBottom: 20,
        width: "100%",
    },
    msText: {
        fontSize: 14,
        marginRight: 10,
        fontFamily: "Helvetica",
    },
    memberName: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        borderBottomStyle: "dotted",
        paddingBottom: 2,
        flexGrow: 1,
        textAlign: "center",
    },
    bodyText: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 1.5,
        fontFamily: "Helvetica",
    },
    redText: {
        color: "#dc2626", // Red-600
        fontFamily: "Helvetica-Bold",
    },
    signatories: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 60,
        width: "100%",
        paddingHorizontal: 10,
    },
    signatory: {
        flexDirection: "column",
        alignItems: "center",
    },
    signName: {
        fontSize: 10,
        color: "#dc2626", // Red
        fontFamily: "Helvetica-Bold",
        marginBottom: 2,
    },
    signRole: {
        fontSize: 9,
        color: "#000000",
        fontFamily: "Helvetica-Oblique", // Italic
    },
    seal: {
        position: "absolute",
        bottom: 50,
        left: "40%", // Center ish relative to right panel
        width: 80,
        height: 80,
    },
    logoContainer: {
        position: "absolute",
        top: 150,
        left: 30,
        width: 120,
        height: 120,
        zIndex: 10,
    }
});

interface CertificateProps {
    memberName: string;
    membershipId: string;
    financialYear: string;
}

// Logo URL (using public absolute path for PDF renderer usually requires http or filesystem path, but explicit import or base64 is safer)
// Since we are in client component, we might need absolute URL.

export const MembershipCertificate = ({ memberName, membershipId, financialYear }: CertificateProps) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            {/* Left Panel with Blue Curve */}
            <View style={styles.leftPanel}>
                {/* Simplified Left Panel - Solid Color for Stability */}
                <View style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#3b82f6" }} />

                {/* Logo placed within the blue area */}
                <View style={styles.logoContainer}>
                    {/* Logo: Ensure /logo.png exists in public folder */}
                    <Image src="/logo.png" style={{ width: 120, height: 120, objectFit: "contain" }} />
                </View>
            </View>

            {/* Right Panel with Content */}
            <View style={styles.rightPanel}>
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <Text style={styles.header}>ALL KERALA IT DEALERS ASSOCIATION</Text>
                    <Text style={styles.subHeader}>ERNAKULAM DISTRICT COMMITTEE</Text>
                </View>

                <Text style={styles.certificateTitle}>CERTIFICATE</Text>

                <Text style={styles.certifyText}>This is to certify that</Text>

                <View style={styles.nameContainer}>
                    <Text style={styles.msText}>M/s.</Text>
                    <Text style={styles.memberName}>{memberName}</Text>
                </View>

                <Text style={styles.bodyText}>
                    is a member of the{"\n"}
                    <Text style={{ color: "#dc2626", fontFamily: "Helvetica-Bold" }}>All Kerala IT Dealers Association</Text>{"\n"}
                    and is hereby entitled to all rights and privileges{"\n"}
                    as envisaged in the Bylaws{"\n"}
                    of All Kerala IT Dealers Association
                </Text>

                <View style={styles.signatories}>
                    <View style={styles.signatory}>
                        <Text style={styles.signName}>Antony M.A.</Text>
                        <Text style={styles.signRole}>President</Text>
                    </View>
                    <View style={styles.signatory}>
                        <Text style={styles.signName}>Navas T. Backer</Text>
                        <Text style={styles.signRole}>Secretary</Text>
                    </View>
                    <View style={styles.signatory}>
                        <Text style={styles.signName}>Subhash T.S</Text>
                        <Text style={styles.signRole}>Treasurer</Text>
                    </View>
                </View>

                <View style={{ position: "absolute", bottom: 20, right: 40, alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 10, color: "#94a3b8" }}>Membership ID: {membershipId || "PENDING"}</Text>
                    <Text style={{ fontSize: 10, color: "#94a3b8" }}>Year: {financialYear}</Text>
                </View>
            </View >
        </Page >
    </Document >
);
