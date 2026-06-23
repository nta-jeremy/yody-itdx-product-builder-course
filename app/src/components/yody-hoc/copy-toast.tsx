import { CheckIcon } from "./icons";

interface CopyToastProps {
  show: boolean;
}

export function CopyToast({ show }: CopyToastProps) {
  if (!show) return null;
  return (
    <div
      className="fixed bottom-8 left-1/2 z-80 flex -translate-x-1/2 items-center gap-2 rounded-full bg-fg-1 px-5 py-2.75 font-[family-name:var(--font-body)] text-[13px] font-semibold text-white shadow-lg animate-enter-up"
    >
      <CheckIcon className="size-3.75" style={{ color: "var(--mint)" }} />
      Đã sao chép mã
    </div>
  );
}