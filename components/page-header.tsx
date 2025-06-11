type PageHeaderProps = {
    title: string;
    subtitle?: string;
  };
  
  export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    );
  }