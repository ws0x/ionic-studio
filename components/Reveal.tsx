"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cast to a concrete props shape so children typing stays correct. (Adding
  // @react-three/fiber augments the global JSX namespace, which otherwise makes
  // a bare React.ElementType infer children as `never`.)
  const Comp = Tag as unknown as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }>;
  return (
    <Comp
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? "in" : ""} ${className}`}
    >
      {children}
    </Comp>
  );
}
