interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    size = 'md',
    className = '',
    fallback = 'U',
}) => {
    return (
        <div className={`avatar avatar-${size} ${className}`}>
            {src ? <img src={src} alt={alt} /> : <div className="avatar_fallback">{fallback}</div>}
        </div>
    )
}