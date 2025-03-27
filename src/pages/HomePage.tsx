import { useNavigate } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/lost-cat");
  };

  return (
    <div className="w-full h-fit px-4 py-10">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20 max-w-6xl mx-auto">
        {/* Left Section: Text and Button */}
        <div className="text-center lg:text-left">
          <div className="font-paytone text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-2 leading-tight whitespace-nowrap">
            <span className="text-primary">Find</span>{" "}
            <span className="text-neutral">My</span>{" "}
            <span className="text-secondary">Meow</span>
          </div>
          <div className="mt-5 mb-5 text-gray-800 text-base sm:text-lg">
            <span className="text-primary font-bold">Find My Meow</span>
            <br />
            สร้างขึ้นเพื่อตามหาแมวที่หายไปกลับมาพบเจ้าของอีกครั้ง
            <br />
            และตามหาครอบครัวอบอุ่นแก่แมวจรจัด
          </div>
          <div className="mt-4 font-semibold">
            <DefaultButton
              title="ตามหาแมวหาย"
              color="primary"
              onClick={handleClick}
            />
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
          <img
            src="src/assets/cat-element.png"
            alt="cat-home"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
