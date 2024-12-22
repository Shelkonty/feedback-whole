import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const avatarVariants = cva(
    'inline-flex items-center justify-center rounded-full bg-gray-100',
    {
        variants: {
            size: {
                sm: 'h-8 w-8',
                md: 'h-10 w-10',
                lg: 'h-12 w-12',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    }
);

interface AvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof avatarVariants> {
    src?: string;
    alt?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, size, src, alt, ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false);

        if (src && !hasError) {
            return (
                <div
                    ref={ref}
                    className={cn(avatarVariants({ size, className }))}
                    {...props}
                >
                    <img
                        src={src}
                        alt={alt}
                        className="h-full w-full rounded-full object-cover"
                        onError={() => setHasError(true)}
                    />
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className={cn(avatarVariants({ size, className }))}
                {...props}
            >
        <span className="font-medium text-gray-600">
          {alt ? alt[0].toUpperCase() : '?'}
        </span>
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export default Avatar;