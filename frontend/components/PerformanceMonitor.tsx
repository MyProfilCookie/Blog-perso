"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Progress } from '@nextui-org/react'
import { Chip } from '@nextui-org/react';
import { performanceMonitor, getCoreWebVitals } from '@/lib/metrics';

interface PerformanceData {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
}

const PerformanceMonitor: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afficher le moniteur seulement en mode développement
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    // Mesurer les Core Web Vitals après le chargement
    const measurePerformance = () => {
      setTimeout(() => {
        const cwv = getCoreWebVitals();
        if (cwv) {
          setPerformanceData(cwv);
        }
      }, 2000); // Attendre 2 secondes pour les métriques
    };

    // Mesurer au chargement initial
    measurePerformance();

    // Mesurer lors des changements de route
    const handleRouteChange = () => {
      setTimeout(measurePerformance, 1000);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  if (!isVisible) return null;

  const getScoreColor = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'success' : value <= 4000 ? 'warning' : 'danger';
      case 'fid':
        return value <= 100 ? 'success' : value <= 300 ? 'warning' : 'danger';
      case 'cls':
        return value <= 0.1 ? 'success' : value <= 0.25 ? 'warning' : 'danger';
      case 'fcp':
        return value <= 1800 ? 'success' : value <= 3000 ? 'warning' : 'danger';
      case 'ttfb':
        return value <= 600 ? 'success' : value <= 1000 ? 'warning' : 'danger';
      default:
        return 'default';
    }
  };

  const getScoreLabel = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'Excellent' : value <= 4000 ? 'Bonne' : 'À améliorer';
      case 'fid':
        return value <= 100 ? 'Excellent' : value <= 300 ? 'Bonne' : 'À améliorer';
      case 'cls':
        return value <= 0.1 ? 'Excellent' : value <= 0.25 ? 'Bonne' : 'À améliorer';
      case 'fcp':
        return value <= 1800 ? 'Excellent' : value <= 3000 ? 'Bonne' : 'À améliorer';
      case 'ttfb':
        return value <= 600 ? 'Excellent' : value <= 1000 ? 'Bonne' : 'À améliorer';
      default:
        return 'N/A';
    }
  };

  const getScorePercentage = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        return Math.max(0, Math.min(100, ((4000 - value) / 4000) * 100));
      case 'fid':
        return Math.max(0, Math.min(100, ((300 - value) / 300) * 100));
      case 'cls':
        return Math.max(0, Math.min(100, ((0.25 - value) / 0.25) * 100));
      case 'fcp':
        return Math.max(0, Math.min(100, ((3000 - value) / 3000) * 100));
      case 'ttfb':
        return Math.max(0, Math.min(100, ((1000 - value) / 1000) * 100));
      default:
        return 0;
    }
  };

  if (!performanceData) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <CardBody className="p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Mesure des performances...
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            🚀 Core Web Vitals
          </h3>
          <Chip
            size="sm"
            color="primary"
            variant="flat"
            className="text-xs"
          >
            Dev Mode
          </Chip>
        </div>

        <div className="space-y-3">
          {/* LCP */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">LCP</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {performanceData.lcp.toFixed(0)}ms
                </span>
                <Chip
                  size="sm"
                  color={getScoreColor('lcp', performanceData.lcp)}
                  variant="flat"
                  className="text-xs"
                >
                  {getScoreLabel('lcp', performanceData.lcp)}
                </Chip>
              </div>
            </div>
            <Progress
              size="sm"
              value={getScorePercentage('lcp', performanceData.lcp)}
              color={getScoreColor('lcp', performanceData.lcp)}
              className="h-1"
            />
          </div>

          {/* FID */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">FID</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {performanceData.fid.toFixed(0)}ms
                </span>
                <Chip
                  size="sm"
                  color={getScoreColor('fid', performanceData.fid)}
                  variant="flat"
                  className="text-xs"
                >
                  {getScoreLabel('fid', performanceData.fid)}
                </Chip>
              </div>
            </div>
            <Progress
              size="sm"
              value={getScorePercentage('fid', performanceData.fid)}
              color={getScoreColor('fid', performanceData.fid)}
              className="h-1"
            />
          </div>

          {/* CLS */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">CLS</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {performanceData.cls.toFixed(3)}
                </span>
                <Chip
                  size="sm"
                  color={getScoreColor('cls', performanceData.cls)}
                  variant="flat"
                  className="text-xs"
                >
                  {getScoreLabel('cls', performanceData.cls)}
                </Chip>
              </div>
            </div>
            <Progress
              size="sm"
              value={getScorePercentage('cls', performanceData.cls)}
              color={getScoreColor('cls', performanceData.cls)}
              className="h-1"
            />
          </div>

          {/* FCP */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">FCP</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {performanceData.fcp.toFixed(0)}ms
                </span>
                <Chip
                  size="sm"
                  color={getScoreColor('fcp', performanceData.fcp)}
                  variant="flat"
                  className="text-xs"
                >
                  {getScoreLabel('fcp', performanceData.fcp)}
                </Chip>
              </div>
            </div>
            <Progress
              size="sm"
              value={getScorePercentage('fcp', performanceData.fcp)}
              color={getScoreColor('fcp', performanceData.fcp)}
              className="h-1"
            />
          </div>

          {/* TTFB */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">TTFB</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {performanceData.ttfb.toFixed(0)}ms
                </span>
                <Chip
                  size="sm"
                  color={getScoreColor('ttfb', performanceData.ttfb)}
                  variant="flat"
                  className="text-xs"
                >
                  {getScoreLabel('ttfb', performanceData.ttfb)}
                </Chip>
              </div>
            </div>
            <Progress
              size="sm"
              value={getScorePercentage('ttfb', performanceData.ttfb)}
              color={getScoreColor('ttfb', performanceData.ttfb)}
              className="h-1"
            />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Score global
            </span>
            <Chip
              size="sm"
              color="primary"
              variant="flat"
              className="text-xs"
            >
              {Math.round(
                (getScorePercentage('lcp', performanceData.lcp) +
                  getScorePercentage('fid', performanceData.fid) +
                  getScorePercentage('cls', performanceData.cls) +
                  getScorePercentage('fcp', performanceData.fcp) +
                  getScorePercentage('ttfb', performanceData.ttfb)) / 5
              )}/100
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PerformanceMonitor;
