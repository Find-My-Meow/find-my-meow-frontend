import { useNavigate } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";
const Result = () => {
  const navigate = useNavigate();

  // Function to navigate to New Post page
  const handleClick = () => {
    // Navigate to the /new-post route when the button is clicked
    navigate("/search-cat");
  };

  return (
    <div className="h-full">
      {/* Title at the top center */}
      <div className="flex justify-center items-start">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ผลการค้นหา</h1>
        </div>
      </div>

      {/* Button aligned to the right */}
      <div className="flex justify-end pt-4 mt-2 font-semibold">
        <DefaultButton
          title="ค้นหา"
          color="primary"
          onClick={handleClick}
        />
      </div>

      {/* Grid layout */}
      {/* <div className="flex justify-center mt-10">
        <Card postType={"adoption"} />
      </div> */}
    </div>
  );
};

export default Result;
