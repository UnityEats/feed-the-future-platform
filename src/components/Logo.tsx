
import { Link } from "react-router-dom";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img
        src="/lovable-uploads/6165e66d-dc06-41e4-95e5-407fe2d78a54.png"
        alt="UnityEats Logo"
        className={`${sizeMap[size]} mr-2`}
      />
      {showText && (
        <span className="text-primary font-bold text-xl">UnityEats</span>
      )}
    </Link>
  );
};

export default Logo;
