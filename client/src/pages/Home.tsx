import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  MapPin,
  Heart,
  Zap,
  Sprout,
  TreePine,
  Leaf,
} from "lucide-react";
import Seo from "@/components/Seo";

export default function Home() {
  const impactStats = [
    {
      icon: Heart,
      label: "Beneficiaries Reached",
      value: "500,000+",
      color: "from-red-500 to-pink-500",
      border: "hover:border-red-500",
    },
    {
      icon: MapPin,
      label: "Districts of Operation",
      value: "19",
      color: "from-green-600 to-emerald-500",
      border: "hover:border-green-600",
    },
    {
      icon: Users,
      label: "Community Organizations",
      value: "225",
      color: "from-blue-600 to-cyan-500",
      border: "hover:border-blue-600",
    },
    {
      icon: Zap,
      label: "Volunteers Engaged",
      value: "500",
      color: "from-yellow-500 to-orange-500",
      border: "hover:border-yellow-500",
    },
  ];

  const programs = [
    { title: "Education", description: "Empowering children through quality education and learning opportunities", color: "bg-blue-50 border-blue-200" },
    { title: "Health & Nutrition", description: "Maternal, child health, and family planning services", color: "bg-red-50 border-red-200" },
    { title: "WASH", description: "Water, sanitation, and hygiene for underserved communities", color: "bg-cyan-50 border-cyan-200" },
    { title: "Livelihoods", description: "Economic empowerment and food security initiatives", color: "bg-amber-50 border-amber-200" },
    { title: "Women Empowerment", description: "Gender equality and violence prevention programs", color: "bg-purple-50 border-purple-200" },
    { title: "Disaster Response", description: "Emergency relief and disaster risk reduction", color: "bg-orange-50 border-orange-200" },
  ];

  const plantationPhotos = [
  // Purani images
  "/images/plantation/plantation-01.jpg",
  "/images/plantation/plantation-02.jpg",
  "/images/plantation/plantation-03.jpg",
  "/images/plantation/plantation-04.jpg",
  "/images/plantation/plantation-05.jpg",
  "/images/plantation/plantation-06.jpg",
  // Nayi images
  "/images/plantation/plantation-new-01.jpg",
  "/images/plantation/plantation-new-02.jpg",
  "/images/plantation/plantation-new-03.jpg",
  "/images/plantation/plantation-new-04.jpg",
  "/images/plantation/plantation-new-05.jpg",
  "/images/plantation/plantation-new-06.jpg",
  "/images/plantation/plantation-new-08.jpg",
  "/images/plantation/plantation-new-09.jpg",
  "/images/plantation/plantation-new-10.jpg",
];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Seo path="/" />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Sunrise field gradient scene */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        ></div>
        <motion.div
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute left-[8%] top-[18%] w-[420px] h-[420px] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(254,243,199,0.9) 0%, rgba(252,211,77,0.4) 55%, rgba(252,211,77,0) 75%)",
          }}
        ></motion.div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2d8659]/25 to-transparent"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-[#1b5e3f] font-bold tracking-wide uppercase text-sm mb-4 bg-white/70 inline-block px-3 py-1 rounded-full shadow-sm">
                Building a Better Tomorrow
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 drop-shadow-sm">
                Empowering Communities,{" "}
                <span className="text-[#1b5e3f]">Transforming</span> Lives
              </h1>
              <p className="text-lg text-gray-900 bg-white/70 backdrop-blur-sm p-4 rounded-xl mb-8 max-w-xl leading-8">
                Since 2010, SHDS has been mobilizing communities, building institutions,
                and delivering inclusive development programs in education, health, clean
                water, women empowerment, disaster relief, and community development
                across 19 districts of Sindh.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-[#2d8659] hover:bg-[#1b5e3f] px-8 py-6 text-lg font-semibold w-full sm:w-auto">
                  <Link href="/programs">
                    Our Programs <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#2d8659] text-[#1b5e3f] bg-white/70 hover:bg-white px-8 py-6 text-lg font-semibold w-full sm:w-auto"
                >
                  <Link href="/impact">See Our Impact</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: circular photo collage */}
            <div className="relative h-[420px] md:h-[480px] hidden sm:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-64 md:h-64 rounded-full border-[6px] border-white shadow-2xl bg-white flex items-center justify-center z-20"
              >
                <img
                  src="/images/logo.png"
                  alt="SHDS logo"
                  className="w-[85%] h-[85%] object-contain rounded-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="animate-float-slow absolute left-0 top-0 w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-white shadow-xl overflow-hidden z-10"
              >
                <img src="/images/hero-circles/circle-education.jpg" alt="Education program" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="animate-float-slow-delayed absolute right-0 top-4 w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-white shadow-xl overflow-hidden z-10"
              >
                <img src="/images/hero-circles/circle-wash.jpg" alt="Clean water program" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="animate-float-slow-delayed absolute left-4 bottom-0 w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-white shadow-xl overflow-hidden z-10"
              >
                <img src="/images/hero-circles/circle-health.jpg" alt="Health program" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="animate-float-slow absolute right-2 bottom-2 w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-white shadow-xl overflow-hidden z-10"
              >
                <img src="/images/hero-circles/circle-women.jpg" alt="Women empowerment program" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>

          {/* Quick program strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16"
          >
            {[
              { label: "Education", icon: Users, color: "text-[#2d8659]" },
              { label: "Health", icon: Heart, color: "text-red-500" },
              { label: "WASH", icon: Zap, color: "text-blue-500" },
              { label: "Women Empowerment", icon: Users, color: "text-purple-600" },
              { label: "Disaster Relief", icon: MapPin, color: "text-orange-600" },
              { label: "Environment", icon: TreePine, color: "text-emerald-600" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white border-2 rounded-xl shadow-md p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${idx === 0
                      ? "border-green-600 hover:border-green-600"
                      : idx === 1
                        ? "border-green-600 hover:border-red-500"
                        : idx === 2
                          ? "border-green-600 hover:border-blue-500"
                          : idx === 3
                            ? "border-green-600 hover:border-purple-500"
                            : idx === 4
                              ? "border-green-600 hover:border-orange-500"
                              : "border-green-600 hover:border-emerald-500"
                    }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 w-full leading-[0] z-10">
          <svg viewBox="0 0 1440 100" className="w-full h-[70px] md:h-[100px]" preserveAspectRatio="none">
            <path
              d="M0,40 C240,100 480,0 720,30 C960,60 1200,100 1440,40 L1440,100 L0,100 Z"
              fill="#f0faf4"
            />
          </svg>
        </div>
      </section>

      {/* Environment & Tree Plantation — active project spotlight */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#f0faf4] to-emerald-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              <Sprout className="w-4 h-4" /> Active Project
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Environment & Tree Plantation
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              SHDS is running an active tree plantation and environmental awareness
              drive across rural communities in Sindh — greening villages, restoring
              local ecosystems, and building climate resilience for the future.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {plantationPhotos.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-xl overflow-hidden shadow-lg group relative aspect-square border-4 border-white ring-2 ring-[#2d8659]/40"
              >
                <img
                  src={src}
                  alt={`SHDS tree plantation and environmental awareness drive in rural Sindh, photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <div className="inline-flex items-center gap-2 text-emerald-700 font-medium">
              <Leaf className="w-5 h-5" />
              <span>Join us in building a greener, more resilient Sindh</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card
                    className={`p-6 text-center border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${stat.border} h-full`}
                  >
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg w-fit mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Our Programs
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            SHDS delivers comprehensive development programs across seven thematic areas to address the multifaceted challenges facing rural Sindh.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, idx) => (
              <Card
                key={idx}
                className="p-6 border-2 border-[#2d8659] bg-white hover:border-[#1e5a96] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-700 mb-4">{program.description}</p>
                <Button asChild variant="ghost" className="text-[#2d8659] hover:text-[#1b5e3f] p-0 h-auto">
                  <Link href="/programs">
                    Learn More <span className="sr-only">about {program.title}</span>{" "}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-[#2d8659] hover:bg-[#1b5e3f] px-8 py-6 text-lg">
              <Link href="/programs">Explore All Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you have a question, partnership opportunity, or want to support our mission, we'd love to hear from you.
          </p>
          <Button asChild className="bg-white text-[#2d8659] hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
            <Link href="/contact">
              Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}