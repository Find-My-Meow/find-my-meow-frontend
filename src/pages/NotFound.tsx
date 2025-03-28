import { LuMessageCircleWarning } from "react-icons/lu";
import { TbCat } from "react-icons/tb";

const NotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 mt-32">
      <div className="flex justify-center items-center mb-5 ml-5">
        <TbCat className="w-32 h-32 text-[#507ec7]" />
        <LuMessageCircleWarning className="w-24 h-24 text-[#b72e2e] mb-24" />
      </div>

      {/* <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1> */}
      <h2 className="text-4xl font-semibold text-gray-700 mb-2 -mt-8">
        ไม่พบหน้าที่คุณต้องการ
      </h2>
      <p className="text-gray-500 mb-6">กรุณาตรวจสอบลิงก์หรือกลับไปหน้าแรก</p>
      <a
        href="/"
        className="px-6 py-2 bg-[#FF914D] text-white rounded-lg font-semibold hover:bg-orange-500 transition"
      >
        กลับหน้าแรก
      </a>
    </div>
  );
};

export default NotFound;
