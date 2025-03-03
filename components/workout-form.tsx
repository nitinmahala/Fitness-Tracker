"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Workout } from "@/types/workout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Save, X } from "lucide-react"

interface WorkoutFormProps {
  onSubmit: (workout: Omit<Workout, "id" | "date"> | Workout) => void
  initialData?: Workout | null
  onCancel?: () => void
}

export function WorkoutForm({ onSubmit, initialData, onCancel }: WorkoutFormProps) {
  const [formData, setFormData] = useState({
    exerciseName: "",
    sets: 0,
    reps: 0,
    duration: 0,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        exerciseName: initialData.exerciseName,
        sets: initialData.sets,
        reps: initialData.reps,
        duration: initialData.duration,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "exerciseName" ? value : Number.parseInt(value) || 0,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.exerciseName.trim()) {
      alert("Please enter an exercise name")
      return
    }

    if (initialData) {
      onSubmit({
        ...formData,
        id: initialData.id,
        date: initialData.date,
      })
    } else {
      onSubmit(formData)
    }

    // Reset form if not editing
    if (!initialData) {
      setFormData({
        exerciseName: "",
        sets: 0,
        reps: 0,
        duration: 0,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exerciseName">Exercise Name</Label>
        <Input
          id="exerciseName"
          name="exerciseName"
          value={formData.exerciseName}
          onChange={handleChange}
          placeholder="e.g., Bench Press, Squats"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sets">Sets</Label>
        <Input id="sets" name="sets" type="number" min="0" value={formData.sets} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reps">Reps</Label>
        <Input id="reps" name="reps" type="number" min="0" value={formData.reps} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          min="0"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="w-full">
          {initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {initialData ? "Update Workout" : "Add Workout"}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

