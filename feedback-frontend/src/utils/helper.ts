import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;

    if (diff < 60) {
        return 'just now';
    } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < 604800) {
        const days = Math.floor(diff / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}