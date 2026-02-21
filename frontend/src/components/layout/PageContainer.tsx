import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function PageContainer({ title, children }: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
      {children}
    </div>
  );
}
