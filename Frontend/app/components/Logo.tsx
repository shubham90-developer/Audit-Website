import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="Ahmed Al Mazroei Auditing & Accounting - Home"
      className="inline-flex shrink-0 items-center"
    >
      <Image
        src="/img/logo1.png"
        alt="Ahmed Al Mazroei Auditing & Accounting"
        width={140}
        height={70}
        priority
        className="h-auto w-38 object-contain sm:w-32 md:w-36 lg:w-40 xl:w-44"
      />
    </Link>
  );
};

export default Logo;
