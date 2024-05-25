import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";

const WidgetCard = ({ title, count, percent }) => {
  const icon = percent >= 0 ? <IoMdTrendingUp /> : <IoMdTrendingDown />;
  const color = percent >= 0 ? "text-green-500" : "text-red-500";
  return (
    <div className="flex gap-2 min-w-52 h-32  rounded-lg  shadow-lg p-2">
      <div className="flex-1 flex flex-col justify-center items-center ">
        <div className="text-start">
          <p className="text-gray-500">{title}</p>
          <p className="font-medium">
            {title === "Revenue" && "$"}
            {count}
          </p>
          <p className={`flex gap-1 items-center ${color}`}>
            {icon}
            <span>{percent >= 0 && "+"}</span>
            <span>{percent}</span>
          </p>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center  overflow-hidden ">
        <div
          className="w-20 h-20 rounded-full flex justify-center items-center"
          style={{
            background: `conic-gradient(rgba(${(count * 20) % 200}, ${
              (count * 128) % 180
            },${(count * 60) % 230}) ${Math.abs(
              percent
            )}deg , rgba(128, 128, 128, 0.5) 0)`,
          }}
        >
          <div className="w-16 h-16 rounded-full  flex justify-center items-center bg-white">
            {percent}%
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default WidgetCard;
