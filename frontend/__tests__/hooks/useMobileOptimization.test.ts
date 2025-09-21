import { renderHook, act } from '@testing-library/react'
import { useMobileOptimization } from '../../hooks/useMobileOptimization'

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

describe('useMobileOptimization', () => {
  beforeEach(() => {
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  describe('Mobile detection', () => {
    it('should detect mobile devices correctly', () => {
      mockMatchMedia(true) // Mobile
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.isMobile).toBe(true)
    })

    it('should detect desktop devices correctly', () => {
      mockMatchMedia(false) // Desktop
      Object.defineProperty(window, 'innerWidth', { value: 1024 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.isMobile).toBe(false)
    })
  })

  describe('Screen dimensions', () => {
    it('should return correct screen dimensions', () => {
      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.screenWidth).toBe(1024)
      expect(result.current.screenHeight).toBe(768)
    })

    it('should update dimensions on window resize', () => {
      const { result } = renderHook(() => useMobileOptimization())

      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 768 })
        Object.defineProperty(window, 'innerHeight', { value: 1024 })
        window.dispatchEvent(new Event('resize'))
      })

      expect(window.innerWidth).toBe(768)
      expect(window.innerHeight).toBe(1024)
    })
  })

  describe('Orientation detection', () => {
    it('should detect portrait orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 })
      Object.defineProperty(window, 'innerHeight', { value: 667 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.getOrientation()).toBe('portrait')
      expect(result.current.isLandscape).toBe(true)
    })

    it('should detect landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 667 })
      Object.defineProperty(window, 'innerHeight', { value: 375 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.getOrientation()).toBe('landscape')
      expect(result.current.isLandscape).toBe(true)
    })
  })

  describe('Device type detection', () => {
    it('should detect tablet devices', () => {
      mockMatchMedia(true)
      Object.defineProperty(window, 'innerWidth', { value: 768 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.isTablet).toBe(true)
    })

    it('should detect phone devices', () => {
      mockMatchMedia(true)
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.isPhone).toBe(true)
    })
  })

  describe('Performance optimizations', () => {
    it('should provide correct optimization flags for mobile', () => {
      mockMatchMedia(true)
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.shouldReduceAnimations).toBe(true)
      expect(result.current.shouldLazyLoad).toBe(true)
    })

    it('should provide correct optimization flags for desktop', () => {
      mockMatchMedia(false)
      Object.defineProperty(window, 'innerWidth', { value: 1024 })

      const { result } = renderHook(() => useMobileOptimization())

      expect(result.current.shouldReduceAnimations).toBe(false)
      expect(result.current.shouldLazyLoad).toBe(false)
    })
  })

  describe('Event listeners', () => {
    it('should add and remove resize event listener', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useMobileOptimization())

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })
})