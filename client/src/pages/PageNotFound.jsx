import { Link } from "react-router-dom";
import dribbble from "../assets/dribbble.gif";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const PageNotFound = () => {
  return (
    <section className="py-10 p-4 bg-white">
      <div className="container h-full mx-auto">
        <div className="text-center">
          <h1 className="text-center text-8xl">404</h1>
          <div
            style={{ backgroundImage: `url(${dribbble})` }}
            className="h-[400px] bg-center bg-no-repeat "
          ></div>

          <div className="flex flex-col -translate-y-10 items-center text-center">
            <h3 className="text-4xl sm:text-5xl font-semibold mb-2">
              Look like you're lost
            </h3>
            <p className="text-gray-700 mb-4">
              The page you are looking for is not available!
            </p>
            <Button asChild className="mt-2">
              <Link to="/">
                <Home className="size-4 mr-1" />
                Go to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PageNotFound;
