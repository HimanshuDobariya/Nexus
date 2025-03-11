const Header = ({ title, description }) => {
  return (
    <div className="space-y-1">
      <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
      <p className="text-neutral-500">{description}</p>
    </div>
  );
};
export default Header;
