import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Composants lazy pour réduire le bundle initial
export const LazyCharts = dynamic(() => import('./Charts'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false,
})

export const LazyDashboard = dynamic(() => import('./OptimizedDashboard'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
})

export const LazyAIAssistant = dynamic(() => import('./AIAssistant'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false,
})

export const LazyOrderHistory = dynamic(() => import('./OrderHistoryDialog'), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />,
})

// Wrapper pour les composants lazy avec Suspense
export const LazyWrapper: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
}> = ({ children, fallback }) => {
  return (
    <Suspense fallback={fallback || <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
      {children}
    </Suspense>
  )
}
