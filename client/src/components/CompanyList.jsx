import CompanyCard from "./CompanyCard";

function CompanyList({
  companies,
  isAdmin,
  appliedCompanies,
  handleApply,
  handleEdit,
  handleDelete,
}) {
  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        No companies added yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {companies.map((company) => (
        <CompanyCard
          key={company._id}
          company={company}
          isAdmin={isAdmin}
          appliedCompanies={appliedCompanies}
          handleApply={handleApply}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default CompanyList;