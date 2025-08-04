import {cva} from "class-variance-authority";

const containerVariants = cva("form-ready-component relative size-full", {
  variants: {
    variant: {
      default: "",
      compact: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const childrenWrapperVariants = cva("", {
  variants: {
    variant: {
      default: "pointer-events-none [&_*]:-z-10",
      compact: "pointer-events-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const contentWrapperVariants = cva(
  "absolute inset-0 z-10 flex size-full flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        default: "gap-4 px-4 py-8 lg:px-12 lg:py-16",
        compact: "px-1 py-3 lg:px-4 lg:py-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const titleVariants = cva("font-bold leading-none tracking-tight text-gray-900", {
  variants: {
    variant: {
      default: "text-2xl md:text-3xl xl:text-4xl",
      compact: "text-md md:text-lg xl:text-xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const messageVariants = cva("font-light text-gray-500", {
  variants: {
    variant: {
      default: "md:text-lg xl:text-xl",
      compact: "md:text-xs xl:text-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const overlayVariants = cva("absolute inset-0", {
  variants: {
    variant: {
      default: "z-9 bg-white opacity-90",
      compact: "z-9 bg-white opacity-50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type FormReadyComponentProps = {
  children: JSX.Element;
  active: boolean;
  content: {
    icon: JSX.Element;
    title: string;
    message: string;
    action?: JSX.Element;
  } | null;
  variant?: "default" | "compact";
};

export function FormReadyComponent({children, active, content, variant = "default"}: FormReadyComponentProps) {
  if (!active) return children;
  if (!content) return children;
  return (
    <div className={containerVariants({variant})}>
      <div className={childrenWrapperVariants({variant})}>{children}</div>
      <div className={contentWrapperVariants({variant})}>
        {content.icon}
        <h1 className={titleVariants({variant})}>{content.title}</h1>
        <p className={messageVariants({variant})}>{content.message}</p>
        {content.action}
      </div>
      <div className={overlayVariants({variant})}></div>
    </div>
  );
}
