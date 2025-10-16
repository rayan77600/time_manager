import { useState } from 'react';
import { Button } from './ui/button';
import { LogOut, Building2, Users, Clock, TrendingUp, DollarSign, Download, FileText, BarChart3, AlertTriangle } from 'lucide-react';
import GlassCard from './GlassCard';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface OrganizationDashboardProps {
  user: User;
  onLogout: () => void;
}

interface DepartmentStats {
  id: string;
  name: string;
  employees: number;
  activeNow: number;
  avgHoursWeek: number;
  efficiency: number;
  lateCount: number;
  overtimeHours: number;
}

export default function OrganizationDashboard({ user, onLogout }: OrganizationDashboardProps) {
  const [departments] = useState<DepartmentStats[]>([
    { id: '1', name: 'Banque de Détail', employees: 45, activeNow: 38, avgHoursWeek: 38.5, efficiency: 96, lateCount: 5, overtimeHours: 12.5 },
    { id: '2', name: 'Opérations', employees: 32, activeNow: 28, avgHoursWeek: 39.2, efficiency: 94, lateCount: 3, overtimeHours: 15.2 },
    { id: '3', name: 'Banque d\'Investissement', employees: 28, activeNow: 24, avgHoursWeek: 42.1, efficiency: 98, lateCount: 1, overtimeHours: 28.5 },
    { id: '4', name: 'Services IT', employees: 18, activeNow: 16, avgHoursWeek: 37.8, efficiency: 92, lateCount: 4, overtimeHours: 8.0 },
    { id: '5', name: 'Ressources Humaines', employees: 12, activeNow: 10, avgHoursWeek: 38.0, efficiency: 95, lateCount: 1, overtimeHours: 3.5 },
    { id: '6', name: 'Service Client', employees: 52, activeNow: 45, avgHoursWeek: 37.5, efficiency: 91, lateCount: 8, overtimeHours: 18.0 },
  ]);

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
  const totalActive = departments.reduce((sum, dept) => sum + dept.activeNow, 0);
  const avgEfficiency = departments.reduce((sum, dept) => sum + dept.efficiency, 0) / departments.length;
  const totalLates = departments.reduce((sum, dept) => sum + dept.lateCount, 0);
  const totalOvertime = departments.reduce((sum, dept) => sum + dept.overtimeHours, 0);

  // Données pour les graphiques
  const departmentComparison = departments.map(d => ({
    name: d.name.split(' ')[0],
    efficiency: d.efficiency,
    hours: d.avgHoursWeek
  }));

  const monthlyTrend = [
    { month: 'Juin', hours: 6240, efficiency: 93, cost: 125000 },
    { month: 'Juil', hours: 6420, efficiency: 94, cost: 128400 },
    { month: 'Août', hours: 6180, efficiency: 92, cost: 123600 },
    { month: 'Sept', hours: 6510, efficiency: 95, cost: 130200 },
    { month: 'Oct', hours: 6580, efficiency: 95, cost: 131600 },
  ];

  const complianceData = [
    { subject: 'Ponctualité', value: 88 },
    { subject: 'Présence', value: 97 },
    { subject: 'Respect horaires', value: 92 },
    { subject: 'Conformité', value: 95 },
    { subject: 'Performance', value: 94 },
  ];

  const workforceDistribution = [
    { name: 'Banque Détail', value: 45, color: 'rgba(59, 130, 246, 0.8)' },
    { name: 'Service Client', value: 52, color: 'rgba(168, 85, 247, 0.8)' },
    { name: 'Opérations', value: 32, color: 'rgba(34, 197, 94, 0.8)' },
    { name: 'Invest.', value: 28, color: 'rgba(251, 146, 60, 0.8)' },
    { name: 'IT', value: 18, color: 'rgba(236, 72, 153, 0.8)' },
    { name: 'RH', value: 12, color: 'rgba(14, 165, 233, 0.8)' },
  ];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'bg-green-500/80';
    if (efficiency >= 90) return 'bg-blue-500/80';
    return 'bg-orange-500/80';
  };

  const handleExportReport = () => {
    alert('Export du rapport organisationnel... (fonctionnalité de démonstration)');
  };

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
            <h1 className="text-white text-3xl mb-1">Vue d'Ensemble Organisation</h1>
            <p className="text-white/70">Analytiques Banque - {user.name}</p>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Employés Total</p>
                <p className="text-white text-3xl">{totalEmployees}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <Clock className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Actifs</p>
                <p className="text-white text-3xl">{totalActive}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <TrendingUp className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Efficacité Moy.</p>
                <p className="text-white text-3xl">{avgEfficiency.toFixed(0)}%</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                <Building2 className="w-6 h-6 text-orange-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Départements</p>
                <p className="text-white text-3xl">{departments.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Retards Semaine</p>
                <p className="text-white text-3xl">{totalLates}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <TabsTrigger value="departments" className="data-[state=active]:bg-white/20 text-white">
              <Building2 className="w-4 h-4 mr-2" />
              Départements
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20 text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytiques
            </TabsTrigger>
            <TabsTrigger value="kpi" className="data-[state=active]:bg-white/20 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              KPI Stratégiques
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white/20 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Rapports
            </TabsTrigger>
          </TabsList>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <GlassCard className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl">Performance par Département</h3>
                <div className="text-white/60 text-sm">
                  Semaine du 13-19 Octobre 2025
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/70 pb-3">Département</th>
                      <th className="text-right text-white/70 pb-3">Employés</th>
                      <th className="text-right text-white/70 pb-3">Actifs</th>
                      <th className="text-right text-white/70 pb-3">H. Moy./Sem</th>
                      <th className="text-right text-white/70 pb-3">H. Sup.</th>
                      <th className="text-right text-white/70 pb-3">Retards</th>
                      <th className="text-right text-white/70 pb-3">Efficacité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr 
                        key={dept.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 text-white">{dept.name}</td>
                        <td className="py-4 text-white text-right">{dept.employees}</td>
                        <td className="py-4 text-white text-right">{dept.activeNow}</td>
                        <td className="py-4 text-white text-right">{dept.avgHoursWeek}h</td>
                        <td className="py-4 text-white text-right">{dept.overtimeHours}h</td>
                        <td className="py-4 text-center">
                          {dept.lateCount > 0 ? (
                            <Badge className="bg-orange-500/80 text-white border-0">{dept.lateCount}</Badge>
                          ) : (
                            <span className="text-white/50">0</span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Badge className={`${getEfficiencyColor(dept.efficiency)} text-white border-0`}>
                            {dept.efficiency}%
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
                <h3 className="text-white text-xl mb-6">Comparaison Départements</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="efficiency" fill="rgba(59, 130, 246, 0.8)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white text-xl mb-6">Répartition Effectifs</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workforceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workforceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white text-xl mb-6">Tendance Mensuelle - Heures</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="hours" stroke="rgba(168, 85, 247, 0.8)" strokeWidth={3} dot={{ fill: 'rgba(168, 85, 247, 1)', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white text-xl mb-6">Radar Conformité</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={complianceData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.7)" />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="rgba(34, 197, 94, 0.8)" fill="rgba(34, 197, 94, 0.4)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </TabsContent>

          {/* KPI Tab */}
          <TabsContent value="kpi">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <GlassCard>
                <h3 className="text-white mb-4">KPI Opérationnels</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Total heures/mois</span>
                    <span className="text-white">6,580h</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Heures supplémentaires</span>
                    <span className="text-orange-400">{totalOvertime}h</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Taux présence</span>
                    <span className="text-green-400">97.5%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Ponctualité</span>
                    <span className="text-green-400">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Absentéisme</span>
                    <span className="text-green-400">2.5%</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white mb-4">KPI Financiers</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Coût masse salariale</span>
                    <span className="text-white">€131,600</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Coût heures sup.</span>
                    <span className="text-orange-400">€5,280</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">ROI productivité</span>
                    <span className="text-green-400">+12.3%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Économies/mois</span>
                    <span className="text-green-400">€8,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Budget respecté</span>
                    <span className="text-green-400">98%</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white mb-4">KPI RH</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Satisfaction employés</span>
                    <span className="text-green-400">4.2/5</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Turnover</span>
                    <span className="text-green-400">3.1%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Formation (heures)</span>
                    <span className="text-blue-400">248h</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">Engagement</span>
                    <span className="text-green-400">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Performance moy.</span>
                    <span className="text-green-400">94.3%</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard>
              <h3 className="text-white text-xl mb-6">Évolution Efficacité Mensuelle</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" domain={[90, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="efficiency" stroke="rgba(34, 197, 94, 0.8)" strokeWidth={3} dot={{ fill: 'rgba(34, 197, 94, 1)', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <GlassCard>
                <h3 className="text-white text-xl mb-4">Départements Performants</h3>
                <div className="space-y-3">
                  {departments
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .slice(0, 3)
                    .map((dept, index) => (
                      <div key={dept.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white">{dept.name}</p>
                            <p className="text-white/60 text-sm">{dept.employees} employés</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/80 text-white border-0">{dept.efficiency}%</Badge>
                      </div>
                    ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-white text-xl mb-4">Points d'Attention</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <p className="text-white mb-1">Heures supplémentaires élevées</p>
                    <p className="text-white/60 text-sm">Banque d'Investissement: 28.5h/semaine</p>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <p className="text-white mb-1">Retards fréquents</p>
                    <p className="text-white/60 text-sm">Service Client: 8 retards cette semaine</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-white mb-1">Charge de travail optimale</p>
                    <p className="text-white/60 text-sm">92% des départements dans la norme</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard>
              <h3 className="text-white text-xl mb-6">Export de Rapports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={handleExportReport}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Rapport Hebdo
                </Button>
                <Button 
                  onClick={handleExportReport}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Rapport Mensuel
                </Button>
                <Button 
                  onClick={handleExportReport}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Analytiques RH
                </Button>
                <Button 
                  onClick={handleExportReport}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Conformité Audit
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="mt-6">
              <h3 className="text-white text-xl mb-4">Résumé Exécutif</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white mb-3">Points Forts</h4>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Excellente efficacité globale (95%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Taux de présence exemplaire (97.5%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>3 départements avec &gt;95% d'efficacité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>ROI productivité en hausse (+12.3%)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white mb-3">Axes d'Amélioration</h4>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">⚠</span>
                      <span>Réduire les heures supplémentaires (85.5h total)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">⚠</span>
                      <span>Améliorer ponctualité Service Client</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">⚠</span>
                      <span>Former sur respect des horaires</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">⚠</span>
                      <span>Optimiser charge Banque Investissement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
