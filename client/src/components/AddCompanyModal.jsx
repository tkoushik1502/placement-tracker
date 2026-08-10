import { useEffect, useState } from "react";

function AddCompanyModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  company,
  isEditing,
}) {
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    description: "",
    location: "",
    package: "",
    eligibilityCGPA: "",
    deadline: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        role: company.role || "",
        description: company.description || "",
        location: company.location || "",
        package: company.package || "",
        eligibilityCGPA: company.eligibilityCGPA || "",
        deadline: company.deadline
          ? company.deadline.substring(0, 10)
          : "",
      });
    } else {
      setFormData({
        companyName: "",
        role: "",
        description: "",
        location: "",
        package: "",
        eligibilityCGPA: "",
        deadline: "",
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          {isEditing ? "Update Company" : "Add Company"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            rows="3"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="package"
            placeholder="Package (LPA)"
            value={formData.package}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="number"
            step="0.1"
            name="eligibilityCGPA"
            placeholder="Eligibility CGPA"
            value={formData.eligibilityCGPA}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white ${
                isEditing
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEditing ? "Update Company" : "Add Company"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddCompanyModal;