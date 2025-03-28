const colors = [
  "bg-red-500 text-white",
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-yellow-500 text-black",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-teal-500 text-white",
  "bg-orange-500 text-white",
  "bg-gray-500 text-white",
];

export const getAvatarColor = (initials = "") => {
  const hash = [...initials].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const getAvatarFallbackText = (name = "") => {
  const initials = name
    .split(/\s+/) // Handle multiple spaces
    .filter(Boolean) // Remove empty values
    .slice(0, 2) // Limit to first two words
    .map((word) => word[0]?.toUpperCase()) // Get uppercase initials
    .join("");

  return initials || "NA";
};
