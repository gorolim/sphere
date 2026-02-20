"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { JobType, JobCard } from "./JobCard";

interface KanbanColumnProps {
  id: string; // "discovered", "toApply", etc
  title: string;
  jobs: JobType[];
  onHide: (id: string) => void;
}

export function KanbanColumn({ id, title, jobs, onHide }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
    },
  });

  return (
    <div className="flex flex-col bg-engine-darker border border-white/5 rounded-xl w-[320px] min-w-[320px] h-full max-h-full overflow-hidden shrink-0">
      <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-engine-darker/90 backdrop-blur z-10">
        <h3 className="font-display font-bold text-white uppercase text-sm">{title}</h3>
        <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full font-mono">
          {jobs.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto transition-colors ${
          isOver ? "bg-white/5" : ""
        }`}
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onHide={onHide} />
          ))}
          {jobs.length === 0 && (
            <div className="h-24 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-500 text-sm font-mono opacity-50">
              Drop here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
