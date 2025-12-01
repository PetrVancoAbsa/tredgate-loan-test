import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanForm from '../src/components/LoanForm.vue'
import * as loanService from '../src/services/loanService'

// Mock the loanService module
vi.mock('../src/services/loanService', () => ({
  createLoanApplication: vi.fn()
}))

describe('LoanForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with all input fields', () => {
    const wrapper = mount(LoanForm)

    expect(wrapper.find('#applicantName').exists()).toBe(true)
    expect(wrapper.find('#amount').exists()).toBe(true)
    expect(wrapper.find('#termMonths').exists()).toBe(true)
    expect(wrapper.find('#interestRate').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('renders correct heading', () => {
    const wrapper = mount(LoanForm)

    expect(wrapper.find('h2').text()).toBe('New Loan Application')
  })

  it('shows error when applicant name is empty', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Applicant name is required')
  })

  it('shows error when amount is not provided', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toBe('Amount must be greater than 0')
  })

  it('shows error when amount is zero', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(0)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toBe('Amount must be greater than 0')
  })

  it('shows error when termMonths is not provided', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toBe('Term months must be greater than 0')
  })

  it('shows error when interestRate is not provided', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toBe('Interest rate is required and cannot be negative')
  })

  it('shows error when interestRate is negative', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(-0.05)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toBe('Interest rate is required and cannot be negative')
  })

  it('creates loan application with valid input', async () => {
    const mockLoan = {
      id: 'test-id',
      applicantName: 'John Doe',
      amount: 10000,
      termMonths: 12,
      interestRate: 0.05,
      status: 'pending' as const,
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    vi.mocked(loanService.createLoanApplication).mockReturnValue(mockLoan)

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(0.05)
    await wrapper.find('form').trigger('submit.prevent')

    expect(loanService.createLoanApplication).toHaveBeenCalledWith({
      applicantName: 'John Doe',
      amount: 10000,
      termMonths: 12,
      interestRate: 0.05
    })
  })

  it('emits created event on successful submission', async () => {
    const mockLoan = {
      id: 'test-id',
      applicantName: 'Jane Smith',
      amount: 25000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending' as const,
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    vi.mocked(loanService.createLoanApplication).mockReturnValue(mockLoan)

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('Jane Smith')
    await wrapper.find('#amount').setValue(25000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('created')).toBeTruthy()
    expect(wrapper.emitted('created')).toHaveLength(1)
  })

  it('resets form after successful submission', async () => {
    const mockLoan = {
      id: 'test-id',
      applicantName: 'Test User',
      amount: 5000,
      termMonths: 6,
      interestRate: 0.04,
      status: 'pending' as const,
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    vi.mocked(loanService.createLoanApplication).mockReturnValue(mockLoan)

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('Test User')
    await wrapper.find('#amount').setValue(5000)
    await wrapper.find('#termMonths').setValue(6)
    await wrapper.find('#interestRate').setValue(0.04)
    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick()

    expect((wrapper.find('#applicantName').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#amount').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#termMonths').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#interestRate').element as HTMLInputElement).value).toBe('')
  })

  it('displays error message when service throws error', async () => {
    vi.mocked(loanService.createLoanApplication).mockImplementation(() => {
      throw new Error('Service error occurred')
    })

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(0.05)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toBe('Service error occurred')
  })

  it('trims applicant name whitespace', async () => {
    const mockLoan = {
      id: 'test-id',
      applicantName: 'John Doe',
      amount: 10000,
      termMonths: 12,
      interestRate: 0.05,
      status: 'pending' as const,
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    vi.mocked(loanService.createLoanApplication).mockReturnValue(mockLoan)

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('  John Doe  ')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(0.05)
    await wrapper.find('form').trigger('submit.prevent')

    expect(loanService.createLoanApplication).toHaveBeenCalledWith({
      applicantName: 'John Doe',
      amount: 10000,
      termMonths: 12,
      interestRate: 0.05
    })
  })
})
