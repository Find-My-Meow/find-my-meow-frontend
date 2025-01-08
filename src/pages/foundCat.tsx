import Card from "../component/card";

const FoundCat = () => {
    return (
      <div className="h-full">
  {/* Title at the top center */}
  <div className="flex justify-center items-start pt-20">
    <div className="text-center">
      <h1 className="text-3xl font-bold">ประกาศหาเจ้าของ</h1>
    </div>
  </div>

  {/* Grid layout */}
  <div className="grid grid-cols-2 gap-5 pt-4">
    <Card/>
    <Card/>
    <Card/>
    <Card/>

  </div>
</div>

    );
  };
  
  export default FoundCat;
  