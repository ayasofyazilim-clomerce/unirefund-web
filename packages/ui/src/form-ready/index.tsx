export function FormReadyComponent({
  children,
  active,
  content,
}: {
  children: JSX.Element;
  active: boolean;
  content: {
    icon: JSX.Element;
    title: string;
    message: string;
    action?: JSX.Element;
  } | null;
}) {
  if (!active) return children;
  if (!content) return children;
  return (
    <div className="relative size-full">
      <div className="pointer-events-none [&_*]:-z-10 ">{children}</div>
      <div className="absolute inset-0 z-10">
        <div className="flex size-full flex-col items-center justify-center gap-4 px-4 py-8 text-center lg:px-12 lg:py-16">
          {content.icon}
          <h1 className="text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl xl:text-4xl">
            {content.title}
          </h1>
          <p className="font-light text-gray-500 md:text-lg xl:text-xl">{content.message}</p>
          {content.action}
        </div>
      </div>
      <div className="z-9 absolute inset-0 bg-white opacity-90"></div>
    </div>
  );
}
