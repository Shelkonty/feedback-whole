import React, { useState, useEffect } from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '../../ui/Button';
import Modal from '../../ui/Modal';
import { CreateFeedbackData } from '../../../services/feedbackService';
import axios from "axios";

interface CreateFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateFeedbackData) => Promise<void>;
}

const API_URL = 'http://localhost:3000/api';

const CreateFeedbackModal = ({
                                 isOpen,
                                 onClose,
                                 onSubmit
                             }: CreateFeedbackModalProps) => {
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateFeedbackData>({
        title: '',
        description: '',
        categoryId: '1',
        statusId: '1'
    });

    useEffect(() => {
        // Загрузка категорий и статусов при открытии модального окна
        const fetchData = async () => {
            try {
                const [categoriesRes, statusesRes] = await Promise.all([
                    axios.get(`${API_URL}/categories`),
                    axios.get(`${API_URL}/categories/statuses`)
                ]);
                setCategories(categoriesRes.data);
                setStatuses(statusesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Валидация
            if (!formData.title.trim() || !formData.description.trim()) {
                throw new Error('Please fill in all required fields');
            }

            console.log('Submitting form data:', formData); // Добавим логирование
            await onSubmit(formData);

            // Очистка формы после успешной отправки
            setFormData({
                title: '',
                description: '',
                categoryId: '1',
                statusId: '1'
            });

            onClose();
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Make a suggestion">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title *
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="A short, descriptive title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Please include only one suggestion per post"
                    />
                </div>

                {/* Category and Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id.toString()}>
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
                            value={formData.statusId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            {statuses.map(status => (
                                <option key={status.id} value={status.id.toString()}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Actions */}
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