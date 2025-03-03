"use client"

import type { Workout } from "@/types/workout"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { WorkoutCard } from "@/components/workout-card"
import { LayoutGrid, List } from "lucide-react"

interface WorkoutListProps {
  workouts: Workout[]
  onEdit: (workout: Workout) => void
  onDelete: (id: string) => void
}

export function WorkoutList({ workouts, onEdit, onDelete }: WorkoutListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list")
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No workouts found. Start by adding a new workout!</div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={toggleViewMode} className="flex items-center gap-1">
          {viewMode === "list" ? (
            <>
              <LayoutGrid className="h-4 w-4" />
              <span>Grid View</span>
            </>
          ) : (
            <>
              <List className="h-4 w-4" />
              <span>List View</span>
            </>
          )}
        </Button>
      </div>

      {viewMode === "list" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead className="text-center">Sets</TableHead>
                <TableHead className="text-center">Reps</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workouts.map((workout) => (
                <TableRow key={workout.id} className="group">
                  <TableCell className="font-medium">{workout.exerciseName}</TableCell>
                  <TableCell className="text-center">{workout.sets}</TableCell>
                  <TableCell className="text-center">{workout.reps}</TableCell>
                  <TableCell className="text-center">{workout.duration} min</TableCell>
                  <TableCell>{formatDate(workout.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(workout)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this workout?")) {
                            onDelete(workout.id)
                          }
                        }}
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="relative group">
              <WorkoutCard workout={workout} />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => onEdit(workout)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this workout?")) {
                      onDelete(workout.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

