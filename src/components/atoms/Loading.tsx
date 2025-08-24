

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export default function Loading({
    size = 'md',
    color = '#ffffff',
    className = ''
}: LoadingProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-11 h-11', // 45px equivalent
        lg: 'w-16 h-16'
    };

    return (
        <div
            className={`loader-bars ${sizeClasses[size]} ${className}`}
            style={{
                '--loader-color': color
            } as React.CSSProperties}
        />
    );
}