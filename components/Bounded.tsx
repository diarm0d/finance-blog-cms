import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

export default function Bounded({
  as: Comp = "section",
  className,
  children,
  ...rest
}: BoundedProps) {
  return (
    <Comp
      className={clsx("mx-2 md:mx-auto my-4 md:my-6", className)}
      {...rest}
    >
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </Comp>
  );
}
