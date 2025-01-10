// DashboardAnalytics.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardAnalytics() {
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks/organization');
        setTasksData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Calculate analytics based on tasksData
  const tasksCompleted = tasksData.filter(task => task.status === 'Completed').length;
  const totalTasks = tasksData.length;
  const pendingTasks = totalTasks - tasksCompleted;
  
  // Calculate overdue tasks
  const overdueTasks = tasksData.filter(task => moment(task.dueDate).isBefore(moment()) && task.status !== 'Completed').length;
  
  // Calculate tasks due today
  const tasksDueToday = tasksData.filter(task => moment(task.dueDate).isSame(moment(), 'day')).length;
  
  // Calculate tasks by priority
  const highPriorityTasks = tasksData.filter(task => task.priority === 'High').length;
  const mediumPriorityTasks = tasksData.filter(task => task.priority === 'Medium').length;
  const lowPriorityTasks = tasksData.filter(task => task.priority === 'Low').length;
  
  // Calculate average days to complete tasks
  const completedTasks = tasksData.filter(task => task.status === 'Completed');
  const averageDaysToComplete = completedTasks.length
    ? completedTasks.reduce((acc, task) => acc + moment(task.dueDate).diff(moment(task.createdAt), 'days'), 0) / completedTasks.length
    : 0;

  // Calculate task categories and their counts
  // const categoryCounts = calculateCategoryCounts(tasksData);

  // Calculate percentages
  const completionPercentage = (tasksCompleted / totalTasks) * 100;
  const pendingPercentage = (pendingTasks / totalTasks) * 100;

  // Graph data preparation
  const last30Days = Array.from({ length: 30 }, (_, i) => moment().subtract(i, 'days').format('YYYY-MM-DD')).reverse();
  const tasksLast30Days = last30Days.map(date => tasksData.filter(task => moment(task.createdAt).isSame(date, 'day')).length);
  const completedLast30Days = last30Days.map(date => tasksData.filter(task => task.status === 'Completed' && moment(task.updatedAt).isSame(date, 'day')).length);

  const data = {
    labels: last30Days,
    datasets: [
      {
        label: 'Tasks Created',
        data: tasksLast30Days,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Tasks Completed',
        data: completedLast30Days,
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.2)',
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  };

  return (
    <div className="p-6 shadow-md bg-gray-900 rounded-md">
      <h2 className="text-sm bg-gray-800 rounded px-4 py-2 font-semibold mb-4">Task Analytics</h2>

      <div className="grid grid-cols-1 bg-gray-900 rounded px-4 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">Tasks Completed</h3>
          <p className="text-3xl font-bold text-green-600">{tasksCompleted}</p>
          <p className="text-sm text-gray-500">{completionPercentage.toFixed(2)}% of total tasks</p>
        </div>

        <div className="p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
          <p className="text-sm text-gray-500">{pendingPercentage.toFixed(2)}% of total tasks</p>
        </div>

        <div className="p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </div>
      </div>

      <div className="mt-6 px-4  rounded-md grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">Overdue Tasks</h3>
          <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
        </div>

        <div className="p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">Tasks Due Today</h3>
          <p className="text-3xl font-bold text-blue-600">{tasksDueToday}</p>
        </div>

        <div className="p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">Average Days to Complete</h3>
          <p className="text-3xl font-bold">{averageDaysToComplete.toFixed(2)}</p>
        </div>
      </div>

      {/* <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Task Categories</h3>
        <div className="grid grid-cols-1 bg-gray-900 rounded-md md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(categoryCounts).map(category => (
            <div key={category} className="p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2">{category}</h4>
              <p className="text-xl font-bold">{categoryCounts[category]}</p>
              <p className="text-sm text-gray-500">
                {((categoryCounts[category] / totalTasks) * 100).toFixed(2)}% of total tasks
              </p>
            </div>
          ))}
        </div>
      </div> */}

      <div className="mt-6">
        <h3 className="text-sm bg-gray-800 px-4 py-2 rounded font-semibold mb-2">Tasks by Priority</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900 rounded-md">
          <div className="p-4 rounded-md">
            <h4 className="text-md font-semibold mb-2">High Priority</h4>
            <p className="text-xl font-bold text-red-600">{highPriorityTasks}</p>
          </div>
          <div className="p-4 rounded-md">
            <h4 className="text-md font-semibold mb-2">Medium Priority</h4>
            <p className="text-xl font-bold text-yellow-600">{mediumPriorityTasks}</p>
          </div>
          <div className="p-4 rounded-md">
            <h4 className="text-md font-semibold mb-2">Low Priority</h4>
            <p className="text-xl font-bold text-green-600">{lowPriorityTasks}</p>
          </div>
        </div>
      </div>

      {/* <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Tasks Over Last 30 Days</h3>
        <Line data={data} options={{ maintainAspectRatio: false }} height={400} />
      </div> */}
    </div>
  );
}

// Helper function to calculate task category counts
function calculateCategoryCounts(tasksData: any[]): { [key: string]: number } {
  const categoryCounts: { [key: string]: number } = {};

  tasksData.forEach(task => {
    const category = task.categories.length ? task.categories.join(', ') : 'Uncategorized';
    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }
    categoryCounts[category]++;
  });

  return categoryCounts;
}
