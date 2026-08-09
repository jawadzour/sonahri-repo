import { Card } from "@/components/ui/card";
import { BookOpen, Heart, Droplet, Briefcase, Users, AlertTriangle, Handshake } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Programs() {
  usePageTitle("Our Programs");
  
  const [programsData, setProgramsData] = useState([]);
  useEffect(() => {
  api
    .get("/programs/")
    .then((response) => {
      console.log(response.data);
      setProgramsData(response.data.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);

  const programs = [
    {
      icon: BookOpen,
      title: "Education",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      hoverBorder: "hover:border-blue-500",
      hoverTitle: "group-hover:text-blue-600",
      hoverBg: "hover:bg-blue-50",
      borderColor: "border-blue-200",
      description: "Millions of children in rural Sindh remain out of school — not because families do not value education, but because quality schooling does not reach them. SHDS addresses this gap by working across formal, non-formal, and accelerated learning models with a particular focus on girls, working children, and flood-affected communities.",
      activities: [
        "Non-formal primary education for out-of-school and working children",
        "Accelerated learning and multi-grade teaching in local languages",
        "Child-friendly teaching methodology training for government school teachers",
        "Rehabilitation and functionalization of flood-affected schools",
        "Strengthening of School Management Committees (SMCs)",
        "Early childhood education and functional literacy for women and families"
      ]
    },
    {
      icon: Heart,
      title: "Health & Nutrition (MNCH & Family Planning)",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      hoverBorder: "hover:border-red-500",
      hoverTitle: "group-hover:text-red-600",
      hoverBg: "hover:bg-red-50",
      description: "Poor maternal and child health outcomes in rural Sindh are driven by a combination of limited access to services, low awareness, and weak health systems at the community level. SHDS works to close these gaps through community-based health interventions, capacity building of health care providers, and behavior change communication.",
      activities: [
        "Antenatal and postnatal care awareness and referral",
        "Nutrition support and management of malnourished children under five",
        "Family planning counseling and community outreach (Sakhi Ghar model)",
        "Engagement of male community members and youth on reproductive health",
        "Capacity building of lady health workers and community health volunteers",
        "MoU-based partnership with the Population Welfare Department of Sindh"
      ]
    },
    {
      icon: Droplet,
      title: "WASH (Water, Sanitation & Hygiene)",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      hoverBorder: "hover:border-cyan-500",
      hoverTitle: "group-hover:text-cyan-600",
      hoverBg: "hover:bg-cyan-50",
      description: "Access to clean water and basic sanitation remains out of reach for a large proportion of rural Sindh's population. Inadequate WASH conditions drive preventable disease, disproportionately harm women and children, and perpetuate poverty. SHDS delivers practical WASH solutions alongside sustained community education to create lasting behavior change.",
      activities: [
        "Installation of hand pumps and safe water points in underserved villages",
        "Construction of latrines and community washroom facilities",
        "Hygiene promotion and behavior change campaigns",
        "Formation of Health and Hygiene Committees at village level",
        "WASH integration in emergency and flood response"
      ]
    },
    {
      icon: Briefcase,
      title: "Livelihoods & Food Security",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      hoverBorder: "hover:border-amber-500",
      hoverTitle: "group-hover:text-amber-600",
      hoverBg: "hover:bg-amber-50",
      description: "For rural communities in Sindh, livelihoods are fragile — dependent on agriculture, livestock, and fisheries, and repeatedly devastated by floods and climate shocks. SHDS supports communities to rebuild and diversify their income sources, reduce poverty, and strengthen household food security over the long term.",
      activities: [
        "Livestock support and management training",
        "Agriculture and fisheries rehabilitation post-disaster",
        "Vocational skills training for women and youth",
        "Formation and strengthening of community savings groups",
        "Linkages to government social protection and livelihood schemes"
      ]
    },
    {
      icon: Users,
      title: "Women Empowerment & Gender-Based Violence",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverBorder: "hover:border-purple-500",
      hoverTitle: "group-hover:text-purple-600",
      hoverBg: "hover:bg-purple-50",
      description: "Women in rural Sindh face intersecting vulnerabilities — limited mobility, restricted access to education and healthcare, and exposure to gender-based violence — all compounded by deep-rooted social norms. SHDS works to shift this reality by creating safe spaces, building awareness of rights, and enabling meaningful participation in community decisions.",
      activities: [
        "Formation of women's community organizations and self-help groups",
        "Legal awareness and rights-based training for women and girls",
        "GBV prevention, psychosocial support, and referral pathways",
        "Women's participation in local governance and community decision-making",
        "Awareness campaigns on domestic violence, child marriage, and inheritance rights"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Disaster Risk Reduction & Emergency Response",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverBorder: "hover:border-orange-500",
      hoverTitle: "group-hover:text-orange-600",
      hoverBg: "hover:bg-orange-50",
      description: "Sindh is one of Pakistan's most disaster-prone provinces. Recurring floods, droughts, and climate-related shocks repeatedly push already vulnerable communities deeper into poverty. SHDS maintains a standing capacity to respond rapidly in emergencies while also building long-term community resilience through preparedness and risk reduction.",
      activities: [
        "Community-based disaster preparedness training and planning",
        "Rapid needs assessments in flood- and disaster-affected areas",
        "Emergency relief distribution — food, shelter, WASH, and NFIs",
        "Coordination with provincial and district DRR/emergency response authorities",
        "Rehabilitation of schools, health facilities, and community infrastructure post-disaster",
        "Integration of DRR into all sectoral programs"
      ]
    },
    {
      icon: Handshake,
      title: "Social Mobilization & Community Development",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverBorder: "hover:border-green-500",
      hoverTitle: "group-hover:text-green-600",
      hoverBg: "hover:bg-green-50",
      description: "All of SHDS's work is anchored in social mobilization — the belief that communities must be organized, informed, and empowered before any external intervention can have lasting impact. We invest heavily in building Community Organizations (COs) as the foundation of all program delivery.",
      activities: [
        "Formation and strengthening of Community Organizations (COs)",
        "Community savings and self-help group development",
        "CNIC registration drives and voter list enrollment",
        "Exchange visits and peer learning between communities",
        "Linkage building between COs and government service providers",
        "Tree plantation, environmental awareness, and community-led development initiatives"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Programs</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Comprehensive development initiatives across seven thematic areas
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-8">
            {programs.map((program, idx) => {
              const Icon = program.icon;
              return (
                <Card
                  key={idx}
                  className={`group overflow-hidden bg-white border-2 border-gray-200 rounded-2xl
shadow-md ${program.hoverBorder} ${program.hoverBg}
hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`bg-gradient-to-br ${program.color} p-4 rounded-xl flex-shrink-0
        group-hover:scale-110 transition-all duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className={`text-3xl font-bold text-gray-900 mt-2 ${program.hoverTitle} transition-colors duration-300`}>
                      {program.title}
                    </h3>
                  </div>

                  <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                    {program.description}
                  </p>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">
                      Key Activities
                    </h4>

                    <ul className="space-y-2">
                      {program.activities.map((activity, actIdx) => (
                        <li
                          key={actIdx}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 bg-gradient-to-r ${program.color}`}
                          ></span>

                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </Card>
          );
            })}
        </div>
    </div>
      </section >

    {/* Integration Section */ }
    < section className = "py-16 md:py-24 bg-white" >
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">Integrated Approach</h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
          While SHDS organizes its work into seven thematic programs, our approach is fundamentally integrated. Social mobilization underpins all programs — we cannot deliver education, health, or livelihoods without first organizing and empowering communities. Similarly, disaster risk reduction is woven into every sector, and women's empowerment is a cross-cutting priority across all initiatives. This integration ensures that our work addresses the interconnected challenges facing rural Sindh in a holistic, sustainable manner.
        </p>
      </div>
      </section >
    </div >
  );
}
