"use client"

import { useEffect, useRef } from "react"
import type { Workout } from "@/types/workout"
import { formatDate } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface WorkoutChartProps {
  workouts: Workout[]
  dataKey: "sets" | "reps" | "duration"
}

export function WorkoutChart({ workouts, dataKey }: WorkoutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || workouts.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Group workouts by exercise name
    const exerciseGroups: Record<string, Workout[]> = {}
    sortedWorkouts.forEach((workout) => {
      if (!exerciseGroups[workout.exerciseName]) {
        exerciseGroups[workout.exerciseName] = []
      }
      exerciseGroups[workout.exerciseName].push(workout)
    })

    // Get unique dates for x-axis
    const uniqueDates = Array.from(new Set(sortedWorkouts.map((w) => formatDate(w.date))))

    // Chart dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#d1d5db" // gray-300
    ctx.stroke()

    // No data to display
    if (uniqueDates.length === 0) {
      ctx.font = "14px sans-serif"
      ctx.fillStyle = "#6b7280" // gray-500
      ctx.textAlign = "center"
      ctx.fillText("No data to display", width / 2, height / 2)
      return
    }

    // Find max value for y-axis
    const maxValue = Math.max(...sortedWorkouts.map((w) => w[dataKey])) * 1.2

    // Draw y-axis labels
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#6b7280" // gray-500
    ctx.textAlign = "right"

    const yAxisSteps = 5
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = Math.round((maxValue / yAxisSteps) * i)
      const y = height - padding - (i / yAxisSteps) * chartHeight

      ctx.fillText(value.toString(), padding - 10, y + 4)

      // Draw horizontal grid line
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.strokeStyle = "#e5e7eb" // gray-200
      ctx.stroke()
    }

    // Draw x-axis labels (dates)
    ctx.textAlign = "center"
    const xStep = chartWidth / (uniqueDates.length - 1 || 1)

    uniqueDates.forEach((date, i) => {
      const x = padding + i * xStep
      ctx.fillText(date, x, height - padding + 20)
    })

    // Draw data lines for each exercise
    const colors = [
      "#3b82f6", // blue-500
      "#ef4444", // red-500
      "#10b981", // emerald-500
      "#f59e0b", // amber-500
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
    ]

    // Draw legend
    const legendX = padding
    const legendY = padding - 10
    let legendOffsetX = 0

    Object.keys(exerciseGroups).forEach((exercise, index) => {
      const color = colors[index % colors.length]

      // Draw legend item
      ctx.fillStyle = color
      ctx.fillRect(legendX + legendOffsetX, legendY, 15, 10)

      ctx.fillStyle = "#6b7280" // gray-500
      ctx.textAlign = "left"
      ctx.fillText(exercise, legendX + legendOffsetX + 20, legendY + 8)

      legendOffsetX += ctx.measureText(exercise).width + 40

      // Get data points for this exercise
      const exerciseData = exerciseGroups[exercise]

      // Create a map of date to value for this exercise
      const dateValueMap: Record<string, number> = {}
      exerciseData.forEach((workout) => {
        const date = formatDate(workout.date)
        dateValueMap[date] = workout[dataKey]
      })

      // Draw the line
      ctx.beginPath()

      uniqueDates.forEach((date, i) => {
        if (dateValueMap[date] !== undefined) {
          const x = padding + i * xStep
          const y = height - padding - (dateValueMap[date] / maxValue) * chartHeight

          if (i === 0 || dateValueMap[uniqueDates[i - 1]] === undefined) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      })

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw data points
      uniqueDates.forEach((date, i) => {
        if (dateValueMap[date] !== undefined) {
          const x = padding + i * xStep
          const y = height - padding - (dateValueMap[date] / maxValue) * chartHeight

          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })
    })
  }, [workouts, dataKey])

  if (workouts.length === 0) {
    return (
      <Card className="flex items-center justify-center p-6 text-muted-foreground">
        No workout data available to display
      </Card>
    )
  }

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full"></canvas>
    </div>
  )
}

