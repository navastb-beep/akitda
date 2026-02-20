import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Users, HandHeart, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const officeBearers = await prisma.officeBearer.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden pt-4 pb-16 lg:pt-8 lg:pb-32 bg-slate-900">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">

          <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-8 mb-8">
            <div className="relative h-32 w-32 md:h-48 md:w-48 mb-2 md:mb-0 flex-shrink-0">
              <Image
                src="/akitda-logo.png"
                alt="AKITDA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md text-center md:text-left md:whitespace-nowrap w-auto">
              All Kerala IT Dealers Association
            </h2>
          </div>

          <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium text-sm md:text-base animate-fade-in-up">
            Official Ernakulam District Committee
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Empowering IT<br />
            <span className="text-blue-500">Dealers & Professionals</span>
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mb-12 text-slate-300 leading-relaxed">
            All Kerala IT Dealers Association (AKITDA) is the premier body representing the IT hardware and solutions industry in Kerala. We stand for unity, ethics, and progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 rounded-full transition-all hover:scale-105">
                Join AKITDA
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-500/20 rounded-full transition-all hover:scale-105">
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-orange-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-orange-300 rounded-2xl transform -rotate-2 opacity-50"></div>
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="AKITDA Meetings"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-orange-100 font-semibold tracking-wide uppercase mb-3">About Us</h2>
              <h3 className="text-4xl font-bold text-white mb-6">A Legacy of Trust & Innovation</h3>
              <p className="text-orange-50 mb-6 text-lg leading-relaxed">
                Since our inception in 2004, AKITDA has been the backbone of Kerala&apos;s IT ecosystem. What started as a small collective has grown into a powerful voice for IT dealers, addressing challenges and seizing opportunities in a rapidly evolving digital landscape.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white text-orange-600 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-white font-medium">Over 2000+ Active Members statewide.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white text-orange-600 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-white font-medium">Dedicated Complaint Cell for dispute resolution.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white text-orange-600 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-white font-medium">Regular expos, workshops, and training programs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section id="committee" className="py-24 bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-blue-400 font-semibold tracking-wide uppercase mb-3">Leadership</h2>
            <h3 className="text-4xl font-bold text-white">District Committee</h3>
          </div>

          {/* Row 1: 1-5 */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {officeBearers.slice(0, 5).map((bearer) => (
              <div key={bearer.id} className="p-1 text-center group w-44">
                <div className="h-40 w-40 mx-auto bg-blue-800/50 rounded-full mb-4 overflow-hidden relative border-4 border-blue-400/20 group-hover:border-blue-400 transition-colors">
                  {bearer.photoUrl ? (
                    <img src={bearer.photoUrl} alt={bearer.name} className="object-cover object-top w-full h-full" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                      <Users className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors leading-tight">{bearer.name}</h4>
                <p className="text-blue-200 text-sm font-medium mb-2">{bearer.position}</p>
                {bearer.level === "DISTRICT" && bearer.district && (
                  <span className="inline-block px-2 py-0.5 text-[10px] bg-blue-800/50 rounded-full text-blue-200 border border-blue-700">{bearer.district}</span>
                )}
              </div>
            ))}
          </div>

          {/* Row 2: 6-9 */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {officeBearers.slice(5, 9).map((bearer) => (
              <div key={bearer.id} className="p-1 text-center group w-44">
                <div className="h-40 w-40 mx-auto bg-blue-800/50 rounded-full mb-4 overflow-hidden relative border-4 border-blue-400/20 group-hover:border-blue-400 transition-colors">
                  {bearer.photoUrl ? (
                    <img src={bearer.photoUrl} alt={bearer.name} className="object-cover object-top w-full h-full" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                      <Users className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors leading-tight">{bearer.name}</h4>
                <p className="text-blue-200 text-sm font-medium mb-2">{bearer.position}</p>
                {bearer.level === "DISTRICT" && bearer.district && (
                  <span className="inline-block px-2 py-0.5 text-[10px] bg-blue-800/50 rounded-full text-blue-200 border border-blue-700">{bearer.district}</span>
                )}
              </div>
            ))}
          </div>

          {/* Row 3: 10-15 */}
          <div className="flex flex-wrap justify-center gap-2">
            {officeBearers.slice(9, 15).map((bearer) => (
              <div key={bearer.id} className="p-1 text-center group w-44">
                <div className="h-40 w-40 mx-auto bg-blue-800/50 rounded-full mb-4 overflow-hidden relative border-4 border-blue-400/20 group-hover:border-blue-400 transition-colors">
                  {bearer.photoUrl ? (
                    <img src={bearer.photoUrl} alt={bearer.name} className="object-cover object-top w-full h-full" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                      <Users className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors leading-tight">{bearer.name}</h4>
                <p className="text-blue-200 text-sm font-medium mb-2">{bearer.position}</p>
                {bearer.level === "DISTRICT" && bearer.district && (
                  <span className="inline-block px-2 py-0.5 text-[10px] bg-blue-800/50 rounded-full text-blue-200 border border-blue-700">{bearer.district}</span>
                )}
              </div>
            ))}
          </div>

          {/* Check for empty state if needed, though with specific slices it's less critical unless total count is 0 */}
          {officeBearers.length === 0 && (
            <div className="text-center text-blue-300 italic mt-8">
              Committee members to be announced.
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="link" className="text-blue-400">View Full Committee Directory &rarr;</Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-green-700 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-green-200 font-semibold tracking-wide uppercase mb-3">Membership</h2>
            <h3 className="text-4xl font-bold text-white">Why Join AKITDA?</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 bg-white text-green-700 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">Networking</h4>
                <p className="text-green-50 text-sm">Connect with industry peers, share business leads, and collaborate for growth.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 bg-white text-green-700 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">Protection</h4>
                <p className="text-green-50 text-sm">Legal support and representation for business disputes and regulatory issues.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 bg-white text-green-700 rounded-lg flex items-center justify-center mb-6">
                  <HandHeart className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">Welfare</h4>
                <p className="text-green-50 text-sm">Schemes like &quot;Snehasparsham&quot; providing financial aid to members in need.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="h-12 w-12 bg-white text-green-700 rounded-lg flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">Events</h4>
                <p className="text-green-50 text-sm">Exclusive access to IT expos, tech summits, and family get-togethers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-10">
            Join the largest network of IT dealers in Kerala. Be part of a community that cares.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg font-bold rounded-full">
              Register Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Map/Contact Section */}
      <section id="contact" className="h-[400px] w-full bg-slate-200 relative">
        {/* Placeholder for Map - Google Maps Embed would go here */}
        <iframe
          src="https://maps.google.com/maps?q=All+Kerala+IT+Dealers+Association,Ernakulam&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="AKITDA Ernakulam Office Location"
        ></iframe>
      </section>

      <Footer />
    </div>
  );
}
