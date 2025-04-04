import { useNavigate } from "react-router-dom";
import Card from "../components/card";
import DefaultButton from "../components/DefaultButton";

const LostCat = () => {
  const navigate = useNavigate();

  // Function to navigate to New Post page
  const handleClick = () => {
    // Navigate to the /new-post route when the button is clicked
    navigate("/create-newpost");
  };

  return (
    <div className="h-full mb-20">
      {/* Title at the top center */}
      <div className="flex justify-center items-start">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ประกาศตามหาแมวหาย</h1>
        </div>
      </div>

      {/* Button aligned to the right */}
      <div className="flex justify-end pt-4 mt-2 font-semibold">
        <DefaultButton
          title="สร้างโพสต์ใหม่"
          color="primary"
          onClick={handleClick}
        />
      </div>

      {/* Grid layout */}
      <div className="flex justify-center mt-10">
        <Card postType={"lost"} />
      </div>
    </div>
  );
};

export default LostCat;
