import { animated, useSpring } from "react-spring";
import { Episode } from "../common/types";

export function Sidebar({
  episode,
  onClick,
}: {
  episode: Episode | null;
  onClick: () => void;
}) {
  const { width } = useSpring({ width: episode ? 512 : 0 });
  return (
    <animated.div
      onClick={onClick}
      style={{
        minWidth: width,
        height: "100%",
        backgroundColor: "#333",
        color: "#fff",
        padding: "20px",
        boxSizing: "border-box",
        display: episode ? "block" : "none",
      }}
    >
      <div>{episode?.title}</div>
      <div>{episode?.details}</div>
    </animated.div>
  );
}
