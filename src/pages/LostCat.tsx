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
    <div className="h-full px-4 md:px-10">
      {/* Title at the top center */}
      <div className="flex justify-center items-start">
        <h1 className="text-3xl font-bold text-center">ประกาศตามหาแมวหาย</h1>
      </div>

      {/* Button aligned to the right */}
      <div className="flex justify-end">
        <DefaultButton
          title="สร้างโพสต์ใหม่"
          color="primary"
          onClick={handleClick}
        />
      </div>

      {/* Grid layout */}
      <div className="flex justify-center">
        <Card postType={"lost"} />
      </div>
    </div>
  );
};

export default LostCat;
