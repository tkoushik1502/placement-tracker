import ApplicationCard from "./ApplicationCard";

function ApplicationList({ applications }) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        You haven't applied to any companies yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {applications.map((application) => (
        <ApplicationCard
          key={application._id}
          application={application}
        />
      ))}
    </div>
  );
}

export default ApplicationList;