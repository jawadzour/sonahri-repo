import { Card } from "@/components/ui/card";
import { Heart, Users, MapPin, Home, GraduationCap, Droplet, Zap } from "lucide-react";
import Seo from "@/components/Seo";

export default function Impact() {
  const metrics = [
    { icon: MapPin, label: "Districts of Operation", value: "19", color: "from-green-500 to-emerald-600" },
    { icon: Users, label: "Community Organizations Formed", value: "225", color: "from-blue-500 to-cyan-600" },
    { icon: Heart, label: "Beneficiaries Reached", value: "500,000+", color: "from-red-500 to-pink-600" },
    { icon: Users, label: "Community Volunteers Engaged", value: "500", color: "from-purple-500 to-indigo-600" },
    { icon: GraduationCap, label: "Teachers Trained", value: "40", color: "from-yellow-500 to-orange-600" },
    { icon: Home, label: "Flood-Affected Populations Supported", value: "343,899+", color: "from-cyan-500 to-blue-600" },
    { icon: Home, label: "Government Schools Supported", value: "15", color: "from-amber-500 to-orange-600" },
    { icon: Zap, label: "Awareness Sessions Conducted", value: "203", color: "from-indigo-500 to-purple-600" },
  ];

  const sectorMetrics = [
    {
      title: "Education",
      description: "Empowering out-of-school children and strengthening government schools",
      achievements: [
        "300+ girls reached with education programs",
        "100 working children engaged in learning",
        "40 government school teachers trained",
        "15 government schools supported"
      ]
    },
    {
      title: "Health & Nutrition",
      description: "Improving maternal, child, and family health outcomes",
      achievements: [
        "Community-based health interventions across 18 Union Councils",
        "Family planning services delivered",
        "Maternal and child health awareness campaigns",
        "Health worker capacity building"
      ]
    },
    {
      title: "WASH",
      description: "Ensuring access to clean water and sanitation",
      achievements: [
        "Hand pumps and safe water points installed",
        "Latrines and community washroom facilities constructed",
        "Hygiene promotion campaigns conducted",
        "Health and Hygiene Committees formed"
      ]
    },
    {
      title: "Livelihoods & Food Security",
      description: "Building economic resilience and household food security",
      achievements: [
        "Livestock support and training programs",
        "Agriculture rehabilitation post-disaster",
        "Vocational skills training for women and youth",
        "Community savings groups strengthened"
      ]
    },
    {
      title: "Women Empowerment & GBV",
      description: "Advancing gender equality and ending violence",
      achievements: [
        "Women's community organizations formed",
        "Legal awareness and rights training provided",
        "GBV prevention and support services",
        "Women's participation in governance increased"
      ]
    },
    {
      title: "Disaster Risk Reduction",
      description: "Building community resilience to climate shocks",
      achievements: [
        "343,899+ flood-affected people supported",
        "Community-based disaster preparedness training",
        "Emergency relief distribution",
        "Infrastructure rehabilitation post-disaster"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Seo path="/impact" />
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Impact</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Over a decade of measurable change in rural Sindh
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Key Metrics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={idx}
                  className="group p-6 bg-white border-2 border-[#2d8659] rounded-2xl
  shadow-md hover:border-orange-500 hover:bg-green-50
  hover:shadow-2xl hover:-translate-y-2
  transition-all duration-300"
                >
                  <div
                    className={`bg-gradient-to-br ${metric.color} p-4 rounded-xl w-fit mb-4
  group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-2 group-hover:text-[#2d8659] transition-colors duration-300">{metric.label}</p>
                  <p className="text-4xl font-bold text-gray-900 group-hover:text-[#2d8659] transition-colors duration-300">{metric.value}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sector-wise Impact */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Sector-wise Impact</h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Comprehensive achievements across all thematic areas
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sectorMetrics.map((sector, idx) => (
              <Card key={idx} className="group p-6 bg-white border-2 border-gray-200 hover:border-[#2d8659] transition-colors">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#2d8659] transition-colors duration-300">{sector.title}</h3>
                <p className="text-gray-600 mb-4 group-hover:text-[#2d8659] transition-colors duration-300">{sector.description}</p>

                <ul className="space-y-2">
                  {sector.achievements.map((achievement, aidx) => (
                    <li key={aidx} className="flex items-start gap-3 text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-[#2d8659] flex-shrink-0 mt-2"></span>
                      <span className="group-hover:text-[#2d8659] transition-colors duration-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Story */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#e8f5e9] to-[#e3f2fd]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Why These Numbers Matter</h2>

          <div className="space-y-6 text-gray-800 text-lg leading-relaxed">
            <p>
              Over more than a decade of work in rural Sindh, SHDS has built a track record of delivering real, measurable change in some of the province's most underserved communities. The numbers above represent not just statistics, but lives transformed, futures opened, and communities strengthened.
            </p>

            <p>
              Every district we work in, every community organization we help form, every child we reach with education, every family we support through disaster, and every woman we empower reflects our commitment to the belief that marginalization is not inevitable — it can be changed through knowledge, resources, and organized community action.
            </p>

            <p>
              These achievements are not SHDS's alone. They are the result of partnerships with government, civil society, donors, and most importantly, the communities of rural Sindh who have shown remarkable resilience, hope, and commitment to building better futures for themselves and their children.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
