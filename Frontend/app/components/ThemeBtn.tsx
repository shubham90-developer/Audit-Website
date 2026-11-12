import React from "react";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ThemeBtn = ({
  children,
  className = "",
  type = "button",
  ...props
}: BtnProps) => {
  return (
    <button
      type={type}
      className={`group cursor-pointer relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-orange-400/30 bg-linear-to-r from-black via-[#171717] to-green-950 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-950/30 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl hover:shadow-green-500/20 active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {/* Orange shine animation */}
      <span className="pointer-events-none absolute inset-0 translate-x-[-150%] skew-x-[-20deg] bg-linear-to-r from-transparent via-orange-400/30 to-transparent transition-transform duration-700 group-hover:translate-x-[150%]" />

      {/* Button label */}
      <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F20D18]">
        {children}
      </span>

      {/* Green animated arrow */}
      <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-black shadow-md shadow-green-500/30 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#F20D18]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
};

export default ThemeBtn;
