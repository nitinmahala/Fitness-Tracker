"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, ChevronLeft, ChevronRight } from "lucide-react"

interface ExerciseGuide {
  name: string
  description: string
  tips: string[]
  restTime: number
}

const EXERCISE_GUIDES: ExerciseGuide[] = [
  {
    name: "Push-ups",
    description: "A compound exercise that primarily targets the chest, shoulders, and triceps.",
    tips: [
      "Keep your body in a straight line",
      "Position hands slightly wider than shoulders",
      "Lower your body until chest nearly touches the ground",
      "Keep your core tight throughout the movement",
    ],
    restTime: 90,
  },
  {
    name: "Squats",
    description: "A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.",
    tips: [
      "Keep feet shoulder-width apart",
      "Keep your chest up and back straight",
      "Lower until thighs are parallel to ground",
      "Drive through your heels to stand up",
    ],
    restTime: 120,
  },
  {
    name: "Plank",
    description: "An isometric core strengthening exercise that also engages the shoulders and back.",
    tips: [
      "Keep your body in a straight line",
      "Engage your core muscles",
      "Keep your neck neutral",
      "Don't let your hips sag",
    ],
    restTime: 60,
  },
]

export function ExerciseGuide() {
  const [currentGuide, setCurrentGuide] = useState(0)

  const nextGuide = () => {
    setCurrentGuide((current) => (current + 1) % EXERCISE_GUIDES.length)
  }

  const previousGuide = () => {
    setCurrentGuide((current) => (current === 0 ? EXERCISE_GUIDES.length - 1 : current - 1))
  }

  const guide = EXERCISE_GUIDES[currentGuide]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{guide.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousGuide} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextGuide} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{guide.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Form Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {guide.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">Recommended rest time: {guide.restTime} seconds</div>
        </div>
      </CardContent>
    </Card>
  )
}

