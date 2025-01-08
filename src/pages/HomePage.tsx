import DefaultButton from "../components/DefaultButton";

const HomePage = () => {
  return (
    <div className="max-w-full h-fit">
      <div className="flex flex-row gap-20 items-center">
        <div className="">
          <div className="font-paytone text-7xl py-2">
            <span className="text-primary">Find</span>{" "}
            <span className="text-neutral">My</span>{" "}
            <span className="text-secondary">Meow</span>
          </div>
          <div className="mt-5 mb-5 text-black text-lg">
            <span className="text-primary font-bold text-lg">Find My Meow</span>
            <br />
            สร้างขึ้นเพื่อตามหาแมวที่หายไปกลับมาพบเจ้าของอีกครั้ง
            <br />
            และตามหาครอบครัวอบอุ่นแก่แมวจรจัด
          </div>
          <div className="mt-2 font-semibold">
            <DefaultButton title="ตามหาแมวหาย" color="primary" />
          </div>
        </div>
        <div className="w-[35rem]">
          <img src="src/assets/cat-element.png" alt="cat-home" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
