"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { CardHeader } from '@nextui-org/react'
import { Progress } from '@nextui-org/react'
import { Chip } from '@nextui-org/react'
import { Spinner } from '@nextui-org/react';
import { performanceMonitor } from '@/lib/metrics';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  performanceScore: number;
}

const OptimizedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simuler le chargement des données avec des dimensions fixes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalUsers: 1250,
          activeUsers: 847,
          totalLessons: 156,
          completedLessons: 89,
          averageScore: 78,
          performanceScore: 83
        });
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container-optimized" style={{ minHeight: '600px', contain: 'layout style paint' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="card-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
              <CardBody className="flex items-center justify-center">
                <Spinner size="lg" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container-optimized" style={{ minHeight: '400px', contain: 'layout style paint' }}>
        <Card className="error-state-optimized">
          <CardBody className="text-center">
            <p className="text-red-500">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="dashboard-container-optimized" style={{ minHeight: '600px', contain: 'layout style paint' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Utilisateurs Totaux */}
        <Card className="card-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
          <CardHeader className="header-optimized">
            <h3 className="text-lg font-semibold">Utilisateurs Totaux</h3>
          </CardHeader>
          <CardBody className="body-optimized">
            <div className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</div>
            <Progress 
              value={75} 
              className="progress-optimized mt-2"
              color="primary"
            />
          </CardBody>
        </Card>

        {/* Utilisateurs Actifs */}
        <Card className="card-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
          <CardHeader className="header-optimized">
            <h3 className="text-lg font-semibold">Utilisateurs Actifs</h3>
          </CardHeader>
          <CardBody className="body-optimized">
            <div className="text-3xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</div>
            <Chip color="success" variant="flat" className="mt-2">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% actifs
            </Chip>
          </CardBody>
        </Card>

        {/* Leçons */}
        <Card className="card-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
          <CardHeader className="header-optimized">
            <h3 className="text-lg font-semibold">Leçons</h3>
          </CardHeader>
          <CardBody className="body-optimized">
            <div className="text-3xl font-bold text-purple-600">{stats.completedLessons}/{stats.totalLessons}</div>
            <Progress 
              value={(stats.completedLessons / stats.totalLessons) * 100} 
              className="progress-optimized mt-2"
              color="secondary"
            />
          </CardBody>
        </Card>

        {/* Score Moyen */}
        <Card className="card-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
          <CardHeader className="header-optimized">
            <h3 className="text-lg font-semibold">Score Moyen</h3>
          </CardHeader>
          <CardBody className="body-optimized">
            <div className="text-3xl font-bold text-orange-600">{stats.averageScore}%</div>
            <Chip 
              color={stats.averageScore >= 80 ? "success" : stats.averageScore >= 60 ? "warning" : "danger"} 
              variant="flat" 
              className="mt-2"
            >
              {stats.averageScore >= 80 ? "Excellent" : stats.averageScore >= 60 ? "Bon" : "À améliorer"}
            </Chip>
          </CardBody>
        </Card>

        {/* Performance */}
        <Card className="card-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
          <CardHeader className="header-optimized">
            <h3 className="text-lg font-semibold">Performance Site</h3>
          </CardHeader>
          <CardBody className="body-optimized">
            <div className="text-3xl font-bold text-indigo-600">{stats.performanceScore}%</div>
            <Chip 
              color={stats.performanceScore >= 90 ? "success" : stats.performanceScore >= 75 ? "warning" : "danger"} 
              variant="flat" 
              className="mt-2"
            >
              {stats.performanceScore >= 90 ? "Excellent" : stats.performanceScore >= 75 ? "Bon" : "À améliorer"}
            </Chip>
          </CardBody>
        </Card>

        {/* Graphique de Performance */}
        <Card className="card-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
          <CardHeader className="header-optimized">
            <h3 className="text-lg font-semibold">Évolution</h3>
          </CardHeader>
          <CardBody className="body-optimized">
            <div className="chart-container-optimized" style={{ height: '150px', contain: 'layout style paint' }}>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">+12%</div>
                  <div className="text-sm text-gray-500">vs mois dernier</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default OptimizedDashboard;
