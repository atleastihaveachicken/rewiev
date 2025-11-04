import type { ButtonProps } from "../../types/game.types";
import "./Button.css";

const Button = ({ onClick, value }: ButtonProps) => {
  return (
    <button className="button" onClick={() => onClick()}>
      {value}
    </button>
  );
};

export default Button;
