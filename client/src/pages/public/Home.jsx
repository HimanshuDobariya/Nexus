import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Manage Projects with <br />{" "}
            <div className="flex items-center justify-center gap-1">
              {["N", "E", "X", "U", "S"].map((letter, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-600 via-gray-900 to-gray-600 px-4 py-1 rounded-md mt-4 text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your workflow, collaborate seamlessly, and deliver
            projects on time with Nexus - the ultimate project management
            solution.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
