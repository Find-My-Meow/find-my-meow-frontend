import DefaultButton from "../components/DefaultButton";

const HomePage = () => {
  return (
    <div className="w-full">
      <div className="flex flex-row gap-10">
        <div>
          <div className="font-paytone text-2xl">
            <span className="text-primary">Find</span>{" "}
            <span className="text-neutral">My</span>{" "}
            <span className="text-secondary">Meow</span>
          </div>
          <div>
            <span className="text-primary font-bold">Find My Meow</span>
            <br />
            สร้างขึ้นเพื่อตามหาแมวที่หายไปกลับมาพบเจ้าของอีกครั้ง
            <br />
            และตามหาครอบครัวอบอุ่นแก่แมวจรจัด
          </div>
          <div className="mt-2">
            <DefaultButton title="ตามหาแมวหาย" color="primary" />
          </div>
        </div>
        <div className="w-60">
          <img src="src/assets/cat-element.png" alt="cat-home" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
