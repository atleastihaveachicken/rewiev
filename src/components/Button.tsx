import type { ButtonProps } from "../types/game.types";

const Button = ({ onClick, value }: ButtonProps) => {
  return (
    <button className="button" onClick={() => onClick()}>
      {value}
    </button>
  );
};

export default Button;
