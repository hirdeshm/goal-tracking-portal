import Link from "next/link";

export default function LandingPage() {

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative">

        {/* Glow */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-10 py-6 border-b border-zinc-900">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-black font-bold">
              G
            </div>

            <h1 className="text-2xl font-bold">
              Goal Portal
            </h1>

          </div>

          <Link
            href="/login"
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-2xl transition-all"
          >
            Login
          </Link>

        </nav>

        {/* Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-24 pb-32">

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-center">

            {/* Left */}
            <div>

              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full mb-8">

                <span>●</span>

                Enterprise Performance System

              </div>

              <h1 className="text-6xl xl:text-7xl font-black leading-tight mb-8">

                Track Goals.
                <br />

                Manage Teams.
                <br />

                <span className="text-green-400">
                  Drive Performance.
                </span>

              </h1>

              <p className="text-zinc-400 text-xl leading-relaxed mb-10 max-w-2xl">

                Modern performance management platform for employees,
                managers, and administrators with real-time tracking,
                approvals, analytics, and audit systems.

              </p>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/login"
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl text-lg transition-all"
                >
                  Get Started →
                </Link>

                <button className="border border-zinc-700 hover:border-green-500 px-8 py-4 rounded-2xl text-lg transition-all">
                  Login to Start
                </button>

              </div>

            </div>

            {/* Right Side */}
            <div className="relative">

              <div className="bg-[#081120] border border-zinc-800 rounded-[40px] p-8 shadow-[0_0_80px_rgba(34,197,94,0.15)]">

                {/* Dashboard Mockup */}
                <div className="flex items-center justify-between mb-8">

                  <h2 className="text-2xl font-bold">
                    Dashboard
                  </h2>

                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm">
                    Active
                  </div>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-5 mb-8">

                  <StatCard
                    title="Goals"
                    value="24"
                  />

                  <StatCard
                    title="Completed"
                    value="18"
                  />

                  <StatCard
                    title="Teams"
                    value="08"
                  />

                  <StatCard
                    title="Reviews"
                    value="12"
                  />

                </div>

                {/* Progress */}
                <div className="space-y-5">

                  <Progress
                    title="Quarterly Goals"
                    value={82}
                  />

                  <Progress
                    title="Team Performance"
                    value={74}
                  />

                  <Progress
                    title="Project Delivery"
                    value={91}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="border-t border-zinc-900 py-24 px-10">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold mb-6">
              Everything You Need
            </h2>

            <p className="text-zinc-400 text-xl">
              Enterprise-grade performance management tools
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <FeatureCard
              icon="🎯"
              title="Goal Tracking"
              description="Track employee goals and quarterly objectives."
            />

            <FeatureCard
              icon="📈"
              title="Analytics"
              description="Monitor performance metrics in real time."
            />

            <FeatureCard
              icon="✅"
              title="Approvals"
              description="Manager review and approval workflows."
            />

            <FeatureCard
              icon="🔒"
              title="Audit Logs"
              description="Complete activity monitoring and logs."
            />

          </div>

        </div>

      </section>

    </main>
  );
}

/* ---------- Components ---------- */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (
    <div className="bg-[#0f172a] border border-zinc-800 rounded-2xl p-5">

      <p className="text-zinc-400 text-sm mb-2">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-green-400">
        {value}
      </h2>

    </div>
  );
}

function Progress({
  title,
  value,
}: {
  title: string;
  value: number;
}) {

  return (
    <div>

      <div className="flex justify-between mb-2">

        <p>
          {title}
        </p>

        <p className="text-green-400">
          {value}%
        </p>

      </div>

      <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

        <div
          className="h-full bg-green-500 rounded-full"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">

      <div className="text-5xl mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>

    </div>
  );
}