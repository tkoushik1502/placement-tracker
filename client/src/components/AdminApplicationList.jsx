import AdminApplicationCard from "./AdminApplicationCard";

function AdminApplicationList({
  applications,
  updateStatus,
}) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
        No Applications Found
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {applications.map((application) => (
        <AdminApplicationCard
          key={application._id}
          application={application}
          updateStatus={updateStatus}
        />
      ))}
    </div>
  );
}

export default AdminApplicationList;