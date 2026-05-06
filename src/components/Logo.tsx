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
    sm: "h-12 sm:h-14",
    md: "h-16 sm:h-20",
    lg: "h-24 sm:h-28",
    xl: "h-32 sm:h-40",
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
