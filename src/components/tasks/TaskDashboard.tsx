import React, { useState } from 'react';
import TaskList from './TaskList';
import AllTasksDashboard from './AllTasksDashboard';
import TaskTemplatesView from './TaskTemplatesView';
import TaskDirectoryView from './TaskDirectoryView';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskDashboardProps {
  tasks: any[];
  currentUser: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTaskDelete: (id: string) => Promise<boolean | void>;
  onTaskUpdate: () => Promise<boolean | void>;
}

export default function TaskDashboard({
  tasks,
  currentUser,
  activeTab,
  setActiveTab,
  onTaskDelete,
  onTaskUpdate
}: TaskDashboardProps) {
  const [selectedUserId, setSelectedUserId] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'progress' | 'complete' | 'reopen' | null>(null);
  const [statusComment, setStatusComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Clear selected user when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'allTasks') {
      setSelectedUserId(null);
      setSelectedCategory(null);
    }
  };

  // Handler for employee card click in dashboard
  const handleUserSelect = (user: any) => {
    console.log('Selected user:', user);
    setSelectedUserId(user);
    setActiveTab('allTasks');
  };

  // Handler for category card click in dashboard
  const handleCategorySelect = (category: any) => {
  console.log('Selected category:', category);
  setSelectedCategory(category);
  setActiveTab('allTasks');
};
// Handle task status update
const handleTaskStatusUpdate = (task: any, action: 'progress' | 'complete' | 'reopen'): Promise<void> => {
  return new Promise(resolve => {
    setSelectedTask(task);
    setStatusAction(action);
    setStatusComment('');
    setIsStatusDialogOpen(true);
    resolve();
  });
};


  // Handle task deletion
  const handleTaskDelete = (task: any): Promise<void> => {
    return new Promise((resolve) => {
      setSelectedTask(task);
      setIsDeleteDialogOpen(true);
      resolve();
    });
  };

  // Submit task status update
  const submitStatusUpdate = async () => {
    if (!statusComment.trim()) {
      toast.error("Please add a comment before updating the task");
      return;
    }

    if (!selectedTask || !statusAction) return;

    setIsSubmitting(true);

    try {
      const newStatus =
        statusAction === 'progress' ? 'In Progress' :
          statusAction === 'complete' ? 'Completed' :
            statusAction === 'reopen' ? 'Pending' : null;

      if (!newStatus) throw new Error("Invalid status action");

      const response = await fetch('/api/tasks/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTask._id,
          status: newStatus,
          comment: statusComment,
          userName: `${currentUser.firstName} `,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task status');
      }

      // Show success message and close dialog
      toast.success(`Task ${newStatus === 'Pending' ? 'reopened' : `marked as ${newStatus}`} successfully`);
      setIsStatusDialogOpen(false);

      // Refresh the task list
      onTaskUpdate();

    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast.error(error.message || 'An error occurred while updating the task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm task deletion
  const confirmDeleteTask = async () => {
    if (!selectedTask) return;

    setIsSubmitting(true);

    try {
      await onTaskDelete(selectedTask._id);
      toast.success('Task deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };
const handleTaskListUpdate = (): Promise<void> => {
  return onTaskUpdate().then(() => {});
};
  // Render the appropriate content based on the active tab
  return (
    <div className="p-6 max-w- mx-auto w-full">
      {activeTab === 'all' && (
        <AllTasksDashboard
          tasks={tasks}
          currentUser={currentUser}
          setActiveTab={handleTabChange}
          setSelectedUserId={handleUserSelect}
          setSelectedCategory={handleCategorySelect}
        />
      )}

      {activeTab === 'myTasks' && (
        <TaskList
          tasks={tasks}
          currentUser={currentUser}
          listType="myTasks"
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskListUpdate}
          onTaskStatusChange={handleTaskStatusUpdate}
        />
      )}

      {activeTab === 'delegatedTasks' && (
        <TaskList
          tasks={tasks}
          currentUser={currentUser}
          listType="delegatedTasks"
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskListUpdate}
          onTaskStatusChange={handleTaskStatusUpdate}
        />
      )}

      {activeTab === 'allTasks' && (
        <div >
          {/* Applied filters display for user/category */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUserId && (
              <Badge className="px-3 py-1.5 bg-primary text-white flex items-center gap-1">
                Assigned To: {selectedUserId.firstName} {selectedUserId.lastName}
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="ml-2 hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedCategory && (
              <Badge className="px-3 py-1.5 bg-primary text-white flex items-center gap-1">
                Category: {selectedCategory.name}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          <TaskList
            tasks={tasks}
            currentUser={currentUser}
            listType="allTasks"
            selectedUserId={selectedUserId}
            selectedCategory={selectedCategory}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={handleTaskListUpdate}
            onTaskStatusChange={handleTaskStatusUpdate}
            setSelectedUserId={setSelectedUserId}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      )}
      {activeTab === 'taskTemplates' && (
        <TaskTemplatesView />
      )}

      {activeTab === 'taskDirectory' && (
        <TaskDirectoryView />
      )}

      {/* Task Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="p-6 z-[100]">
          <DialogTitle>
            {statusAction === 'progress' ? 'Mark as In Progress' :
              statusAction === 'complete' ? 'Mark as Completed' :
                'Reopen Task'}
          </DialogTitle>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Add a comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter your comment here..."
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button
              onClick={submitStatusUpdate}
              disabled={isSubmitting}
              className={cn(
                statusAction === 'progress' ? 'bg-orange-600 hover:bg-orange-700' :
                  statusAction === 'complete' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-blue-600 hover:bg-blue-700'
              )}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="p-6">
          <DialogTitle>Delete Task</DialogTitle>
          <p className="py-4">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDeleteTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
