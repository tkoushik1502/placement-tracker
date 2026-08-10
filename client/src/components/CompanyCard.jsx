function CompanyCard({
  company,
  isAdmin,
  appliedCompanies,
  handleApply,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-3xl font-bold">
        {company.companyName}
      </h2>

      <p className="mt-3">
        <span className="font-semibold">Role:</span> {company.role}
      </p>

      <p>
        <span className="font-semibold">Package:</span>{" "}
        {company.package} LPA
      </p>

      <p>
        <span className="font-semibold">Location:</span>{" "}
        {company.location}
      </p>

      <p>
        <span className="font-semibold">Eligibility:</span>{" "}
        {company.eligibilityCGPA} CGPA
      </p>

      <p>
        <span className="font-semibold">Deadline:</span>{" "}
        {new Date(company.deadline).toLocaleDateString()}
      </p>

      {company.description && (
        <p className="mt-3 text-gray-600">
          {company.description}
        </p>
      )}

      <div className="flex gap-3 mt-6">
        {isAdmin ? (
          <>
            <button
              onClick={() => handleEdit(company)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(company._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        ) : appliedCompanies.includes(company._id) ? (
          <button
            disabled
            className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
          >
            Applied
          </button>
        ) : (
          <button
            onClick={() => handleApply(company._id)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        )}
      </div>

    </div>
  );
}

export default CompanyCard;