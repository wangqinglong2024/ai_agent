/**
 * 占位页面组件
 * 后续将被具体的业务页面替换
 */

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-12 sm:p-16 text-center max-w-lg space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
        <div className="flex items-center justify-center gap-2 pt-4">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            页面建设中
          </span>
        </div>
      </div>
    </div>
  );
}
