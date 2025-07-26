import * as React from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full shadow-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2 dark:hover:bg-primaryColor dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-primaryColor disabled:pointer-events-none dark:focus:ring-offset-primaryColor data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-black",
  {
    variants: {
      variant: {
        default:
          "bg-primaryColor text-white hover:bg-secondaryColor hover:shadow-xl dark:bg-slate-50 dark:text-slate-900",
        destructive:
          "bg-red-500 text-white hover:shadow-xl hover:bg-red-600 dark:hover:bg-red-600",
        outline:
          "bg-transparent border border-slate-200 hover:shadow-xl hover:bg-secondaryColor hover:text-white dark:border-slate-700 dark:text-slate-100",
        subtle:
          "bg-slate-100 text-slate-900 hover:shadow-xl hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100",
        ghost:
          "bg-transparent dark:bg-transparent hover:shadow-xl hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
        link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-300 hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 m-1 rounded-full",
        lg: "h-11 px-8 m-1 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, href, variant, size, ...props }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
