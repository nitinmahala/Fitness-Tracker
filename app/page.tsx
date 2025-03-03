"use client"

import { useState, useEffect } from "react"
import { WorkoutForm } from "@/components/workout-form"
import { WorkoutList } from "@/components/workout-list"
import { WorkoutChart } from "@/components/workout-chart"
import { FilterControls } from "@/components/filter-controls"
import { ExerciseTimer } from "@/components/exercise-timer"
import { ExerciseGuide } from "@/components/exercise-guide"
import type { Workout } from "@/types/workout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([])
  const [filter, setFilter] = useState({ exerciseName: "", startDate: "", endDate: "" })
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)

  // Load workouts from localStorage on initial render
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workouts")
    if (savedWorkouts) {
      const parsedWorkouts = JSON.parse(savedWorkouts)
      setWorkouts(parsedWorkouts)
      setFilteredWorkouts(parsedWorkouts)
    }
  }, [])

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts))
    applyFilters()
  }, [workouts, filter])

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters()
  }, [filter])

  const applyFilters = () => {
    let filtered = [...workouts]

    if (filter.exerciseName) {
      filtered = filtered.filter((workout) =>
        workout.exerciseName.toLowerCase().includes(filter.exerciseName.toLowerCase()),
      )
    }

    if (filter.startDate) {
      filtered = filtered.filter((workout) => new Date(workout.date) >= new Date(filter.startDate))
    }

    if (filter.endDate) {
      filtered = filtered.filter((workout) => new Date(workout.date) <= new Date(filter.endDate))
    }

    setFilteredWorkouts(filtered)
  }

  const addWorkout = (workout: Omit<Workout, "id" | "date">) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setWorkouts([...workouts, newWorkout])
  }

  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(workouts.map((workout) => (workout.id === updatedWorkout.id ? updatedWorkout : workout)))
    setEditingWorkout(null)
  }

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id))
  }

  return (
    <>
      <main className="container mx-auto py-6 px-4 md:px-6 min-h-[calc(100vh-80px)]">
        <Card className="mb-8 overflow-hidden fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 z-10"></div>
            <img src="/images/fitness-bg.svg" alt="Fitness background" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 z-20 flex items-center p-6">
              <div>
                <CardTitle className="text-3xl font-bold text-white drop-shadow-md">Fitness Tracker</CardTitle>
                <CardDescription className="text-white/90 text-lg max-w-md mt-2 drop-shadow-md">
                  Track your workouts, monitor progress, and achieve your fitness goals
                </CardDescription>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card className="card-hover-effect fade-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <img src="/images/workout-icon.svg" alt="Workout log" className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle>Your Workouts</CardTitle>
                  <CardDescription>View, edit, and delete your logged workouts</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <FilterControls filter={filter} setFilter={setFilter} />
                <WorkoutList workouts={filteredWorkouts} onEdit={setEditingWorkout} onDelete={deleteWorkout} />
              </CardContent>
            </Card>

            <Card className="card-hover-effect fade-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle>Exercise Guide</CardTitle>
                <CardDescription>Form tips and rest time recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ExerciseGuide />
              </CardContent>
            </Card>

            <Card className="card-hover-effect fade-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <img src="/images/chart-icon.svg" alt="Progress chart" className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle>Workout Progress</CardTitle>
                  <CardDescription>Visualize your workout history</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sets">
                  <TabsList className="mb-4">
                    <TabsTrigger value="sets">Sets</TabsTrigger>
                    <TabsTrigger value="reps">Reps</TabsTrigger>
                    <TabsTrigger value="duration">Duration</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sets">
                    <WorkoutChart workouts={workouts} dataKey="sets" />
                  </TabsContent>
                  <TabsContent value="reps">
                    <WorkoutChart workouts={workouts} dataKey="reps" />
                  </TabsContent>
                  <TabsContent value="duration">
                    <WorkoutChart workouts={workouts} dataKey="duration" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6 card-hover-effect fade-in" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <img src="/images/add-workout-icon.svg" alt="Add workout" className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle>{editingWorkout ? "Edit Workout" : "Add Workout"}</CardTitle>
                  <CardDescription>
                    {editingWorkout ? "Update your workout details" : "Log a new workout"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <WorkoutForm
                  onSubmit={editingWorkout ? updateWorkout : addWorkout}
                  initialData={editingWorkout}
                  onCancel={editingWorkout ? () => setEditingWorkout(null) : undefined}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Exercise Timer - Floating Component */}
      <ExerciseTimer />

      <Footer />
    </>
  )
}

