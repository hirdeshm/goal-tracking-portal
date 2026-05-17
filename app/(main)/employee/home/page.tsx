export default function EmployeeHome() {

  return (
    <div>

      <h1 className="text-5xl font-bold mb-3">
        Employee Dashboard
      </h1>

      <p className="text-zinc-400 mb-10">
        Track your goals and performance
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card
          title="My Goals"
          value="08"
        />

        <Card
          title="Completed"
          value="05"
        />

        <Card
          title="Pending"
          value="03"
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

      <h2 className="text-5xl font-bold text-green-400">
        {value}
      </h2>

    </div>
  );
}