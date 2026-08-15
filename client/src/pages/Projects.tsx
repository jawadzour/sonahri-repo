import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Building2, Calendar } from "lucide-react";
import Seo from "@/components/Seo";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Child-Centred Disaster Risk Management for Sustainable Human Development",
      donor: "Web for Human Development, Thatta",
      location: "4 Government Primary Schools, Taluka Jati & Sujawal",
      sector: "DRR / Education",
      status: "ongoing",
      beneficiaries: "Schools and students"
    },
    {
      id: 2,
      title: "Functionalization of Two Flood-Affected Primary Schools",
      donor: "Baitulmaal",
      location: "Village Ranta (Taluka Sujawal) & Village Batharo Khario (Taluka Jati)",
      sector: "Education",
      status: "completed",
      beneficiaries: "School children and communities"
    },
    {
      id: 3,
      title: "Women Building Peace - Awareness Seminars",
      donor: "PAIMAN",
      location: "Village Ahmed Khan Zolor & related villages in Jati area",
      sector: "GBV / Women Empowerment",
      status: "completed",
      beneficiaries: "Women and community members"
    },
    {
      id: 4,
      title: "BCC Awareness Campaign on Malaria Prevention",
      donor: "NRSP (National Rural Support Programme)",
      location: "District Sujawal",
      sector: "Health",
      status: "completed",
      beneficiaries: "Community members"
    },
    {
      id: 5,
      title: "Hand Pump Installation in Underserved Villages",
      donor: "Sindhi Charitable Society",
      location: "5 villages, UC Bathoro, Taluka Bathoro",
      sector: "WASH",
      status: "completed",
      beneficiaries: "Village communities"
    },
    {
      id: 6,
      title: "Costed Implementation Programme (CIP) — Family Planning & Reproductive Health",
      donor: "Population Welfare Department, Government of Sindh",
      location: "18 Union Councils, District Sujawal",
      sector: "Health / Family Planning",
      status: "completed",
      beneficiaries: "Families and health seekers"
    }
  ];

  const completedProjects = projects.filter(p => p.status === "completed");
  const ongoingProjects = projects.filter(p => p.status === "ongoing");

  const ProjectCard = ({ project }: { project: typeof projects[0] }) => (
    <Card className="group p-6 bg-white border-2 border-[#2d8659] rounded-2xl
shadow-md hover:border-orange-500 hover:bg-green-50
hover:shadow-2xl hover:-translate-y-2
transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1
group-hover:text-[#2d8659]
transition-colors duration-300">{project.title}</h3>
        <Badge className={project.status === "ongoing" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
          {project.status === "ongoing" ? "Ongoing" : "Completed"}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-[#2d8659] flex-shrink-0 mt-0.5
group-hover:scale-110 transition-transform duration-300" />
          <div>
            <p className="text-sm font-semibold text-gray-600">Donor</p>
            <p className="text-gray-800">{project.donor}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#1e5a96] flex-shrink-0 mt-0.5
group-hover:scale-110 transition-transform duration-300" />
          <div>
            <p className="text-sm font-semibold text-gray-600">Location</p>
            <p className="text-gray-800">{project.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5
group-hover:scale-110 transition-transform duration-300" />
          <div>
            <p className="text-sm font-semibold text-gray-600">Beneficiaries</p>
            <p className="text-gray-800">{project.beneficiaries}</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Badge
          variant="outline"
          className="bg-white border-[#2d8659]
group-hover:border-orange-500
transition-all duration-300"
        >{project.sector}</Badge>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <Seo path="/projects" />
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Completed and ongoing initiatives delivering real change across Sindh
          </p>
        </div>
      </section>

      {/* Projects Content */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Ongoing Projects */}
          {ongoingProjects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ongoing Projects</h2>
              <p className="text-gray-600 mb-8">Currently active initiatives making an impact</p>
              <div className="grid grid-cols-1 gap-6">
                {ongoingProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Projects */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Completed Projects</h2>
            <p className="text-gray-600 mb-8">Successfully delivered initiatives with lasting impact</p>
            <div className="grid grid-cols-1 gap-6">
              {completedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Summary */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Project Impact</h2>

          <Card className="group p-8 bg-white border-2 border-[#2d8659]
rounded-2xl shadow-md
hover:border-orange-500
hover:bg-green-50
hover:shadow-2xl
hover:-translate-y-2
transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#2d8659]" />
              <h3 className="text-2xl font-bold text-gray-900
group-hover:text-[#2d8659]
transition-colors duration-300">Total Beneficiaries</h3>
            </div>
            <p className="text-5xl font-bold text-[#2d8659]">387,500+</p>
            <p className="text-gray-700 mt-2">People reached through completed and ongoing projects</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
