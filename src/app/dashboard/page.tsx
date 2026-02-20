
"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, CreditCard, RefreshCw, CheckCircle, Clock, AlertCircle, Building2, MapPin, Phone, Mail, User, ShieldCheck } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MembershipCertificate } from "@/components/Certificate";
import { ReceiptDocument } from "@/components/Receipt";
import { TaxInvoice } from "@/components/TaxInvoice";
import { useRouter } from "next/navigation";
import { getFinancialYear } from "@/lib/financial-year";

type Member = {
    id: string;
    memberType: "NEW" | "EXISTING";
    companyName: string;
    membershipId: string | null;
    status: string;
    primaryEmail: string;
    addressBuilding: string;
    addressArea: string;
    district: string;
    unit: string | null;
    pincode: string;
    primaryMobile: string;
    gstNumber: string | null;
    partners: { name: string; photoFile: string | null; phone: string | null }[];
    payments: any[];
};

export default function MemberDashboard() {
    const router = useRouter();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [transactionId, setTransactionId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Address Update States
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({
        addressBuilding: "",
        addressArea: "",
        district: "",
        unit: "",
        pincode: "",
    });
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [updatingAddress, setUpdatingAddress] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchMember();
    }, []);

    async function fetchMember() {
        try {
            const res = await fetch("/api/members/me");
            if (res.status === 401) {
                router.push("/login");
                return;
            }
            const data = await res.json();
            setMember(data.member);
            // Initialize address form
            if (data.member) {
                setAddressForm({
                    addressBuilding: data.member.addressBuilding || "",
                    addressArea: data.member.addressArea || "",
                    district: data.member.district || "",
                    unit: data.member.unit || "",
                    pincode: data.member.pincode || "",
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function submitPayment(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId }),
            });

            if (res.ok) {
                alert("Payment details submitted! Waiting for admin approval.");
                fetchMember();
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to submit payment.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleSendOtp() {
        if (!member) return;
        setUpdatingAddress(true);
        try {
            const res = await fetch("/api/auth/otp/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: member.primaryMobile }),
            });
            if (res.ok) {
                setOtpSent(true);
                alert(`OTP sent to ${member.primaryMobile} (Mock: 123456)`);
            } else {
                alert("Failed to send OTP");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUpdatingAddress(false);
        }
    }

    async function handleUpdateAddress() {
        if (!otp) {
            alert("Please enter OTP");
            return;
        }
        setUpdatingAddress(true);
        try {
            const res = await fetch("/api/members/me/update-address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    otp,
                    ...addressForm
                }),
            });

            if (res.ok) {
                alert("Address updated successfully!");
                setShowAddressModal(false);
                setOtpSent(false);
                setOtp("");
                fetchMember();
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to update address");
        } finally {
            setUpdatingAddress(false);
        }
    }

    function formatDate(dateString: string | Date) {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-slate-500 font-medium">Loading Dashboard...</p>
            </div>
        </div>
    );

    if (!member) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white pt-10 pb-20 px-4 shadow-lg">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium mb-3">
                                <Building2 className="h-3 w-3" />
                                {member.unit ? `${member.unit} Unit Member` : "Member"}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{member.companyName}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
                                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" /> {member.district}</span>
                                <span className="hidden md:inline text-slate-600">|</span>
                                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> {member.primaryMobile}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2">
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 ${member.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                member.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                }`}>
                                {member.status === 'ACTIVE' && <CheckCircle className="h-4 w-4" />}
                                {member.status === 'PAYMENT_PENDING' && <Clock className="h-4 w-4" />}
                                {member.status === 'APPROVED' && <AlertCircle className="h-4 w-4" />}
                                {member.status}
                            </div>
                            {member.membershipId && (
                                <div className="text-right">
                                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Membership ID</p>
                                    <p className="text-xl font-mono font-bold text-white tracking-wide">{member.membershipId}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Profile & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Company Profile Card */}
                        <Card className="border-t-4 border-t-blue-600 shadow-md overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="text-xl text-slate-800">Company Profile</CardTitle>
                                    <CardDescription>Registered business details and contact info</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setShowAddressModal(true)} className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
                                    <RefreshCw className="h-3.5 w-3.5" /> Update
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Registered Address</Label>
                                            <div className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <p>{member.addressBuilding}</p>
                                                <p>{member.addressArea}</p>
                                                <p>{member.district}, Kerala - {member.pincode}</p>
                                            </div>
                                        </div>
                                        {member.gstNumber && (
                                            <div>
                                                <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">GST Number</Label>
                                                <p className="font-mono text-slate-700 font-medium">{member.gstNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Contact Information</Label>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded transition-colors">
                                                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                        <Phone className="h-4 w-4" />
                                                    </div>
                                                    <p className="font-medium text-slate-700">{member.primaryMobile}</p>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded transition-colors">
                                                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                        <Mail className="h-4 w-4" />
                                                    </div>
                                                    <p className="font-medium text-slate-700 break-all">{member.primaryEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PARTNERS SECTION */}
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 block">Key Personnel</Label>
                                    <div className="flex flex-wrap gap-6">
                                        {member.partners && member.partners.length > 0 ? (
                                            member.partners.map((partner, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[200px]">
                                                    <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                                        {partner.photoFile ? (
                                                            <img src={partner.photoFile} alt={partner.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                                <User className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-sm">{partner.name}</p>
                                                        {partner.phone && <p className="text-xs text-slate-500">{partner.phone}</p>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">No partner details available.</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PAYMENT ACTION CARD (for APPROVED status) */}
                        {member.status === "APPROVED" && (
                            <Card className="border-blue-200 bg-blue-50/50 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-blue-800 flex items-center gap-2 text-xl">
                                        <AlertCircle className="h-6 w-6" />
                                        Action Required: Complete Payment
                                    </CardTitle>
                                    <CardDescription className="text-blue-700/80">
                                        Your membership request has been approved. Please pay the required fees to activate your account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                                        <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            {/* FEE BREAKDOWN */}
                                            <div className="md:col-span-3 p-6 space-y-4">
                                                <h3 className="font-semibold text-slate-800 mb-2">Membership Fee Structure</h3>
                                                <div className="space-y-3 text-sm">
                                                    {member.memberType === "NEW" && (
                                                        <div className="flex justify-between items-center text-slate-600">
                                                            <span>Admission Fee (One-time)</span>
                                                            <span className="font-mono">₹ 2,000.00</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center text-slate-600">
                                                        <span>Annual Membership Fee</span>
                                                        <span className="font-mono">₹ 1,200.00</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-slate-500">
                                                        <span>GST (18% on Fees)</span>
                                                        <span className="font-mono">₹ {member.memberType === "NEW" ? "576.00" : "216.00"}</span>
                                                    </div>
                                                    <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center font-bold text-lg text-slate-900">
                                                        <span>Total Payable</span>
                                                        <span className="font-mono text-blue-700">₹ {member.memberType === "NEW" ? "3,776.00" : "1,416.00"}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">Pay via UPI</p>
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                        <div>
                                                            <p className="font-mono font-bold text-lg text-slate-800">8547026604@okbizaxis</p>
                                                            <p className="text-xs text-slate-500">AKITDA Official Account</p>
                                                        </div>
                                                        <a
                                                            href={`upi://pay?pa=8547026604@okbizaxis&pn=AKITDA&am=${member.memberType === "NEW" ? "3776.00" : "1416.00"}&cu=INR`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                                        >
                                                            Pay Now
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SUBMIT PROOF */}
                                            <div className="md:col-span-2 p-6 bg-slate-50/50">
                                                <h3 className="font-semibold text-slate-800 mb-2">Verify Payment</h3>
                                                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                                    After payment, enter the Transaction ID (UTR / Reference No) below to process your receipt.
                                                </p>
                                                <form onSubmit={submitPayment} className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="tid" className="text-xs font-medium text-slate-500">Transaction ID / UTR</Label>
                                                        <Input
                                                            id="tid"
                                                            placeholder="e.g. 403819XXXXXX"
                                                            value={transactionId}
                                                            onChange={(e) => setTransactionId(e.target.value)}
                                                            required
                                                            className="font-mono text-sm bg-white"
                                                        />
                                                    </div>
                                                    <Button type="submit" disabled={submitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                                                        {submitting ? "Verifying..." : "Submit for Verification"}
                                                    </Button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* PENDING VERIFICATION STATE */}
                        {member.status === "PAYMENT_PENDING" && (
                            <Card className="border-yellow-200 bg-yellow-50/50 shadow-md">
                                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                                    <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4 animate-pulse">
                                        <Clock className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-yellow-900 mb-2">Verification in Progress</h3>
                                    <p className="text-yellow-700 max-w-md">
                                        We have received your payment details. Our admin team will verify the transaction and activate your membership shortly.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Documents & Status */}
                    <div className="space-y-6">

                        {/* Status Card */}
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Account Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className={`h-3 w-3 rounded-full ${member.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]' : 'bg-yellow-500'}`}></div>
                                    <span className="font-bold text-lg text-slate-800">{member.status.replace('_', ' ')}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2 leading-snug">
                                    {member.status === 'ACTIVE'
                                        ? "Your membership is active and valid for the current financial year."
                                        : "Your account is currently under review or pending action."
                                    }
                                </p>
                            </CardContent>
                            {member.status === 'ACTIVE' && (
                                <CardFooter className="bg-slate-50 border-t border-slate-100 py-3">
                                    <p className="text-xs text-slate-500 w-full text-center">Valid Until: <span className="font-semibold text-slate-700">31st March, {getFinancialYear().endYear}</span></p>
                                </CardFooter>
                            )}
                        </Card>

                        {/* Documents Section (Only for ACTIVE members) */}
                        {member.status === "ACTIVE" && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest pl-1">Legal Documents</h3>

                                <Card className="overflow-hidden hover:border-blue-300 transition-colors group cursor-pointer">
                                    <div className="p-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800">Membership Certificate</h4>
                                            <p className="text-xs text-slate-500">Official proof of affiliation</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                                        {isMounted && (
                                            <PDFDownloadLink
                                                document={
                                                    <MembershipCertificate
                                                        memberName={member.companyName}
                                                        membershipId={member.membershipId || ""}
                                                        financialYear={getFinancialYear().label}
                                                    />
                                                }
                                                fileName={`AKITDA_Certificate_${member.membershipId}.pdf`}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 w-full"
                                            >
                                                {({ loading }) => (
                                                    <>{loading ? "Generating..." : <><Download className="h-3.5 w-3.5" /> Download PDF</>}</>
                                                )}
                                            </PDFDownloadLink>
                                        )}
                                    </div>
                                </Card>

                                <Card className="overflow-hidden hover:border-green-300 transition-colors group cursor-pointer">
                                    <div className="p-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800">Tax Invoice</h4>
                                            <p className="text-xs text-slate-500">GST Invoice for fees paid</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 group-hover:bg-green-50/50 transition-colors">
                                        {member.payments && member.payments.length > 0 && member.payments[0].receiptNumber ? (
                                            isMounted && (
                                                <PDFDownloadLink
                                                    document={<TaxInvoice
                                                        invoiceNo={member.payments[0].receiptNumber}
                                                        date={formatDate(member.payments[0].createdAt)}
                                                        customerName={member.companyName}
                                                        customerGst={member.gstNumber || ""}
                                                        customerAddress={`${member.addressBuilding}, ${member.addressArea}, ${member.district}`}
                                                        customerPhone={member.primaryMobile}
                                                        items={member.memberType === "NEW" ? [
                                                            { name: "Admission Fee", hsn: "9995", qty: 1, rate: 2000, taxable: false },
                                                            { name: "Membership Fee", hsn: "9995", qty: 1, rate: 1200, taxable: true }
                                                        ] : [
                                                            { name: "Membership Fee", hsn: "9995", qty: 1, rate: 1200, taxable: true }
                                                        ]}
                                                    />}
                                                    fileName={`AKITDA_Invoice_${member.payments[0].receiptNumber.replace(/\//g, '_')}.pdf`}
                                                    className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center justify-center gap-2 w-full"
                                                >
                                                    {({ loading }) => (
                                                        <>{loading ? "Generating..." : <><Download className="h-3.5 w-3.5" /> Download PDF</>}</>
                                                    )}
                                                </PDFDownloadLink>
                                            )
                                        ) : (
                                            <p className="text-xs text-center text-slate-400">Not available yet</p>
                                        )}
                                    </div>
                                </Card>

                                <Card className="overflow-hidden hover:border-teal-300 transition-colors group cursor-pointer">
                                    <div className="p-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800">Payment Receipt</h4>
                                            <p className="text-xs text-slate-500">Proof of payment transaction</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 group-hover:bg-teal-50/50 transition-colors">
                                        {member.payments && member.payments.length > 0 && member.payments[0].receiptNumber ? (
                                            isMounted && (
                                                <PDFDownloadLink
                                                    document={<ReceiptDocument
                                                        receiptNumber={member.payments[0].receiptNumber}
                                                        date={formatDate(member.payments[0].createdAt)}
                                                        companyName={member.companyName}
                                                        amount={member.memberType === "NEW" ? 3776 : 1416}
                                                    />}
                                                    fileName={`AKITDA_Receipt_${member.payments[0].receiptNumber.replace(/\//g, '_')}.pdf`}
                                                    className="text-sm font-medium text-teal-600 hover:text-teal-800 flex items-center justify-center gap-2 w-full"
                                                >
                                                    {({ loading }) => (
                                                        <>{loading ? "Generating..." : <><Download className="h-3.5 w-3.5" /> Download PDF</>}</>
                                                    )}
                                                </PDFDownloadLink>
                                            )
                                        ) : (
                                            <p className="text-xs text-center text-slate-400">Not available yet</p>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ADDRESS UPDATE MODAL */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-lg bg-white shadow-2xl">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Update Address</CardTitle>
                            <CardDescription>Verify with OTP sent to {member.primaryMobile}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {!otpSent ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Building Name/No</Label>
                                        <Input
                                            value={addressForm.addressBuilding}
                                            onChange={(e) => setAddressForm({ ...addressForm, addressBuilding: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Area / Street</Label>
                                            <Input
                                                value={addressForm.addressArea}
                                                onChange={(e) => setAddressForm({ ...addressForm, addressArea: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Pincode</Label>
                                            <Input
                                                value={addressForm.pincode}
                                                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>District</Label>
                                            <Input
                                                value={addressForm.district}
                                                onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Unit</Label>
                                            <Input
                                                value={addressForm.unit}
                                                onChange={(e) => setAddressForm({ ...addressForm, unit: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleSendOtp} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={updatingAddress}>
                                        {updatingAddress ? "Sending OTP..." : "Get OTP to Update"}
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        OTP sent to {member.primaryMobile}. (Use 123456)
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Enter OTP</Label>
                                        <Input
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            className="text-center text-lg tracking-widest"
                                        />
                                    </div>
                                    <Button onClick={handleUpdateAddress} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={updatingAddress}>
                                        {updatingAddress ? "Updating..." : "Verify & Save Address"}
                                    </Button>
                                </div>
                            )}
                            <Button variant="ghost" onClick={() => setShowAddressModal(false)} className="w-full mt-2 text-slate-500">
                                Cancel
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
