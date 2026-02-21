import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/graph", label: "Dominance Graph" },
  { to: "/head-to-head", label: "Head to Head" },
];

export default function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r border-slate-700 bg-slate-800">
      <div className="flex h-14 items-center border-b border-slate-700 px-4">
        <span className="text-xl">&#9917;</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
