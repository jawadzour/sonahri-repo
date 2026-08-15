import { Card } from "@/components/ui/card";
import { Users, Award, Building2, Briefcase } from "lucide-react";
import Seo from "@/components/Seo";

export default function Governance() {
  return (
    <div className="min-h-screen bg-white">
      <Seo path="/governance" />
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Governance & Leadership</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Structured governance and professional leadership
          </p>
        </div>
      </section>

      {/* Team Photo */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/governance/governance-team.jpg"
              alt="SHDS leadership and team"
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Board of Governors */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Board of Governors</h2>

          <Card className="group p-8 bg-white border-2 border-[#2d8659] rounded-2xl
shadow-md hover:border-orange-500 hover:bg-green-50
hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <Award className="w-8 h-8 text-[#2d8659] flex-shrink-0 mt-1
group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4
group-hover:text-[#2d8659] transition-colors duration-300">Board Structure</h3>
                <p className="text-gray-700 leading-relaxed">
                  SHDS is governed by a General Body of more than 30 members, comprising committed social activists, development professionals, and community leaders from across Sindh. The General Body elects seven members as the Board of Governors every two years. The Board meets quarterly to review organizational performance, provide strategic direction, and ensure accountability to all stakeholders.
                </p>
              </div>
            </div>
          </Card>

          <div className="group bg-white border-2 border-[#2d8659] rounded-2xl p-6 mb-8
shadow-md hover:border-orange-500 hover:bg-green-50
hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <p className="text-lg text-gray-800">
              <span className="font-bold text-[#1e5a96]">Current Chairman:</span> Mr. Adeel Baloch
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The Board provides strategic oversight and ensures that SHDS remains true to its mission and values. Board members bring diverse expertise in development, governance, finance, and community engagement, enabling SHDS to navigate complex challenges and maintain professional standards across all operations.
            </p>
          </div>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Executive Leadership</h2>

          <Card className="group p-8 bg-white border-2 border-[#2d8659]
rounded-2xl shadow-md hover:border-orange-500
hover:bg-green-50 hover:shadow-2xl
hover:-translate-y-2 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full md:rounded-2xl overflow-hidden border-4 border-white ring-2 ring-[#2d8659]/40 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/team/ceo-inayat-ali.jpg"
                  alt="Mr. Inayat Ali, Chief Executive Officer of SHDS"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2
group-hover:text-[#2d8659] transition-colors duration-300">Chief Executive Officer</h3>
                <p className="text-2xl font-semibold text-[#2d8659] mb-4">Mr. Inayat Ali</p>
                <p className="text-gray-800 leading-relaxed">
                  Under the leadership of Mr. Inayat Ali, SHDS has grown from a community-level initiative into a structured development organization delivering multi-sector programs across Sindh. The CEO leads the executive team, which includes program managers for each thematic sector, a finance and administration unit, and dedicated field teams based in Thatta and Sujawal. Day-to-day operations are managed by a team of qualified program managers, field experts, engineers, and support staff, all guided by SHDS's policy manual and subject to annual independent audit.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-gray-900 text-center">Organizational Structure</h2>

          <div className="space-y-4">
            {/* General Body */}
            <div className="flex justify-center">
              <Card className="group p-6 bg-gradient-to-r from-[#2d8659] to-[#1b5e3f]
text-white border-2 border-transparent
hover:border-green-300 hover:shadow-2xl
hover:-translate-y-2 transition-all duration-300
w-full max-w-xs text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">General Body</p>
                <p className="text-sm text-green-100">30+ members</p>
              </Card>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-1 h-8 bg-gray-400"></div>
            </div>

            {/* Board of Governors */}
            <div className="flex justify-center">
              <Card className="group p-6 bg-gradient-to-r from-[#1e5a96] to-[#1b4d7a]
text-white border-2 border-transparent
hover:border-blue-300 hover:shadow-2xl
hover:-translate-y-2 transition-all duration-300
w-full max-w-xs text-center">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">Board of Governors</p>
                <p className="text-sm text-blue-100">7 members</p>
              </Card>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-1 h-8 bg-gray-400"></div>
            </div>

            {/* CEO */}
            <div className="flex justify-center">
              <Card className="group p-6 bg-gradient-to-r from-purple-600 to-purple-700
text-white border-2 border-transparent
hover:border-purple-300 hover:shadow-2xl
hover:-translate-y-2 transition-all duration-300
w-full max-w-xs text-center">
                <Briefcase className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">Chief Executive Officer</p>
                <p className="text-sm text-purple-100">Mr. Inayat Ali</p>
              </Card>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-1 h-8 bg-gray-400"></div>
            </div>

            {/* Executive Units */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="group p-6 bg-white border-2 border-amber-300 rounded-xl
hover:border-amber-500 hover:bg-amber-50
hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="font-bold text-gray-900">Finance & Administration</p>
              </Card>
              <Card className="group p-6 bg-white border-2 border-cyan-300 rounded-xl
hover:border-cyan-500 hover:bg-cyan-50
hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <p className="font-bold text-gray-900">Program Managers (Unit)</p>
              </Card>
              <Card className="group p-6 bg-white border-2 border-green-300 rounded-xl
hover:border-green-500 hover:bg-green-50
hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-bold text-gray-900">Field Teams</p>
              </Card>
            </div>

            {/* Arrow */}
            <div className="flex justify-center mt-8">
              <div className="w-1 h-8 bg-gray-400"></div>
            </div>

            {/* Program Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[
                "Education",
                "Health & Nutrition (MNCH & Family Planning)",
                "WASH",
                "Livelihoods & Food Security",
                "Women Empowerment & GBV",
                "Disaster Risk Reduction & Emergency Response",
                "Social Mobilization & Community Development"
              ].map((program, idx) => (
                <Card
                  key={idx}
                  className="group p-4 bg-white border-2 border-[#2d8659]
  rounded-xl shadow-sm hover:border-orange-500
  hover:bg-green-50 hover:shadow-lg
  hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <p className="font-semibold text-gray-900 text-sm">{program}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staffing & Operations */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Staffing & Operations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group p-6 bg-white border-2 border-[#2d8659]
rounded-2xl shadow-md hover:border-orange-500
hover:bg-green-50 hover:shadow-xl
hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Team</h3>
              <p className="text-gray-700 leading-relaxed">
                SHDS currently employs approximately 20 full-time professional staff, including program managers, field experts, engineers, and support personnel. All staff are guided by SHDS's comprehensive policy manual and subject to annual independent audit to ensure accountability and professional standards.
              </p>
            </Card>

            <Card className="group p-6 bg-white border-2 border-[#2d8659]
rounded-2xl shadow-md hover:border-orange-500
hover:bg-green-50 hover:shadow-xl
hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Volunteers</h3>
              <p className="text-gray-700 leading-relaxed">
                SHDS is supported by hundreds of trained community volunteers embedded across target districts. These volunteers serve as the bridge between SHDS and the communities, ensuring programs are locally owned, culturally appropriate, and sustainably implemented.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Accountability */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-8 text-center">Accountability & Transparency</h2>

          <div className="space-y-6 text-lg">
            <p>
              SHDS is committed to the highest standards of accountability and transparency. The Board meets quarterly to review organizational performance and provide strategic direction. The organization undergoes annual independent audit and maintains detailed financial records accessible to partners, donors, and stakeholders.
            </p>

            <p>
              All staff and volunteers operate under SHDS's policy manual, which outlines ethical standards, operational procedures, and safeguarding protocols. This commitment to professional governance ensures that SHDS remains a trusted partner to communities, government, and donors alike.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
