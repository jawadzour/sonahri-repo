import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Building2 } from "lucide-react";
import Seo from "@/components/Seo";
import { useEffect, useState } from "react";
import { fetchProjects, type PublicProject } from "@/lib/shds-api";

const STATUS_LABEL: Record<PublicProject["status"], string> = {
  ongoing: "Ongoing",
  planned: "Planned",
  completed: "Completed",
};

const STATUS_BADGE_CLASS: Record<PublicProject["status"], string> = {
  ongoing: "bg-blue-100 text-blue-800",
  planned: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
};

const SECTION_ORDER: { status: PublicProject["status"]; heading: string; description: string }[] = [
  { status: "ongoing", heading: "Ongoing Projects", description: "Currently active initiatives making an impact" },
  { status: "planned", heading: "Planned Projects", description: "Upcoming initiatives in the pipeline" },
  { status: "completed", heading: "Completed Projects", description: "Successfully delivered initiatives with lasting impact" },
];

function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <Card className="group p-6 bg-white border-2 border-[#2d8659] rounded-2xl shadow-md hover:border-orange-500 hover:bg-green-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1 group-hover:text-[#2d8659] transition-colors duration-300">
          {project.title}
        </h3>
        <Badge className={STATUS_BADGE_CLASS[project.status]}>{STATUS_LABEL[project.status]}</Badge>
      </div>

      <div className="space-y-3 mb-4">
        {project.donor && (
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-[#2d8659] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Donor</p>
              <p className="text-gray-800">{project.donor}</p>
            </div>
          </div>
        )}

        {project.location && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#1e5a96] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Location</p>
              <p className="text-gray-800">{project.location}</p>
            </div>
          </div>
        )}

        {project.beneficiaries && (
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Beneficiaries</p>
              <p className="text-gray-800">{project.beneficiaries}</p>
            </div>
          </div>
        )}
      </div>

      {project.description && (
        <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
      )}

      {project.sector && (
        <div className="pt-4 border-t border-gray-200">
          <Badge
            variant="outline"
            className="bg-white border-[#2d8659] group-hover:border-orange-500 transition-all duration-300"
          >
            {project.sector}
          </Badge>
        </div>
      )}
    </Card>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<PublicProject[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Seo path="/projects" />
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl">
            Completed and ongoing initiatives delivering real change across Sindh
          </p>
        </div>
      </section>

      {/* Projects Content */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-2xl" />
              ))}
            </div>
          ) : !projects || projects.length === 0 ? (
            <p className="text-center text-gray-600 py-16">Projects will be listed here soon.</p>
          ) : (
            SECTION_ORDER.map(({ status, heading, description }) => {
              const sectionProjects = projects.filter((p) => p.status === status);
              if (sectionProjects.length === 0) return null;
              return (
                <div key={status} className="mb-16 last:mb-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{heading}</h2>
                  <p className="text-gray-600 mb-8">{description}</p>
                  <div className="grid grid-cols-1 gap-6">
                    {sectionProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
