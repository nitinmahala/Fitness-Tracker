"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const TIMER_PRESETS = [
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
]

export function ExerciseTimer() {
  const [timeLeft, setTimeLeft] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(60)
  const [isMuted, setIsMuted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const audioRef = useRef<HTMLAudioElement>()

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("/sounds/beep.mp3")
    audioRef.current.preload = "auto"

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleTimerComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleTimerComplete = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (!isMuted && audioRef.current) {
      audioRef.current.play()
    }
  }

  const startTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(duration)
    }
    setIsRunning(true)
  }, [duration, timeLeft])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(duration)
  }, [duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePresetClick = (value: number) => {
    setDuration(value)
    setTimeLeft(value)
    setIsRunning(false)
  }

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setDuration(newDuration)
    setTimeLeft(newDuration)
    setIsRunning(false)
  }

  // Calculate progress percentage
  const progress = ((duration - timeLeft) / duration) * 100

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        isRunning ? pauseTimer() : startTimer()
      } else if (e.code === "KeyR") {
        resetTimer()
      } else if (e.code === "KeyM") {
        setIsMuted(!isMuted)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isRunning, isMuted, pauseTimer, resetTimer, startTimer])

  return (
    <Card className={cn("fixed bottom-20 right-4 w-80 transition-all duration-300 z-50", isMinimized && "w-40")}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8">
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="relative mb-4">
          <div
            className="absolute inset-0 bg-primary/10 rounded-full"
            style={{
              background: `conic-gradient(var(--primary) ${progress}%, transparent ${progress}%)`,
            }}
          />
          <div className="flex items-center justify-center relative">
            <span className="text-4xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {!isMinimized && (
            <>
              <div className="flex justify-center space-x-2">
                {TIMER_PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(preset.value)}
                    className={cn("px-2 py-1 h-8", duration === preset.value && "bg-primary text-primary-foreground")}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="px-2">
                <Slider value={[duration]} min={5} max={600} step={5} onValueChange={handleDurationChange} />
              </div>
            </>
          )}

          <div className="flex justify-center space-x-2">
            <Button
              variant={isRunning ? "outline" : "default"}
              size="icon"
              onClick={isRunning ? pauseTimer : startTimer}
              className="h-10 w-10"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={resetTimer} className="h-10 w-10">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {!isMinimized && (
            <div className="text-xs text-center text-muted-foreground">
              Keyboard shortcuts: Space (play/pause), R (reset), M (mute)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

