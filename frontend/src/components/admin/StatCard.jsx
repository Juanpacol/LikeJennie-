function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default StatCard;
