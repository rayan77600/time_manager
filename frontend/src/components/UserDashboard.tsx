import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import {
  Clock,
  LogOut,
  Play,
  Square,
  Calendar as CalendarIcon,
  TrendingUp,
  History,
  CalendarDays,
  FileText,
  Download,
  Plus,
} from 'lucide-react'
import GlassCard from './GlassCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar } from './ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import type { User } from '@/types/user'

interface UserDashboardProps {
  user: User
  onLogout: () => void
}

interface ClockEntry {
  id: string
  date: string
  clockIn: string
  clockOut?: string
  hoursWorked?: number
  status: 'complete' | 'late' | 'early-leave'
}

interface CalendarEvent {
  date: Date
  type: 'working' | 'absence' | 'vacation' | 'holiday'
  label?: string
}

interface VacationRequest {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isVacationDialogOpen, setIsVacationDialogOpen] = useState(false)
  const [vacationStartDate, setVacationStartDate] = useState('')
  const [vacationEndDate, setVacationEndDate] = useState('')
  const [vacationReason, setVacationReason] = useState('')

  // Mock calendar events
  const [calendarEvents] = useState<CalendarEvent[]>([
    // Working days
    { date: new Date(2025, 9, 15), type: 'working' },
    { date: new Date(2025, 9, 14), type: 'working' },
    { date: new Date(2025, 9, 13), type: 'working' },
    { date: new Date(2025, 9, 12), type: 'working' },
    { date: new Date(2025, 9, 11), type: 'working' },
    // Vacation days
    { date: new Date(2025, 9, 8), type: 'vacation', label: 'Vacation' },
    { date: new Date(2025, 9, 9), type: 'vacation', label: 'Vacation' },
    { date: new Date(2025, 9, 10), type: 'vacation', label: 'Vacation' },
    // Absence
    { date: new Date(2025, 9, 4), type: 'absence', label: 'Sick Leave' },
    // Holiday
    { date: new Date(2025, 9, 1), type: 'holiday', label: 'Public Holiday' },
    // Upcoming working days
    { date: new Date(2025, 9, 17), type: 'working' },
    { date: new Date(2025, 9, 18), type: 'working' },
    { date: new Date(2025, 9, 21), type: 'working' },
    { date: new Date(2025, 9, 22), type: 'working' },
    { date: new Date(2025, 9, 23), type: 'working' },
    { date: new Date(2025, 9, 24), type: 'working' },
    { date: new Date(2025, 9, 25), type: 'working' },
  ])

  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([
    {
      id: '1',
      startDate: '2025-10-08',
      endDate: '2025-10-10',
      reason: 'Family vacation',
      status: 'approved',
    },
    {
      id: '2',
      startDate: '2025-11-15',
      endDate: '2025-11-18',
      reason: 'Personal time off',
      status: 'pending',
    },
  ])

  // Mock clock entries with more data
  const [entries] = useState<ClockEntry[]>([
    {
      id: '1',
      date: '2025-10-15',
      clockIn: '09:00 AM',
      clockOut: '05:30 PM',
      hoursWorked: 8.5,
      status: 'complete',
    },
    {
      id: '2',
      date: '2025-10-14',
      clockIn: '08:45 AM',
      clockOut: '05:15 PM',
      hoursWorked: 8.5,
      status: 'complete',
    },
    {
      id: '3',
      date: '2025-10-13',
      clockIn: '09:15 AM',
      clockOut: '06:00 PM',
      hoursWorked: 8.75,
      status: 'late',
    },
    {
      id: '4',
      date: '2025-10-12',
      clockIn: '09:00 AM',
      clockOut: '04:45 PM',
      hoursWorked: 7.75,
      status: 'early-leave',
    },
    {
      id: '5',
      date: '2025-10-11',
      clockIn: '08:50 AM',
      clockOut: '05:20 PM',
      hoursWorked: 8.5,
      status: 'complete',
    },
    {
      id: '6',
      date: '2025-10-08',
      clockIn: '09:00 AM',
      clockOut: '05:30 PM',
      hoursWorked: 8.5,
      status: 'complete',
    },
    {
      id: '7',
      date: '2025-10-07',
      clockIn: '08:55 AM',
      clockOut: '05:25 PM',
      hoursWorked: 8.5,
      status: 'complete',
    },
    {
      id: '8',
      date: '2025-10-06',
      clockIn: '09:20 AM',
      clockOut: '05:45 PM',
      hoursWorked: 8.42,
      status: 'late',
    },
  ])

  const handleClockIn = () => {
    setIsClockedIn(true)
    setClockInTime(new Date())
  }

  const handleClockOut = () => {
    setIsClockedIn(false)
    setClockInTime(null)
  }

  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const totalHoursThisWeek = entries
    .slice(0, 5)
    .reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0)
  const totalHoursThisMonth = entries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0)
  const avgHoursPerDay = totalHoursThisMonth / entries.length

  // Data for charts
  const weeklyData = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 8.5 },
    { day: 'Wed', hours: 8.75 },
    { day: 'Thu', hours: 7.75 },
    { day: 'Fri', hours: 8.5 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-500/80 text-white border-0">On Time</Badge>
      case 'late':
        return <Badge className="bg-orange-500/80 text-white border-0">Late</Badge>
      case 'early-leave':
        return <Badge className="bg-blue-500/80 text-white border-0">Early Leave</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/80 text-white border-0">Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-500/80 text-white border-0">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/80 text-white border-0">Rejected</Badge>
      default:
        return null
    }
  }

  const handleExportData = () => {
    // Mock export functionality
    alert('Exporting data... (demo feature)')
  }

  const handleVacationRequest = (e: React.FormEvent) => {
    e.preventDefault()
    const newRequest: VacationRequest = {
      id: (vacationRequests.length + 1).toString(),
      startDate: vacationStartDate,
      endDate: vacationEndDate,
      reason: vacationReason,
      status: 'pending',
    }
    setVacationRequests([newRequest, ...vacationRequests])
    setVacationStartDate('')
    setVacationEndDate('')
    setVacationReason('')
    setIsVacationDialogOpen(false)
    alert('Vacation request submitted successfully!')
  }

  // Function to get calendar event for a specific date
  const getEventForDate = (date: Date) => {
    return calendarEvents.find(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Custom day content for calendar
  const getDayClassName = (date: Date) => {
    const event = getEventForDate(date)
    if (!event) return ''

    switch (event.type) {
      case 'working':
        return 'bg-blue-500/20 border border-blue-500/40 rounded-md'
      case 'vacation':
        return 'bg-purple-500/30 border border-purple-500/50 rounded-md'
      case 'absence':
        return 'bg-red-500/30 border border-red-500/50 rounded-md'
      case 'holiday':
        return 'bg-green-500/30 border border-green-500/50 rounded-md'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white text-3xl mb-1">Welcome, {user.first_name}</h1>
            <p className="text-white/70">{user.title}</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Clock In/Out Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                    <Clock className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h2 className="text-white text-5xl mb-4">{getCurrentTimeString()}</h2>
                <p className="text-white/70 mb-8">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                {!isClockedIn ? (
                  <Button
                    onClick={handleClockIn}
                    size="lg"
                    className="bg-green-500/80 hover:bg-green-500 text-white border-0 px-12 backdrop-blur-sm"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Clock In
                  </Button>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-green-500/20 rounded-lg border border-green-500/30 backdrop-blur-sm inline-block">
                      <p className="text-white">
                        Clocked in at {clockInTime?.toLocaleTimeString('en-US')}
                      </p>
                    </div>
                    <br />
                    <Button
                      onClick={handleClockOut}
                      size="lg"
                      className="bg-red-500/80 hover:bg-red-500 text-white border-0 px-12 backdrop-blur-sm"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Clock Out
                    </Button>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <CalendarIcon className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">This Week</p>
                  <p className="text-white text-2xl">{totalHoursThisWeek.toFixed(1)} hrs</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <TrendingUp className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">This Month</p>
                  <p className="text-white text-2xl">{totalHoursThisMonth.toFixed(1)} hrs</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <TrendingUp className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Average/Day</p>
                  <p className="text-white text-2xl">{avgHoursPerDay.toFixed(1)} hrs</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="planning" className="data-[state=active]:bg-white/20 text-white">
              <CalendarDays className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white/20 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history">
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl">Clock History</h3>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-white mb-1">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-white/60 text-sm">
                          In: {entry.clockIn} - Out: {entry.clockOut}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-white text-lg">{entry.hoursWorked} hrs</p>
                        </div>
                        {getStatusBadge(entry.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-white text-xl mb-6">Weekly Hours</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="hours" fill="rgba(59, 130, 246, 0.8)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-xl">Calendar View</h3>
                  <Dialog open={isVacationDialogOpen} onOpenChange={setIsVacationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-purple-500/80 hover:bg-purple-500 text-white border-0"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Request Vacation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-white/20 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white">Request Vacation</DialogTitle>
                        <DialogDescription className="text-white/70">
                          Submit a vacation request to your manager for approval.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleVacationRequest} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-white">
                            Start Date
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={vacationStartDate}
                            onChange={(e) => setVacationStartDate(e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate" className="text-white">
                            End Date
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={vacationEndDate}
                            onChange={(e) => setVacationEndDate(e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason" className="text-white">
                            Reason
                          </Label>
                          <Textarea
                            id="reason"
                            value={vacationReason}
                            onChange={(e) => setVacationReason(e.target.value)}
                            placeholder="Enter reason for vacation request..."
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-purple-500/80 hover:bg-purple-500 text-white border-0"
                        >
                          Submit Request
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex justify-center mb-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-white/20 bg-white/5 text-white"
                    modifiers={{
                      working: calendarEvents
                        .filter((e) => e.type === 'working')
                        .map((e) => e.date),
                      vacation: calendarEvents
                        .filter((e) => e.type === 'vacation')
                        .map((e) => e.date),
                      absence: calendarEvents
                        .filter((e) => e.type === 'absence')
                        .map((e) => e.date),
                      holiday: calendarEvents
                        .filter((e) => e.type === 'holiday')
                        .map((e) => e.date),
                    }}
                    modifiersClassNames={{
                      working: 'bg-blue-500/30 text-white font-semibold',
                      vacation: 'bg-purple-500/40 text-white font-semibold',
                      absence: 'bg-red-500/40 text-white font-semibold',
                      holiday: 'bg-green-500/40 text-white font-semibold',
                    }}
                  />
                </div>

                {/* Calendar Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500/40"></div>
                    <span className="text-white/70 text-sm">Working Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500/40"></div>
                    <span className="text-white/70 text-sm">Vacation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500/40"></div>
                    <span className="text-white/70 text-sm">Absence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500/40"></div>
                    <span className="text-white/70 text-sm">Holiday</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="lg:col-span-2">
                <h3 className="text-white text-xl mb-4">Vacation Requests</h3>
                <div className="space-y-3">
                  {vacationRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white mb-1">
                            {new Date(request.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            -{' '}
                            {new Date(request.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-white/60 text-sm">{request.reason}</p>
                        </div>
                        <div className="text-right">{getStatusBadge(request.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="lg:col-span-2">
                <h3 className="text-white text-xl mb-4">Next Week's Schedule</h3>
                <div className="space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                    <div
                      key={day}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center"
                    >
                      <span className="text-white">
                        {day} Oct {17 + index}
                      </span>
                      <span className="text-white/70">09:00 - 17:30</span>
                      <Badge className="bg-blue-500/80 text-white border-0">8.5hrs</Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard>
                <h3 className="text-white mb-4">Monthly Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Days Worked</span>
                    <span className="text-white">8 days</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Total Hours</span>
                    <span className="text-white">{totalHoursThisMonth.toFixed(1)}hrs</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Late Count</span>
                    <span className="text-orange-400">2 times</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Overtime</span>
                    <span className="text-green-400">+2.5hrs</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white mb-4">Compliance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Attendance Rate</span>
                    <span className="text-green-400">100%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Punctuality</span>
                    <span className="text-green-400">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Overall Score</span>
                    <span className="text-green-400">87.5%</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white mb-4">Goals</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Required Hours</span>
                    <span className="text-white">160hrs/month</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Progress</span>
                    <span className="text-blue-400">42.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Days Left</span>
                    <span className="text-white">12 days</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
