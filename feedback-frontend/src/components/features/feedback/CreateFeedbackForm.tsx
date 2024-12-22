import React, { useState, useEffect } from 'react';
import { Paperclip } from 'lucide-react';
import Modal from '../../ui/Modal';
import {Button} from '../../ui/Button';
import { feedbackService } from '../../../services/feedbackService';

interface CreateFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Category {
    id: number;
    name: string;
}

interface Status {
    id: number;
    name: string;
}

const CreateFeedbackModal = ({ isOpen, onClose, onSuccess }: CreateFeedbackModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        statusId: ''
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, statusesData] = await Promise.all([
                    feedbackService.getCategories(),
                    feedbackService.getStatuses()
                ]);
                setCategories(categoriesData);
                setStatuses(statusesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await feedbackService.createFeedback(formData);
            onSuccess();
            onClose();
            setFormData({
                title: '',
                description: '',
                categoryId: '',
                statusId: ''
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Make a suggestion">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="A short, descriptive title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Details
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        placeholder="Please include only one suggestion per post"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            required
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="statusId" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="statusId"
                            name="statusId"
                            required
                            value={formData.statusId}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select status</option>
                            {statuses.map(status => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button
                        type="button"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach files
                    </button>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create post'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateFeedbackModal;