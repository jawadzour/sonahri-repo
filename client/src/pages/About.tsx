import { Card } from "@/components/ui/card";
import { Eye, Target, Heart, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";

export default function About() {
  const coreValues = [
    { title: "Equity", description: "We prioritize those who are furthest behind, with special attention to women, children, and disaster-affected communities." },
    { title: "Transparency", description: "Our work is governed by accountability to the communities we serve, our partners, and our donors." },
    { title: "Participation", description: "Communities are not passive recipients; they are co-designers and drivers of change." },
    { title: "Integrity", description: "We operate with honesty, consistency, and professionalism in everything we do." },
    { title: "Respect", description: "We recognize the dignity, knowledge, and agency of every individual we work with." },
    { title: "Social Justice", description: "We advocate for structural change and the protection of human rights at every level." },
  ];

  const districts = [
    "Thatta", "Sujawal", "Badin", "Hyderabad", "Matiari", "Jamshoro",
    "Khairpur", "Nawabshah", "Sanghar", "Shikarpur", "Kashmore-Kandhkot",
    "Qambar Shahdadkot", "Jacobabad", "Larkana", "Dadu", "Naushahro Feroz",
    "Tharparkar", "Mirpurkhas", "Ghotki"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Seo path="/about" />
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About SHDS</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Building resilient communities through inclusive development since 2010
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Who We Are</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Sonahri Humanitarian Development Society (SHDS) is a non-governmental, not-for-profit organization rooted in the communities of rural Sindh. Founded in 2010 by a group of committed social activists who believed that lasting change begins at the grassroots, SHDS was formally registered in 2011 under the Societies Registration Act XXI of 1860 (NTN# 4175036).
              </p>

              <p>
                What started as a small, locally-driven initiative has grown into a credible development organization with a professional team, structured governance, and a track record of delivering real, measurable change across multiple sectors. Today, SHDS operates across 19 districts of Sindh, reaching hundreds of thousands of people through programs in education, health, livelihoods, water and sanitation, women empowerment, disaster response, and community development.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                src="/images/about/about-team.jpg"
                alt="SHDS team in the field"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision */}
            <Card className="p-8 border-2 border-[#2d8659] bg-[#e8f5e9]">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-[#2d8659]" />
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-800 leading-relaxed">
                A just, equitable, and resilient Sindh where every individual — regardless of gender, geography, or socioeconomic status — has access to quality education, healthcare, livelihood opportunities, and the full exercise of their fundamental rights.
              </p>
            </Card>

            {/* Mission */}
            <Card className="p-8 border-2 border-[#1e5a96] bg-[#e3f2fd]">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-[#1e5a96]" />
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-800 leading-relaxed">
                SHDS mobilizes communities, builds institutions, and delivers inclusive development programs to uplift the marginalized people of Sindh. We work in partnership with communities, government, and civil society to address poverty, strengthen resilience, promote human rights, and create sustainable pathways out of vulnerability.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-gray-900 text-center">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => (
              <Card
                key={idx}
                className="group p-6 bg-white border-2 border-[#2d8659] rounded-xl shadow-md
  hover:border-orange-500 hover:bg-green-50 hover:shadow-xl
  hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Heart className="w-6 h-6 text-[#2d8659] group-hover:text-orange-500 flex-shrink-0 mt-1 transition-colors duration-300" />
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-700">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Coverage */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Geographic Coverage</h2>
          <p className="text-gray-700 text-lg mb-12 max-w-2xl">
            SHDS operates across the province of Sindh with a primary focus on rural, remote, and chronically underserved communities. Our presence spans 19 districts, covering some of the most disaster-prone, poverty-affected, and marginalized regions of the province.
          </p>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Head Office & Field Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-[#2d8659]">
                <h4 className="font-bold text-lg text-gray-900 mb-2">Head Office</h4>
                <p className="text-gray-700">Makli, District Thatta</p>
              </Card>
              <Card className="p-6 border-2 border-[#1e5a96]">
                <h4 className="font-bold text-lg text-gray-900 mb-2">Field Office</h4>
                <p className="text-gray-700">Mirpur Bathoro, District Sujawal</p>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Districts of Operation</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {districts.map((district, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-[#2d8659] rounded-lg p-3 text-center
  hover:border-orange-500 hover:bg-green-50 hover:shadow-md
  hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <p className="font-semibold text-gray-900">{district}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Drives Us */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-start gap-4 mb-6">
            <CheckCircle2 className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-3">What Drives Us</h3>
              <p className="text-lg text-blue-100">
                SHDS exists because marginalization is not inevitable — it is the result of systems that can be changed. We are driven by the conviction that poor and excluded communities, when equipped with knowledge, resources, and a platform, are fully capable of shaping their own futures. This belief has guided every decision we make and every program we implement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
