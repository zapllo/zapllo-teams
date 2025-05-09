'use client'

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { X, Check, Search, Filter, Tag, Users, RefreshCw, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from '../ui/tabs3';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface FilterModalProps {
    isOpen: boolean;
    closeModal: () => void;
    categories: { _id: string; name: string; imgSrc: string }[];
    users: { _id: string; firstName: string; lastName: string; email: string; }[];
    applyFilters: (filters: any) => void;
    initialSelectedCategories: string[];
    initialSelectedUsers: string[];
    initialSelectedFrequency: string[];
    initialSelectedPriority: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    closeModal,
    categories,
    users,
    applyFilters,
    initialSelectedCategories,
    initialSelectedFrequency,
    initialSelectedPriority,
    initialSelectedUsers
}) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);
    const [selectedUsers, setSelectedUsers] = useState<string[]>(initialSelectedUsers);
    const [selectedFrequency, setSelectedFrequency] = useState<string[]>(initialSelectedFrequency);
    const [selectedPriority, setSelectedPriority] = useState<string[]>(initialSelectedPriority);
    const [activeTab, setActiveTab] = useState<string>('category');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Reset selections when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedCategories(initialSelectedCategories);
            setSelectedUsers(initialSelectedUsers);
            setSelectedFrequency(initialSelectedFrequency);
            setSelectedPriority(initialSelectedPriority);
        }
    }, [isOpen, initialSelectedCategories, initialSelectedUsers, initialSelectedFrequency, initialSelectedPriority]);

    const toggleSelection = (selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleApplyFilters = () => {
        applyFilters({
            categories: selectedCategories,
            users: selectedUsers,
            frequency: selectedFrequency,
            priority: selectedPriority,
        });
        closeModal();
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSelectedUsers([]);
        setSelectedFrequency([]);
        setSelectedPriority([]);
    };

    // Get count of total selected filters
    const getTotalSelectedCount = () => {
        return selectedCategories.length + selectedUsers.length + selectedFrequency.length + selectedPriority.length;
    };

    // Get selection count for each tab
    const getCategoryCount = () => selectedCategories.length;
    const getUsersCount = () => selectedUsers.length;
    const getFrequencyCount = () => selectedFrequency.length;
    const getPriorityCount = () => selectedPriority.length;

    // Filter items based on search
    const getFilteredCategories = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return categories.filter(category =>
            category.name.toLowerCase().includes(lowercasedSearchTerm)
        );
    };

    const getFilteredUsers = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowercasedSearchTerm) ||
            user.email.toLowerCase().includes(lowercasedSearchTerm)
        );
    };

    const getFilteredFrequencies = () => {
        const frequencies = ['Daily', 'Weekly', 'Monthly', 'Once'];
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return frequencies.filter(frequency =>
            frequency.toLowerCase().includes(lowercasedSearchTerm)
        );
    };

    const getFilteredPriorities = () => {
        const priorities = ['High', 'Medium', 'Low'];
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return priorities.filter(priority =>
            priority.toLowerCase().includes(lowercasedSearchTerm)
        );
    };

    // Priority color mappings
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Medium':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Low':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className=" p-6 m-auto h-fit max-h-screen overflow-y-scroll gap-0">
                <DialogHeader className=" ">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter Tasks
                            {getTotalSelectedCount() > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {getTotalSelectedCount()}
                                </Badge>
                            )}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeModal}
                            className="rounded-full h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <Tabs
                    defaultValue="category"
                    value={activeTab}
                    onValueChange={(value) => {
                        setActiveTab(value);
                        setSearchTerm('');
                    }}
                    className="w-full"
                >
                    <div className="flex  pt-4 g">
                        <TabsList className="gap-2 text-xs">
                            <TabsTrigger
                                value="category"
                                className="gap-1"
                            >
                                {/* <Tag className="h-4 w-4" /> */}
                                Categories
                                {getCategoryCount() > 0 && (
                                    <Badge className="ml-1">
                                        {getCategoryCount()}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="users"
                                className=""
                            >
                                {/* <Users className="h-4 w-4" /> */}
                                Assigned By
                                {getUsersCount() > 0 && (
                                    <Badge className="ml-1">
                                        {getUsersCount()}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="frequency"
                                className=""
                            >
                                {/* <RefreshCw className="h-4 w-4" /> */}
                                Frequency
                                {getFrequencyCount() > 0 && (
                                    <Badge className="ml-1">
                                        {getFrequencyCount()}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="priority"
                                className=""
                            >
                                {/* <AlertTriangle className="h-4 w-4" /> */}
                                Priority
                                {getPriorityCount() > 0 && (
                                    <Badge className="ml-1">
                                        {getPriorityCount()}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="mt-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <ScrollArea className="h-[300px] pr-4">
                            <TabsContent value="category" className="mt-0 space-y-2">
                                {getFilteredCategories().length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No categories match your search
                                    </div>
                                ) : (
                                    getFilteredCategories().map(category => (
                                        <div key={category._id} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                                            <Checkbox
                                                id={`category-${category._id}`}
                                                checked={selectedCategories.includes(category._id)}
                                                onCheckedChange={() => toggleSelection(selectedCategories, setSelectedCategories, category._id)}
                                            />
                                            <div className="flex items-center space-x-3 flex-1">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {category.name.slice(0, 1)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Label
                                                    htmlFor={`category-${category._id}`}
                                                    className="flex-1 cursor-pointer font-medium"
                                                >
                                                    {category.name}
                                                </Label>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="users" className="mt-0 space-y-2">
                                {getFilteredUsers().length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No users match your search
                                    </div>
                                ) : (
                                    getFilteredUsers().map(user => (
                                        <div key={user._id} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                                            <Checkbox
                                                id={`user-${user._id}`}
                                                checked={selectedUsers.includes(user._id)}
                                                onCheckedChange={() => toggleSelection(selectedUsers, setSelectedUsers, user._id)}
                                            />
                                            <div className="flex items-center space-x-3 flex-1">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary text-white">
                                                        {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`user-${user._id}`}
                                                        className="flex-1 cursor-pointer font-medium"
                                                    >
                                                        {user.firstName} {user.lastName}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="frequency" className="mt-0 space-y-2">
                                {getFilteredFrequencies().length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No frequencies match your search
                                    </div>
                                ) : (
                                    getFilteredFrequencies().map(frequency => (
                                        <div key={frequency} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                                            <Checkbox
                                                id={`frequency-${frequency}`}
                                                checked={selectedFrequency.includes(frequency)}
                                                onCheckedChange={() => toggleSelection(selectedFrequency, setSelectedFrequency, frequency)}
                                            />
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <RefreshCw className="h-4 w-4 text-primary" />
                                                </div>
                                                <Label
                                                    htmlFor={`frequency-${frequency}`}
                                                    className="flex-1 cursor-pointer font-medium"
                                                >
                                                    {frequency}
                                                </Label>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="priority" className="mt-0 space-y-2">
                                {getFilteredPriorities().length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No priorities match your search
                                    </div>
                                ) : (
                                    getFilteredPriorities().map(priority => (
                                        <div key={priority} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                                            <Checkbox
                                                id={`priority-${priority}`}
                                                checked={selectedPriority.includes(priority)}
                                                onCheckedChange={() => toggleSelection(selectedPriority, setSelectedPriority, priority)}
                                            />
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center",
                                                    getPriorityColor(priority)
                                                )}>
                                                    <AlertTriangle className="h-4 w-4" />
                                                </div>
                                                <Label
                                                    htmlFor={`priority-${priority}`}
                                                    className="flex-1 cursor-pointer font-medium"
                                                >
                                                    {priority}
                                                </Label>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </Tabs>

                <DialogFooter className="px-6 py-4 border-t flex-row justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            disabled={getTotalSelectedCount() === 0}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>

                        {getTotalSelectedCount() > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {getTotalSelectedCount()} filter{getTotalSelectedCount() !== 1 ? 's' : ''} selected
                            </Badge>
                        )}
                    </div>

                    <Button
                        onClick={handleApplyFilters}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Apply Filters
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FilterModal;
