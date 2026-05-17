export default function ManagerHome() {

  return (
    <div>

      <h1 className="text-5xl font-bold mb-3">
        Manager Dashboard
      </h1>

      <p className="text-zinc-400 mb-10">
        Manage employee performance
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card
          title="Pending Approvals"
          value="04"
        />

        <Card
          title="Team Members"
          value="12"
        />

        <Card
          title="Reviews"
          value="07"
        />

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-6">

      <p className="text-zinc-400 mb-3">
        {title}
      </p>

      <h2 className="text-5xl font-bold text-blue-400">
        {value}
      </h2>

    </div>
  );
}