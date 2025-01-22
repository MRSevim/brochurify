import { Props } from "@/utils/Types";

const Button = ({ children, style }: Props) => {
  return <button style={style}>{children}</button>;
};

export default Button;
