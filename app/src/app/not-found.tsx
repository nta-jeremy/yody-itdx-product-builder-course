import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-eyebrow font-mono uppercase tracking-[0.32em] text-muted-foreground">
          404
        </span>
        <h1 className="text-h1 font-bold text-foreground">Không tìm thấy trang</h1>
        <p className="text-body text-muted-foreground max-w-prose">
          Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}