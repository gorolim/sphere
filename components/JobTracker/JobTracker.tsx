"use client";

import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { JobType } from "./JobCard";
import { updateJobStatus } from "@/app/actions/job";

export const COLUMNS = [
  { id: "discovered", title: "Discovered" },
  { id: "toApply", title: "To Apply" },
  { id: "applied", title: "Applied" },
  { id: "assessment", title: "Assessment / Test" },
  { id: "interviewing", title: "Waiting / Interviewing" },
  { id: "rejected", title: "Rejected / Offer" },
];

interface JobTrackerProps {
  initialJobs: JobType[];
}

export function JobTracker({ initialJobs }: JobTrackerProps) {
  const [jobs, setJobs] = useState<JobType[]>(initialJobs);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5 // drag delay so click works
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleHideJob = (id: string) => {
    setJobs((items) => items.filter((j) => j.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Is it dragging over another card or a column?
    const isActiveAJob = active.data.current?.type === "Job";
    const isOverAJob = over.data.current?.type === "Job";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveAJob) return;

    // Moving a job over another job
    if (isActiveAJob && isOverAJob) {
      setJobs((prev) => {
        const activeIndex = prev.findIndex((j) => j.id === activeId);
        const overIndex = prev.findIndex((j) => j.id === overId);

        if (prev[activeIndex].status !== prev[overIndex].status) {
            const newJobs = [...prev];
            newJobs[activeIndex].status = prev[overIndex].status;
            return arrayMove(newJobs, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    // Moving a job over an empty column area
    if (isActiveAJob && isOverAColumn) {
      setJobs((prev) => {
        const activeIndex = prev.findIndex((j) => j.id === activeId);
        const newJobs = [...prev];
        newJobs[activeIndex].status = overId as string;
        return arrayMove(newJobs, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;
    
    const jobId = active.id as string;
    const job = jobs.find(j => j.id === jobId);
    
    if (job) {
        // Find which column it's in now
        // if over is a job, the status was updated in DragOver. we just persist.
        // if over is a column, the status was also updated.

        // We do a "fire and forget" server action
        await updateJobStatus(jobId, job.status);
    }
  };

  return (
    <div className="w-full h-full min-h-[70vh] flex overflow-x-auto pb-8 gap-6 pr-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            jobs={jobs.filter((j) => j.status === col.id)}
            onHide={handleHideJob}
          />
        ))}
      </DndContext>
    </div>
  );
}
