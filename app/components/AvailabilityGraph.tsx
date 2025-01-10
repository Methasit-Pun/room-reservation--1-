'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Slot {
  start: string
  end: string
  isBooked: boolean
}

interface AvailabilityGraphProps {
  slots: Slot[]
  date: string
  selectedStart?: string
  selectedEnd?: string
  className?: string
}

export function AvailabilityGraph({ slots, date, selectedStart, selectedEnd, className }: AvailabilityGraphProps) {
  const data = slots.map(slot => ({
    time: slot.start,
    available: slot.isBooked ? 0 : 1,
    booked: slot.isBooked ? 1 : 0,
    selected: selectedStart && selectedEnd && slot.start >= selectedStart && slot.start < selectedEnd ? 1 : 0,
  }))

  const leftColumnData = data.slice(0, 12);
  const rightColumnData = data.slice(12);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardTitle>Room Availability for {date}</CardTitle>
        <p className="text-sm mt-1">Left: 00:00 - 12:00 | Right: 12:00 - 24:00</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartContainer
            config={{
              available: { label: "Available", color: "hsl(var(--chart-2))" },
              booked: { label: "Booked", color: "hsl(var(--chart-1))" },
              selected: { label: "Selected", color: "hsl(var(--chart-3))" },
            }}
            className="h-auto"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leftColumnData} layout="vertical" stackOffset="expand">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="time" 
                  type="category" 
                  scale="band" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={true} 
                  width={110}
                  tickFormatter={(value) => `${value} - ${(parseInt(value.split(':')[0]) + 1).toString().padStart(2, '0')}:00`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="available" stackId="status" fill="var(--color-available)" />
                <Bar dataKey="booked" stackId="status" fill="var(--color-booked)" />
                <Bar dataKey="selected" stackId="status" fill="var(--color-selected)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartContainer
            config={{
              available: { label: "Available", color: "hsl(var(--chart-2))" },
              booked: { label: "Booked", color: "hsl(var(--chart-1))" },
              selected: { label: "Selected", color: "hsl(var(--chart-3))" },
            }}
            className="h-auto"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rightColumnData} layout="vertical" stackOffset="expand">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="time" 
                  type="category" 
                  scale="band" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={true} 
                  width={110}
                  tickFormatter={(value) => `${value} - ${(parseInt(value.split(':')[0]) + 1).toString().padStart(2, '0')}:00`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="available" stackId="status" fill="var(--color-available)" />
                <Bar dataKey="booked" stackId="status" fill="var(--color-booked)" />
                <Bar dataKey="selected" stackId="status" fill="var(--color-selected)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

