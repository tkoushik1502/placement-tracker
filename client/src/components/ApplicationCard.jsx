function ApplicationCard({ application }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-yellow-500";

      case "Shortlisted":
        return "bg-orange-500";

      case "Interview":
        return "bg-purple-500";

      case "Selected":
        return "bg-green-600";

      case "Rejected":
        return "bg-red-600";

      default:
        return "bg-gray-500";
    }
  };

  const getTimelineDot = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-500";

      case "Rejected":
        return "bg-red-500";

      case "Interview":
        return "bg-purple-500";

      case "Shortlisted":
        return "bg-orange-500";

      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* =========================
          COMPANY INFORMATION
      ========================= */}

      <h2 className="text-3xl font-bold">
        {application.company?.companyName}
      </h2>

      <p className="mt-3">
        <span className="font-semibold">
          Role :
        </span>{" "}
        {application.company?.role}
      </p>

      <p>
        <span className="font-semibold">
          Package :
        </span>{" "}
        ₹{application.company?.package} LPA
      </p>

      <p>
        <span className="font-semibold">
          Location :
        </span>{" "}
        {application.company?.location}
      </p>


      {/* =========================
          CURRENT STATUS
      ========================= */}

      <div className="mt-5">

        <p className="font-semibold">
          Current Status :
        </p>

        <span
          className={`inline-block mt-2 px-4 py-2 rounded-full text-white ${getStatusColor(
            application.status
          )}`}
        >
          {application.status}
        </span>

      </div>


      {/* =========================
          ADMIN REMARKS
      ========================= */}

      {application.remarks && (
        <div className="mt-6 border-t pt-5">

          <h3 className="text-lg font-semibold">
            Latest Admin Remarks
          </h3>

          <div className="mt-3 bg-gray-50 border rounded-lg p-4 text-gray-700">
            {application.remarks}
          </div>

        </div>
      )}


      {/* =========================
          APPLICATION TIMELINE
      ========================= */}

      {application.history?.length > 0 && (

        <div className="mt-8 border-t pt-6">

          <h3 className="text-2xl font-semibold">
            Application Timeline
          </h3>

          <p className="text-gray-500 mt-1">
            Track the progress of your application
          </p>


          <div className="mt-6">

            {application.history
              .slice()
              .reverse()
              .map((item, index, history) => (

                <div
                  key={index}
                  className="relative flex gap-4"
                >

                  {/* Timeline Line */}

                  {index !== history.length - 1 && (
                    <div className="absolute left-[9px] top-6 w-0.5 h-full bg-gray-200" />
                  )}


                  {/* Timeline Dot */}

                  <div
                    className={`relative z-10 w-5 h-5 rounded-full mt-1 ${getTimelineDot(
                      item.status
                    )}`}
                  />


                  {/* Timeline Content */}

                  <div className="pb-8">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <span className="font-semibold text-lg">
                        {item.status}
                      </span>

                      <span className="text-sm text-gray-400">
                        {item.changedAt
                          ? new Date(
                              item.changedAt
                            ).toLocaleDateString()
                          : ""}
                      </span>

                    </div>


                    {item.remarks && (
                      <p className="mt-2 text-gray-600">
                        {item.remarks}
                      </p>
                    )}

                  </div>

                </div>

              ))}

          </div>

        </div>

      )}


      {/* =========================
          APPLIED DATE
      ========================= */}

      <p className="mt-2 text-gray-400 text-sm">
        Applied On :{" "}
        {application.createdAt
          ? new Date(
              application.createdAt
            ).toLocaleDateString()
          : ""}
      </p>

    </div>
  );
}

export default ApplicationCard;