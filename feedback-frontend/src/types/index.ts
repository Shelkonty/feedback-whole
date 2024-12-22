export interface Feedback {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    statusId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    status?: Status;
    author?: User;
    _count?: {
        votes: number;
    };
}

export interface User {
    id: number;
    email: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Status {
    id: number;
    name: string;
}

export interface PaginationResponse<T> {
    data: T[];
    pagination: {
        total: number;
        pages: number;
        currentPage: number;
    };
}
