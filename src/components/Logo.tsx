import Link from "next/link";
import Image from "next/image";

export default function Logo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const heightClass = {
    sm: "h-14 sm:h-16",
    md: "h-20 sm:h-24",
    lg: "h-28 sm:h-32",
    xl: "h-36 sm:h-44",
  }[size];

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Palmdrive Rentals"
        width={320}
        height={320}
        priority
        className={`${heightClass} w-auto object-contain`}
      />
    </Link>
  );
}
