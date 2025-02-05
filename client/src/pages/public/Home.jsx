import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-8 md:py-16 px-4 z-10 relative">
      <h1 className="mb-4 text-5xl font-extrabold tracking-tight leading-none md:text-6xl lg:text-7xl text-white">
        Streamline Your Work flow with
        <div className="flex items-center justify-center gap-1">
          {["N", "E", "X", "U", "S"].map((letter, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-gray-900 via-blue-gray-600 to-blue-gray-300 px-4 py-1 rounded-md mt-4"
            >
              {letter}
            </div>
          ))}
        </div>
      </h1>

      <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 text-gray-200">
        Nexus empowers teams with seamless project management, ensuring
        efficiency, collaboration, and clarity at every stage.
      </p>

      <Button
        color="white"
        size="lg"
        onClick={() => {
          navigate("/signup");
        }}
      >
        Get started
      </Button>
    </div>
  );
};
export default Home;
