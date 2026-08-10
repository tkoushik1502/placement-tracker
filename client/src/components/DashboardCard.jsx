function DashboardCard({
  title,
  value,
  color,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-xl
        shadow-md
        p-8
        border-l-8
        ${color}
        ${onClick ? "cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200" : ""}
      `}
    >
      <h2 className="text-xl font-medium text-gray-500 mb-6">
        {title}
      </h2>

      <p className="text-5xl font-bold text-black">
        {value}
      </p>
    </div>
  );
}

export default DashboardCard;