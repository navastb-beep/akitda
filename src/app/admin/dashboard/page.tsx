"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Check, X, Pencil, Trash2, Plus, Upload } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Types ---

type Member = {
    id: string;
    companyName: string;
    companyType: string;
    primaryMobile: string;
    primaryEmail: string;
    status: string;
    gstNumber: string;
    gstFile: string;
    photoFile: string;
    joinedAt: string;
    addressBuilding: string;
    addressArea: string;
    district: string | null;
    unit?: string | null;
    approvalPresident?: boolean;
    approvalSecretary?: boolean;
    approvalTreasurer?: boolean;
    partners?: { name: string; phone?: string; email?: string }[];
    pincode?: string;
};

type OfficeBearer = {
    id: string;
    name: string;
    position: string;
    level: string;
    district?: string;
    phone?: string;
    photoUrl?: string;
    order: number;
};

type GalleryItem = {
    id: string;
    title: string | null;
    type: "PHOTO" | "VIDEO";
    url: string;
    description: string | null;
    createdAt: string;
};

export default function AdminDashboard() {
    const router = useRouter();
    const [members, setMembers] = useState<Member[]>([]);
    const [officeBearers, setOfficeBearers] = useState<OfficeBearer[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentAdmin, setCurrentAdmin] = useState<{ id: string, email: string, role: string } | null>(null);

    // Dialog States for Office Bearers
    const [isOBDialogOpen, setIsOBDialogOpen] = useState(false);
    const [editingBearer, setEditingBearer] = useState<OfficeBearer | null>(null);

    useEffect(() => {
        fetchAdminAndData();
    }, []);

    async function fetchAdminAndData() {
        try {
            // Fetch Current Admin
            const adminRes = await fetch("/api/admin/me");
            if (adminRes.status === 401) {
                router.push("/admin/login");
                return;
            }
            const adminData = await adminRes.json();
            setCurrentAdmin(adminData);

            // Fetch Members
            fetchMembers();

            // Fetch Office Bearers
            fetchOfficeBearers();
            fetchGalleryItems();
        } catch (e) {
            console.error("Error fetching data:", e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchMembers() {
        try {
            const res = await fetch("/api/admin/members");
            if (res.ok) {
                const data = await res.json();
                setMembers(data.members || []);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchOfficeBearers() {
        try {
            const res = await fetch("/api/admin/office-bearers");
            if (res.ok) {
                const data = await res.json();
                setOfficeBearers(data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchGalleryItems() {
        try {
            const res = await fetch("/api/admin/gallery");
            if (res.ok) {
                const data = await res.json();
                setGalleryItems(data.items);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // --- Member Actions ---

    async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
        try {
            const res = await fetch(`/api/admin/members/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                fetchMembers();
            } else {
                alert((await res.json()).message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function updateApproval(id: string, field: string, value: boolean) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
        try {
            const res = await fetch(`/api/admin/members/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: value }),
            });
            if (!res.ok) {
                alert((await res.json()).message);
                fetchMembers();
            }
        } catch (e) {
            console.error(e);
            fetchMembers();
        }
    }

    const downloadExcel = () => {
        const data = members.map(member => {
            const firstPartnerName = member.partners && member.partners.length > 0 ? member.partners[0].name : "N/A";

            return {
                "Membership ID": member.membershipId || "N/A",
                "Company Name": member.companyName,
                "Company Type": member.companyType,
                "Building Name": member.addressBuilding,
                "Local Area": member.addressArea,
                "District": member.district,
                "Unit": member.unit || "N/A",
                "Pincode": member.pincode,
                "Partners / Proprietors": firstPartnerName,
                "Phone": member.primaryMobile,
                "Email": member.primaryEmail,
                "GST Number": member.gstNumber,
                "Status": member.status,
                "Joined At": new Date(member.joinedAt).toLocaleDateString(),
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
        XLSX.writeFile(workbook, "akitda_members.xlsx");
    };

    // --- Gallery Actions ---

    async function handleAddGalleryItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const res = await fetch("/api/admin/gallery", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                fetchGalleryItems();
                alert("Gallery item added!");
            } else {
                alert((await res.json()).message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleDeleteGalleryItem(id: string) {
        if (!confirm("Delete this gallery item?")) return;
        try {
            const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
            if (res.ok) fetchGalleryItems();
            else alert("Failed to delete");
        } catch (e) {
            console.error(e);
        }
    }

    // --- Office Bearer Actions ---

    async function handleBearerSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // If editing, use PUT to [id], else POST to root
        const url = editingBearer
            ? `/api/admin/office-bearers/${editingBearer.id}`
            : "/api/admin/office-bearers";

        const method = editingBearer ? "PUT" : "POST";

        // Append 'edit' ID if needed, though usually in URL for PUT
        // Clean up formData if file is empty string (though browser handles this usually)

        try {
            const res = await fetch(url, {
                method,
                body: formData,
            });

            if (res.ok) {
                fetchOfficeBearers();
                setIsOBDialogOpen(false);
                setEditingBearer(null);
            } else {
                alert("Failed to save office bearer.");
            }
        } catch (e) {
            console.error("Error saving office bearer:", e);
        }
    }

    async function deleteBearer(id: string) {
        if (!confirm("Are you sure you want to delete this office bearer?")) return;
        try {
            const res = await fetch(`/api/admin/office-bearers/${id}`, { method: "DELETE" });
            if (res.ok) fetchOfficeBearers();
            else alert("Failed to delete.");
        } catch (e) {
            console.error(e);
        }
    }

    const canApprove = (role: string | undefined, type: "PRESIDENT" | "SECRETARY" | "TREASURER") => {
        if (!role) return false;
        if (role === "SUPER_ADMIN") return true;
        return role === type;
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            {/* Professional Admin Header */}
            <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">A</div>
                        <h1 className="text-xl font-bold tracking-tight">AKITDA Admin</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {currentAdmin && (
                            <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-slate-300">
                                    {currentAdmin.role.replace(/_/g, " ")}
                                </span>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-300 hover:text-white hover:bg-slate-800"
                            onClick={async () => {
                                await fetch("/api/admin/logout", { method: "POST" });
                                router.push("/admin/login");
                            }}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-500 mt-1">Manage members, office bearers, and gallery content.</p>
                </div>

                <Tabs defaultValue="members" className="space-y-8">
                    <div className="bg-white p-1 rounded-xl shadow-sm border inline-flex">
                        <TabsList className="h-auto p-0 bg-transparent flex gap-1">
                            <TabsTrigger
                                value="members"
                                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none font-medium text-slate-600"
                            >
                                Members
                            </TabsTrigger>
                            <TabsTrigger
                                value="office-bearers"
                                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none font-medium text-slate-600"
                            >
                                Office Bearers
                            </TabsTrigger>
                            <TabsTrigger
                                value="gallery"
                                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none font-medium text-slate-600"
                            >
                                Gallery
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* --- MEMBERS TAB --- */}
                    <TabsContent value="members" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700">
                                Export to Excel
                            </Button>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Member Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Contact / Address</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Files</TableHead>
                                            <TableHead>Committee (P/S/T)</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-medium">{member.companyName}</TableCell>
                                                <TableCell>{member.companyType}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{member.primaryMobile}</div>
                                                    <div className="text-sm text-slate-500">{member.primaryEmail}</div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {member.addressBuilding}, {member.addressArea}<br />
                                                        {member.district}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={member.status === "PENDING" ? "outline" : member.status === "APPROVED" ? "default" : "destructive"}>
                                                        {member.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 mb-2">
                                                        {member.gstFile && (
                                                            <a href={member.gstFile} target="_blank" rel="noopener noreferrer">
                                                                <Button size="sm" variant="ghost" className="h-6 px-2">GST</Button>
                                                            </a>
                                                        )}
                                                        {member.photoFile && (
                                                            <a href={member.photoFile} target="_blank" rel="noopener noreferrer">
                                                                <Button size="sm" variant="ghost" className="h-6 px-2">Photo</Button>
                                                            </a>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-4 items-center">
                                                        <label className="flex items-center gap-1 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={member.approvalPresident || false}
                                                                onChange={(e) => updateApproval(member.id, "approvalPresident", e.target.checked)}
                                                                disabled={!canApprove(currentAdmin?.role, "PRESIDENT")}
                                                                className="w-4 h-4"
                                                            /> P
                                                        </label>
                                                        <label className="flex items-center gap-1 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={member.approvalSecretary || false}
                                                                onChange={(e) => updateApproval(member.id, "approvalSecretary", e.target.checked)}
                                                                disabled={!canApprove(currentAdmin?.role, "SECRETARY")}
                                                                className="w-4 h-4"
                                                            /> S
                                                        </label>
                                                        <label className="flex items-center gap-1 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={member.approvalTreasurer || false}
                                                                onChange={(e) => updateApproval(member.id, "approvalTreasurer", e.target.checked)}
                                                                disabled={!canApprove(currentAdmin?.role, "TREASURER")}
                                                                className="w-4 h-4"
                                                            /> T
                                                        </label>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-2">
                                                        {/* Verify Payment Logic */}
                                                        {member.status === "PAYMENT_PENDING" && (
                                                            <div className="flex flex-col gap-1">
                                                                <div className="text-xs text-blue-600 font-mono bg-blue-50 p-1 rounded">
                                                                    Pending Verification
                                                                </div>
                                                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full" onClick={async () => {
                                                                    if (!confirm("Confirm payment received?")) return;
                                                                    const res = await fetch(`/api/admin/members/${member.id}/verify-payment`, { method: "PUT" });
                                                                    if (res.ok) fetchMembers();
                                                                    else alert((await res.json()).message);
                                                                }}>Verify Payment</Button>
                                                            </div>
                                                        )}

                                                        {(member.status === "PENDING" || member.status === "APPROVED") && member.status !== "PAYMENT_PENDING" && member.status !== "ACTIVE" && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    // Simplified Logic for Demo: Just need 1 vote to be 'approved' in UI for now, logic handled in backend mostly
                                                                    const role = currentAdmin?.role;
                                                                    let myRoleField = "";
                                                                    if (role === "PRESIDENT") myRoleField = "approvalPresident";
                                                                    else if (role === "SECRETARY") myRoleField = "approvalSecretary";
                                                                    else if (role === "TREASURER") myRoleField = "approvalTreasurer";

                                                                    if (myRoleField && !member[myRoleField as keyof Member]) {
                                                                        updateApproval(member.id, myRoleField, true);
                                                                    } else {
                                                                        // If already voted, or super admin, try to finalize
                                                                        fetch(`/api/admin/members/${member.id}/status`, {
                                                                            method: "PUT",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ status: "APPROVED" }),
                                                                        }).then(res => { if (res.ok) fetchMembers(); else alert("Need more approvals"); });
                                                                    }
                                                                }}
                                                                className="bg-blue-600 hover:bg-blue-700 w-full"
                                                            >
                                                                Vote / Approve
                                                            </Button>
                                                        )}

                                                        {member.status !== "REJECTED" && (
                                                            <Button size="sm" variant="destructive" onClick={() => updateStatus(member.id, "REJECTED")} className="w-full">Reject</Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- OFFICE BEARERS TAB --- */}
                    <TabsContent value="office-bearers" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Committee Management</h2>
                            <Dialog open={isOBDialogOpen} onOpenChange={setIsOBDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => setEditingBearer(null)}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Office Bearer
                                    </Button>
                                </DialogTrigger>
                                <DialogContent key={editingBearer ? editingBearer.id : "new"}>
                                    <DialogHeader>
                                        <DialogTitle>{editingBearer ? "Edit Office Bearer" : "Add New Office Bearer"}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleBearerSubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" name="name" defaultValue={editingBearer?.name} required placeholder="Full Name" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="position">Position / Designation</Label>
                                            <Input id="position" name="position" defaultValue={editingBearer?.position} required placeholder="e.g. President, Secretary" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="level">Level</Label>
                                                <Select name="level" defaultValue={editingBearer?.level || "DISTRICT"}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="DISTRICT">District</SelectItem>
                                                        <SelectItem value="STATE">State</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="district">District (if applicable)</Label>
                                                <Select name="district" defaultValue={editingBearer?.district || "Ernakulam"}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select District" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Ernakulam">Ernakulam</SelectItem>
                                                        <SelectItem value="Trivandrum">Trivandrum</SelectItem>
                                                        <SelectItem value="Kozhikode">Kozhikode</SelectItem>
                                                        {/* Add more as needed */}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone (Optional)</Label>
                                            <Input id="phone" name="phone" defaultValue={editingBearer?.phone} placeholder="+91..." />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="order">Sort Order (1 = Top)</Label>
                                            <Input id="order" name="order" type="number" defaultValue={editingBearer?.order || 0} required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="photoFile">Photo</Label>
                                            <Input id="photoFile" name="photoFile" type="file" accept="image/*" />
                                            {editingBearer?.photoUrl && <p className="text-xs text-muted-foreground">Current: {editingBearer.photoUrl.split('/').pop()}</p>}
                                        </div>
                                        <Button type="submit" className="w-full">
                                            {editingBearer ? "Update Details" : "Create Office Bearer"}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {officeBearers.map((bearer) => (
                                <Card key={bearer.id} className="overflow-hidden">
                                    <div className="aspect-square w-full bg-slate-100 relative">
                                        {bearer.photoUrl ? (
                                            <img src={bearer.photoUrl} alt={bearer.name} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                <Upload className="h-12 w-12 opacity-50" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg">{bearer.name}</h3>
                                                <p className="text-blue-600 font-medium">{bearer.position}</p>
                                            </div>
                                            <Badge variant="secondary">{bearer.level === "DISTRICT" ? bearer.district : "STATE"}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4">Order: {bearer.order}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                                                setEditingBearer(bearer);
                                                setIsOBDialogOpen(true);
                                            }}>
                                                <Pencil className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" className="flex-1" onClick={() => deleteBearer(bearer.id)}>
                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {officeBearers.length === 0 && (
                                <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed rounded-xl">
                                    No office bearers found. Click "Add Office Bearer" to start.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* --- GALLERY TAB --- */}
                    <TabsContent value="gallery" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Gallery Management</h2>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Gallery Item</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddGalleryItem} className="space-y-4">
                                        <div>
                                            <Label>Title</Label>
                                            <Input name="title" required placeholder="Event Title" />
                                        </div>
                                        <div>
                                            <Label>Type</Label>
                                            <Select name="type" defaultValue="PHOTO">
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PHOTO">Photo</SelectItem>
                                                    <SelectItem value="VIDEO">Video</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <Input name="description" placeholder="Optional description" />
                                        </div>
                                        <div>
                                            <Label>Photo File (if Photo)</Label>
                                            <Input name="photoFile" type="file" accept="image/*" />
                                        </div>
                                        <div>
                                            <Label>Video URL (for YouTube)</Label>
                                            <Input name="videoUrl" placeholder="https://youtube.com/..." />
                                        </div>
                                        <Button type="submit" className="w-full">Save Item</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {galleryItems.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                    <div className="aspect-video bg-slate-100 relative group">
                                        {item.type === "PHOTO" ? (
                                            <img src={item.url} alt={item.title || "Gallery"} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-slate-900 text-white">
                                                Video: {item.title}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleDeleteGalleryItem(item.id)}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <CardContent className="p-4">
                                        <h4 className="font-bold truncate">{item.title}</h4>
                                        <p className="text-xs text-slate-500">{item.type}</p>
                                    </CardContent>
                                </Card>
                            ))}
                            {galleryItems.length === 0 && (
                                <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed rounded-xl">
                                    No gallery items found.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
