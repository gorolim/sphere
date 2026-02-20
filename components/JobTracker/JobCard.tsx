"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { hideJob } from "@/app/actions/job";

export type JobType = {
  id: string;
  title: string;
  company: string;
  url: string;
  keywords: string[];
  status: string;
};

interface JobCardProps {
  job: JobType;
  onHide: (id: string) => void;
}

export function JobCard({ job, onHide }: JobCardProps) {
  const [isHiding, setIsHiding] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: {
      type: "Job",
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleHide = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent drag
    setIsHiding(true);
    await hideJob(job.id);
    onHide(job.id);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-engine-dark border-2 border-neon-cyan/50 rounded-lg p-4 mb-3 h-[120px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-engine-dark border border-white/10 hover:border-white/30 rounded-lg p-4 mb-3 group flex flex-col gap-3 transition-opacity ${
        isHiding ? "opacity-0 scale-95" : "opacity-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 max-w-[85%]">
            <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-500 hover:text-white mt-1 pt-0.5"
            >
            <GripVertical size={16} />
            </div>
            <div>
                <h4 className="font-bold text-sm text-white leading-tight mb-1">
                {job.title}
                </h4>
                <p className="text-xs text-gray-400 font-mono">{job.company}</p>
            </div>
        </div>
        <button
          onClick={handleHide}
          className="text-gray-500 hover:text-red-500 transition-colors bg-white/5 hover:bg-red-500/10 p-1.5 rounded"
          title="Hide this job"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mt-1">
        {job.keywords.map((kw, i) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-[10px] rounded uppercase font-mono"
          >
            {kw}
          </span>
        ))}
      </div>

      <div className="mt-2 pt-3 border-t border-white/5 flex justify-end">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={(e) => e.stopPropagation()} // Important! Allows click instead of drag
          className="flex items-center gap-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded transition-colors"
        >
          <ExternalLink size={12} />
          Apply Now
        </a>
      </div>
    </div>
  );
}
