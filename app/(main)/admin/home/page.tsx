export default function AdminHome() {

  return (
    <div>

      <h1 className="text-5xl font-bold mb-3">
        Admin Dashboard
      </h1>

      <p className="text-zinc-400 mb-10">
        Monitor organization activities
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card
          title="Users"
          value="24"
        />

        <Card
          title="Audit Logs"
          value="120"
        />

        <Card
          title="Departments"
          value="06"
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

      <h2 className="text-5xl font-bold text-red-400">
        {value}
      </h2>

    </div>
  );
}