import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Seo from "@/components/Seo";
import { useEffect, useState } from "react";
import { fetchPrograms, type PublicProgram } from "@/lib/shds-api";
import { getProgramColorTheme, getProgramIcon, splitDescription } from "@/lib/program-icon";

export default function Programs() {
  const [programs, setPrograms] = useState<PublicProgram[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrograms()
      .then(setPrograms)
      .catch(() => setPrograms(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Seo path="/programs" />
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Our Programs</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl">
            Comprehensive development initiatives across Sindh, Pakistan
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : !programs || programs.length === 0 ? (
            <p className="text-center text-gray-600 py-16">
              Programs will be listed here soon.
            </p>
          ) : (
            <div className="space-y-8">
              {programs.map((program, idx) => {
                const Icon = getProgramIcon(program.icon);
                const theme = getProgramColorTheme(idx);
                const { paragraphs, bullets } = splitDescription(program.description);

                return (
                  <Card
                    key={program.id}
                    className={`group overflow-hidden bg-white border-2 border-gray-200 rounded-2xl shadow-md ${theme.hoverBorder} ${theme.hoverBg} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`bg-gradient-to-br ${theme.gradient} p-4 rounded-xl flex-shrink-0 group-hover:scale-110 transition-all duration-300`}
                        >
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>

                        <h3
                          className={`text-2xl sm:text-3xl font-bold text-gray-900 mt-2 ${theme.hoverTitle} transition-colors duration-300`}
                        >
                          {program.title}
                        </h3>
                      </div>

                      {program.summary && (
                        <p className="text-gray-600 text-base sm:text-lg mb-2 italic">{program.summary}</p>
                      )}

                      {paragraphs.map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-gray-800 text-base sm:text-lg mb-6 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}

                      {bullets.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-lg">Key Activities</h4>
                          <ul className="space-y-2">
                            {bullets.map((activity, actIdx) => (
                              <li key={actIdx} className="flex items-start gap-3 text-gray-700">
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 bg-gradient-to-r ${theme.gradient}`}
                                ></span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">Integrated Approach</h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
            While SHDS organizes its work into thematic programs, our approach is fundamentally
            integrated. Social mobilization underpins all programs — we cannot deliver education,
            health, or livelihoods without first organizing and empowering communities. Similarly,
            disaster risk reduction is woven into every sector, and women's empowerment is a
            cross-cutting priority across all initiatives. This integration ensures that our work
            addresses the interconnected challenges facing rural Sindh in a holistic, sustainable
            manner.
          </p>
        </div>
      </section>
    </div>
  );
}
