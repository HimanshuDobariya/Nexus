import { cn } from "@/lib/utils";

const DottedSeperator = ({
  className,
  color = "#d4d4d8",
  height = "2px",
  dotsize = "2px",
  gapsize = "6px",
  direction = "horizontal",
}) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center "
          : "h-full flex flex-col items-center"
      )}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${parseInt(dotsize) + parseInt(gapsize)}px ${height}`
            : `${height} ${parseInt(dotsize) + parseInt(gapsize)}px `,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};
export default DottedSeperator;
