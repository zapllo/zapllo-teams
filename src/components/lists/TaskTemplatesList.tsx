"use client";

import { useEffect, useState } from "react";

interface TaskTemplate {
  _id: string;
  title: string;
  description: string;
  category: string;
  // ...include any other fields you expect
}


export default function TaskTemplatesList() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/taskTemplates");
      const data = await response.json();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Task Templates</h2>
      <div className="space-y-3">
        {templates.map((template) => (
          <div key={template._id} className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-white font-semibold">{template.title}</h3>
            <p className="text-gray-400">{template.description}</p>
            <span className="text-xs text-gray-300">Category: {template.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
