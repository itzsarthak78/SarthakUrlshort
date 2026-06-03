import { Link } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background/90">
      <div className="text-center bg-card p-8 rounded-2xl shadow-xl border border-border">
        <Link className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
        <p className="text-muted-foreground">Short link not found or expired.</p>
        <a href="/" className="inline-block mt-4 text-primary hover:underline">← Go home</a>
      </div>
    </div>
  );
}
