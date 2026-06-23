"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-h2 font-bold text-foreground">Đã xảy ra lỗi</h1>
        <p className="text-body text-muted-foreground max-w-prose">
          Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.
        </p>
        {error.digest && (
          <p className="text-caption font-mono text-muted-foreground">
            Mã: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset} variant="outline">
        Thử lại
      </Button>
    </div>
  );
}