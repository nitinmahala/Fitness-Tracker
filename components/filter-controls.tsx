"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface FilterControlsProps {
  filter: {
    exerciseName: string
    startDate: string
    endDate: string
  }
  setFilter: (filter: {
    exerciseName: string
    startDate: string
    endDate: string
  }) => void
}

export function FilterControls({ filter, setFilter }: FilterControlsProps) {
  const clearFilters = () => {
    setFilter({
      exerciseName: "",
      startDate: "",
      endDate: "",
    })
  }

  const hasActiveFilters = filter.exerciseName || filter.startDate || filter.endDate

  return (
    <div className="mb-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="filter-exercise">Exercise Name</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="filter-exercise"
              placeholder="Search exercises..."
              className="pl-8"
              value={filter.exerciseName}
              onChange={(e) => setFilter({ ...filter, exerciseName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-start-date">Start Date</Label>
          <Input
            id="filter-start-date"
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-end-date">End Date</Label>
          <Input
            id="filter-end-date"
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

