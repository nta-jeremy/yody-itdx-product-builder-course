import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-eyebrow font-mono uppercase tracking-[0.32em] text-muted-foreground">
          YODY Design System
        </span>
        <h1 className="text-h1 font-bold text-foreground">Product builder</h1>
        <p className="text-body text-muted-foreground max-w-prose">
          Next.js 16, Tailwind v4, shadcn/ui — branded with the YODY token foundation.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Boilerplate sẵn sàng</CardTitle>
            <Badge variant="live">LIVE</Badge>
          </div>
          <CardDescription>Surface: app · Token system: YODY navy #2a2b86</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </CardContent>
      </Card>
    </main>
  );
}