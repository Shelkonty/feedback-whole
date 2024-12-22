import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Settings, User, Activity, Plus, Bell, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import Avatar from "../ui/Avatar.tsx";

const Header = () => {
    const { user, logout, updateProfile, deleteAccount } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(profileData);
            setIsSettingsOpen(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            logout();
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    return (
        <header className="w-full border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Feedback App</h1>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar src={user?.avatar} alt={user?.email} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user?.name || user?.email}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Account settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Activity className="mr-2 h-4 w-4" />
                            <span>My activity</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Create board</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Notifications</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete account</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Account settings</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                            <input
                                type="text"
                                value={profileData.avatar || ''}
                                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <Button type="submit" className="w-full">Save changes</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
};

export default Header;