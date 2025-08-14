import { cn } from "@/lib/utils";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function HamburgerMenu({ isOpen, onClick, className }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-6 h-6 flex flex-col justify-center items-center transition-all duration-300 ease-in-out",
        "hover:scale-110 active:scale-95",
        className
      )}
      aria-label="Toggle menu"
    >
      <span
        className={cn(
          "block h-0.5 w-6 bg-foreground transition-all duration-300 ease-in-out",
          isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-6 bg-foreground transition-all duration-300 ease-in-out",
          isOpen ? "opacity-0" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-6 bg-foreground transition-all duration-300 ease-in-out",
          isOpen ? "-rotate-45 -translate-y-1" : "translate-y-2"
        )}
      />
    </button>
  );
}