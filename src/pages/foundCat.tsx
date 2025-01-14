import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Card from "../components/card";
const FoundCat = () => {
    const navigate = useNavigate();

    // Function to navigate to New Post page
    const handleClick = () => {
      // Navigate to the /new-post route when the button is clicked
      navigate('/create-newpost');
    };
    return (
      <div className="h-full">
  {/* Title at the top center */}
  <div className="flex justify-center items-start pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ประกาศตามหาเจ้าของแมว</h1>
        </div>
      </div>

      {/* Button aligned to the right */}
      <div className="flex justify-end pt-4">
        <Button
          label="สร้างโพสต์ใหม่"
          onClick={handleClick}
          className="bg-green-500 hover:bg-green-600"
        />
      </div>

  {/* Grid layout */}
  <div className="grid grid-cols-2 gap-5 pt-4">
  <Card postType={'foundcat'} />
  </div>
</div>

    );
  };
  
  export default FoundCat;
  
