import { Card, CardContent } from "@/components/ui/card"
import type { Workout } from "@/types/workout"
import { formatDate } from "@/lib/utils"
import { Dumbbell, Clock, BarChart } from "lucide-react"

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-4">
          <h3 className="font-semibold text-lg truncate">{workout.exerciseName}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(workout.date)}</p>
        </div>
        <div className="p-4 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Dumbbell className="h-4 w-4" />
              <span className="text-xs">Sets</span>
            </div>
            <span className="font-medium">{workout.sets}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <BarChart className="h-4 w-4" />
              <span className="text-xs">Reps</span>
            </div>
            <span className="font-medium">{workout.reps}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Mins</span>
            </div>
            <span className="font-medium">{workout.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

