import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import {
  LogOut,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Play,
  Square,
  Calendar as CalendarIcon,
  History,
  CalendarDays,
} from 'lucide-react'
import GlassCard from './GlassCard'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Calendar } from './ui/calendar'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
}

interface ManagerDashboardProps {
  user: User
  onLogout: () => void
}

interface TeamMember {
  id: string
  name: string
  status: 'clocked-in' | 'clocked-out' | 'late'
  clockIn?: string
  hoursToday: number
  hoursWeek: number
  lateCount: number
  performance: number
}

interface ClockEntry {
  id: string
  date: string
  clockIn: string
  clockOut?: string
  hoursWorked?: number
  status: 'complete' | 'late' | 'early-leave'
}

export default function ManagerDashboard({ user, onLogout }: ManagerDashboardProps) {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Manager's personal clock entries
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
  ])

  // Team members data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Smith',
      status: 'clocked-in',
      clockIn: '09:00 AM',
      hoursToday: 4.5,
      hoursWeek: 32.5,
      lateCount: 0,
      performance: 98,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      status: 'clocked-in',
      clockIn: '08:45 AM',
      hoursToday: 4.75,
      hoursWeek: 35.0,
      lateCount: 0,
      performance: 99,
    },
    {
      id: '3',
      name: 'Michael Chen',
      status: 'late',
      clockIn: '09:30 AM',
      hoursToday: 4.0,
      hoursWeek: 28.5,
      lateCount: 3,
      performance: 85,
    },
    {
      id: '4',
      name: 'Emily Davis',
      status: 'clocked-out',
      hoursToday: 8.5,
      hoursWeek: 40.0,
      lateCount: 0,
      performance: 97,
    },
    {
      id: '5',
      name: 'David Wilson',
      status: 'clocked-in',
      clockIn: '09:00 AM',
      hoursToday: 4.5,
      hoursWeek: 36.5,
      lateCount: 1,
      performance: 94,
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      status: 'clocked-in',
      clockIn: '08:50 AM',
      hoursToday: 4.67,
      hoursWeek: 33.0,
      lateCount: 0,
      performance: 96,
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

  const totalHoursThisWeek = entries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0)
  const totalHoursThisMonth = entries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0)
  const avgHoursPerDay = totalHoursThisMonth / entries.length

  // Personal data for charts
  const weeklyData = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 8.5 },
    { day: 'Wed', hours: 8.75 },
    { day: 'Thu', hours: 7.75 },
    { day: 'Fri', hours: 8.5 },
  ]

  // Team data
  const totalTeamMembers = teamMembers.length
  const clockedIn = teamMembers.filter((m) => m.status === 'clocked-in').length
  const lateToday = teamMembers.filter((m) => m.status === 'late').length
  const avgPerformance = teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length

  const weeklyTeamData = [
    { day: 'Mon', hours: 52 },
    { day: 'Tue', hours: 51.5 },
    { day: 'Wed', hours: 53 },
    { day: 'Thu', hours: 48 },
    { day: 'Fri', hours: 52.5 },
  ]

  const performanceData = teamMembers.map((m) => ({
    name: m.name.split(' ')[0],
    performance: m.performance,
  }))

  const attendanceData = [
    { name: 'On Time', value: 75, color: 'rgba(34, 197, 94, 0.8)' },
    { name: 'Late', value: 15, color: 'rgba(251, 146, 60, 0.8)' },
    { name: 'Absent', value: 10, color: 'rgba(239, 68, 68, 0.8)' },
  ]

  const productivityTrend = [
    { week: 'Week 1', productivity: 92 },
    { week: 'Week 2', productivity: 94 },
    { week: 'Week 3', productivity: 91 },
    { week: 'Week 4', productivity: 95 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clocked-in':
        return <Badge className="bg-green-500/80 text-white border-0">Active</Badge>
      case 'clocked-out':
        return <Badge className="bg-gray-500/80 text-white border-0">Off Duty</Badge>
      case 'late':
        return <Badge className="bg-orange-500/80 text-white border-0">Late</Badge>
      case 'complete':
        return <Badge className="bg-green-500/80 text-white border-0">On Time</Badge>
      case 'early-leave':
        return <Badge className="bg-blue-500/80 text-white border-0">Early Leave</Badge>
      default:
        return null
    }
  }

  const handleExportReport = () => {
    alert('Exporting report... (demo feature)')
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
            <h1 className="text-white text-3xl mb-1">Manager Dashboard</h1>
            <p className="text-white/70">
              {user.department} - {user.name}
            </p>
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

        {/* Tabs Section */}
        <Tabs defaultValue="my-time" className="w-full">
          <TabsList className="bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <TabsTrigger value="my-time" className="data-[state=active]:bg-white/20 text-white">
              <Clock className="w-4 h-4 mr-2" />
              My Time
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white/20 text-white">
              <CalendarDays className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="my-reports" className="data-[state=active]:bg-white/20 text-white">
              <FileText className="w-4 h-4 mr-2" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-white/20 text-white">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20 text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white/20 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Team Reports
            </TabsTrigger>
          </TabsList>

          {/* My Time Tab */}
          <TabsContent value="my-time">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl">My Clock History</h3>
                <Button
                  onClick={handleExportReport}
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

          {/* Schedule Tab */}
          <TabsContent value="schedule">
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
                <h3 className="text-white text-xl mb-6">Calendar View</h3>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-white/20 bg-white/5 text-white"
                  />
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

          {/* My Reports Tab */}
          <TabsContent value="my-reports">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard>
                <h3 className="text-white mb-4">Monthly Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Days Worked</span>
                    <span className="text-white">5 days</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Total Hours</span>
                    <span className="text-white">{totalHoursThisMonth.toFixed(1)}hrs</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Late Count</span>
                    <span className="text-orange-400">1 time</span>
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
                    <span className="text-green-400">80%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Overall Score</span>
                    <span className="text-green-400">90%</span>
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
                    <span className="text-blue-400">27%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Days Left</span>
                    <span className="text-white">12 days</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <Users className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Team Members</p>
                    <p className="text-white text-3xl">{totalTeamMembers}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <CheckCircle className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Active</p>
                    <p className="text-white text-3xl">{clockedIn}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <AlertCircle className="w-6 h-6 text-orange-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Late Today</p>
                    <p className="text-white text-3xl">{lateToday}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <TrendingUp className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Avg Performance</p>
                    <p className="text-white text-3xl">{avgPerformance.toFixed(0)}%</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl">Team Members</h3>
                <div className="text-white/60 text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/70 pb-3">Employee</th>
                      <th className="text-left text-white/70 pb-3">Status</th>
                      <th className="text-left text-white/70 pb-3">Clock In</th>
                      <th className="text-right text-white/70 pb-3">Hrs Today</th>
                      <th className="text-right text-white/70 pb-3">Hrs Week</th>
                      <th className="text-right text-white/70 pb-3">Late</th>
                      <th className="text-right text-white/70 pb-3">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 text-white">{member.name}</td>
                        <td className="py-4">{getStatusBadge(member.status)}</td>
                        <td className="py-4 text-white/70">{member.clockIn || '-'}</td>
                        <td className="py-4 text-white text-right">{member.hoursToday}h</td>
                        <td className="py-4 text-white text-right">{member.hoursWeek}h</td>
                        <td className="py-4 text-center">
                          {member.lateCount > 0 ? (
                            <Badge className="bg-orange-500/80 text-white border-0">
                              {member.lateCount}
                            </Badge>
                          ) : (
                            <span className="text-white/50">0</span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Badge
                            className={`${member.performance >= 95 ? 'bg-green-500/80' : member.performance >= 90 ? 'bg-blue-500/80' : 'bg-orange-500/80'} text-white border-0`}
                          >
                            {member.performance}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-white text-xl mb-6">Team Hours - Week</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyTeamData}>
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
                <h3 className="text-white text-xl mb-6">Performance by Member</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.7)" domain={[0, 100]} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="rgba(255,255,255,0.7)"
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar
                      dataKey="performance"
                      fill="rgba(168, 85, 247, 0.8)"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white text-xl mb-6">Attendance Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white text-xl mb-6">Productivity Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productivityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" domain={[85, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="productivity"
                      stroke="rgba(34, 197, 94, 0.8)"
                      strokeWidth={3}
                      dot={{ fill: 'rgba(34, 197, 94, 1)', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Team Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <GlassCard>
                <h3 className="text-white mb-4">Team KPIs - Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Total Hours</span>
                    <span className="text-white">257h</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Overtime</span>
                    <span className="text-green-400">+17h</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Attendance Rate</span>
                    <span className="text-green-400">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Productivity</span>
                    <span className="text-green-400">95%</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white mb-4">Alerts & Actions</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <p className="text-white text-sm mb-1">3 late arrivals this week</p>
                    <p className="text-white/60 text-xs">Review causes</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-white text-sm mb-1">High workload</p>
                    <p className="text-white/60 text-xs">2 members &gt; 40h/week</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <p className="text-white text-sm mb-1">Excellent punctuality</p>
                    <p className="text-white/60 text-xs">4 members no late</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white mb-4">Export Reports</h3>
                <div className="space-y-2">
                  <Button
                    onClick={handleExportReport}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Weekly Report
                  </Button>
                  <Button
                    onClick={handleExportReport}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Monthly Report
                  </Button>
                </div>
              </GlassCard>
            </div>

            <GlassCard>
              <h3 className="text-white text-xl mb-4">Top Performers this Month</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teamMembers
                  .sort((a, b) => b.performance - a.performance)
                  .slice(0, 3)
                  .map((member, index) => (
                    <div
                      key={member.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3 text-white text-xl">
                        {index + 1}
                      </div>
                      <p className="text-white mb-1">{member.name}</p>
                      <p className="text-green-400">{member.performance}% Performance</p>
                      <p className="text-white/60 text-sm">{member.hoursWeek}h this week</p>
                    </div>
                  ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
