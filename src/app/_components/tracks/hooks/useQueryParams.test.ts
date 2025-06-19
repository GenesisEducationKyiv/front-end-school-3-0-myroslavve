import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useQueryParams from './useQueryParams'
import * as Belt from '@mobily/ts-belt'
import { createParamsObject } from '@/lib/utils/query-params'
import { ReadonlyURLSearchParams, useSearchParams, useRouter } from 'next/navigation'

vi.mock('next/navigation', async (importOriginal) => {
    const actual = await importOriginal<typeof import('next/navigation')>()
    return {
        ...actual,
        useRouter: vi.fn(),
        usePathname: () => '/test-path',
        useSearchParams: vi.fn(() => new ReadonlyURLSearchParams('param1=value1&param2=value2')),
    }
})

vi.mock('@/lib/utils/query-params', () => ({
    createParamsObject: vi.fn()
}))

const mockCreateParamsObject = vi.mocked(createParamsObject)
const mockUseSearchParams = vi.mocked(useSearchParams)
const mockUseRouter = vi.mocked(useRouter)

const mockPush = vi.fn()
const mockSearchParams = new ReadonlyURLSearchParams('param1=value1&param2=value2')

describe('useQueryParams', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        
        mockUseRouter.mockReturnValue({
            push: mockPush,
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn()
        })
        
        mockUseSearchParams.mockReturnValue(mockSearchParams)
    })

    it('should call createParamsObject with correct parameters and return params', () => {
        const paramsList = ['param1', 'param2'] as const
        const mockParams = {
            param1: Belt.O.Some('value1'),
            param2: Belt.O.Some('value2')
        }
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result } = renderHook(() => useQueryParams(paramsList))
        
        expect(mockCreateParamsObject).toHaveBeenCalledWith(paramsList, mockSearchParams)
        expect(result.current.params).toBe(mockParams)
    })

    it('should return setParam function that calls router.push with correct URL', () => {
        const paramsList = ['param1', 'param2'] as const
        const mockParams = {
            param1: Belt.O.Some('value1'),
            param2: Belt.O.Some('value2')
        }
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result } = renderHook(() => useQueryParams(paramsList))
        
        act(() => {
            result.current.setParam('param1', 'newValue')
        })
        
        expect(mockPush).toHaveBeenCalledWith('/test-path?param1=newValue&param2=value2')
    })

    it('should handle empty search params', () => {
        const emptySearchParams = new ReadonlyURLSearchParams()
        mockUseSearchParams.mockReturnValue(emptySearchParams)
        
        const paramsList = ['param1'] as const
        const mockParams = {
            param1: Belt.O.None
        }
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result } = renderHook(() => useQueryParams(paramsList))
        
        act(() => {
            result.current.setParam('param1', 'firstValue')
        })
        
        expect(mockPush).toHaveBeenCalledWith('/test-path?param1=firstValue')
    })

    it('should update existing parameter value', () => {
        const paramsList = ['param1', 'param2'] as const
        const mockParams = {
            param1: Belt.O.Some('oldValue'),
            param2: Belt.O.Some('value2')
        }
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result } = renderHook(() => useQueryParams(paramsList))
        
        act(() => {
            result.current.setParam('param1', 'updatedValue')
        })
        
        expect(mockPush).toHaveBeenCalledWith('/test-path?param1=updatedValue&param2=value2')
    })

    it('should handle special characters in parameter values', () => {
        const paramsList = ['search'] as const
        const mockParams = {
            search: Belt.O.None
        }
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result } = renderHook(() => useQueryParams(paramsList))
        
        act(() => {
            result.current.setParam('search', 'test & value with spaces')
        })
        
        expect(mockPush).toHaveBeenCalledWith('/test-path?param1=value1&param2=value2&search=test+%26+value+with+spaces')
    })

    it('should maintain referential stability of setParam function when dependencies do not change', () => {
        const paramsList = ['param1'] as const
        const mockParams = {
            param1: Belt.O.Some('value1')
        }
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result, rerender } = renderHook(() => useQueryParams(paramsList))
        
        const firstSetParam = result.current.setParam
        
        rerender()
        
        const secondSetParam = result.current.setParam
        
        expect(firstSetParam).toBe(secondSetParam)
    })

    it('should create new URLSearchParams instance for each setParam call', () => {
        const paramsList = ['param1', 'param2'] as const
        const mockParams = {
            param1: Belt.O.Some('value1'),
            param2: Belt.O.Some('value2')
        }
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result } = renderHook(() => useQueryParams(paramsList))
        
        // Call setParam multiple times
        act(() => {
            result.current.setParam('param1', 'first')
        })
        
        act(() => {
            result.current.setParam('param2', 'second')
        })
        
        expect(mockPush).toHaveBeenCalledTimes(2)
        expect(mockPush).toHaveBeenNthCalledWith(1, '/test-path?param1=first&param2=value2')
        expect(mockPush).toHaveBeenNthCalledWith(2, '/test-path?param1=value1&param2=second')
    })

    it('should work with empty paramsList array', () => {
        const paramsList = [] as const
        const mockParams = {}
        
        mockCreateParamsObject.mockReturnValue(mockParams)
        
        const { result } = renderHook(() => useQueryParams(paramsList))
        
        expect(mockCreateParamsObject).toHaveBeenCalledWith(paramsList, mockSearchParams)
        expect(result.current.params).toBe(mockParams)
        expect(result.current.setParam).toBeInstanceOf(Function)
    })
})