export function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-secondary text-secondary-foreground',
        secondary: 'bg-muted text-muted-foreground',
        success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        destructive: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        outline: 'border text-foreground',
    };

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

export function Card({ children, className = '' }) {
    return (
        <div className={`rounded-lg border bg-card ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`border-b px-4 py-3 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-sm font-semibold ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
}

export function Button({ children, variant = 'default', size = 'default', className = '', disabled, ...props }) {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
        default: 'bg-foreground text-background hover:bg-foreground/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        default: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-sm',
        icon: 'h-9 w-9',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export function Separator({ className = '' }) {
    return <div className={`h-px bg-border ${className}`} />;
}

export function Input({ className = '', ...props }) {
    return (
        <input
            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
}

export function Label({ children, className = '' }) {
    return (
        <label className={`text-sm font-medium ${className}`}>
            {children}
        </label>
    );
}

export function Textarea({ className = '', ...props }) {
    return (
        <textarea
            className={`flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
}

export function Select({ children, className = '', ...props }) {
    return (
        <select
            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function StatusBadge({ status }) {
    const statusConfig = {
        pending: { label: 'Pending', color: 'bg-secondary text-secondary-foreground' },
        processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        ready: { label: 'Ready', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    };

    const config = statusConfig[status] || { label: status, color: 'bg-secondary text-secondary-foreground' };
    const dotColors = {
        pending: 'bg-muted-foreground',
        processing: 'bg-blue-500',
        ready: 'bg-amber-500',
        delivered: 'bg-emerald-500',
        cancelled: 'bg-red-500',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status] || 'bg-muted-foreground'}`} />
            {config.label}
        </span>
    );
}

export function PaymentBadge({ status }) {
    const config = {
        unpaid: { label: 'Unpaid', color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
        partial: { label: 'Partial', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        paid: { label: 'Paid', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    };

    const { label, color } = config[status] || { label: status, color: 'bg-muted text-muted-foreground' };

    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
            {label}
        </span>
    );
}
