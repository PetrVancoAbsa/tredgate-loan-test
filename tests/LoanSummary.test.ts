import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanSummary from '../src/components/LoanSummary.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanSummary.vue', () => {
  const mockLoans: LoanApplication[] = [
    {
      id: '1',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      amount: 75000,
      termMonths: 36,
      interestRate: 0.06,
      status: 'approved',
      createdAt: '2024-02-20T14:45:00.000Z'
    },
    {
      id: '3',
      applicantName: 'Bob Johnson',
      amount: 120000,
      termMonths: 72,
      interestRate: 0.1,
      status: 'rejected',
      createdAt: '2024-03-10T09:15:00.000Z'
    },
    {
      id: '4',
      applicantName: 'Alice Williams',
      amount: 30000,
      termMonths: 12,
      interestRate: 0.05,
      status: 'approved',
      createdAt: '2024-04-05T16:20:00.000Z'
    },
    {
      id: '5',
      applicantName: 'Charlie Brown',
      amount: 25000,
      termMonths: 18,
      interestRate: 0.07,
      status: 'pending',
      createdAt: '2024-05-12T11:00:00.000Z'
    }
  ]

  it('renders all stat cards', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: mockLoans
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards).toHaveLength(5)
  })

  it('displays correct total applications count', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: mockLoans
      }
    })

    const totalCard = wrapper.findAll('.stat-card')[0]!
    expect(totalCard.find('.stat-value').text()).toBe('5')
    expect(totalCard.find('.stat-label').text()).toBe('Total Applications')
  })

  it('displays correct pending count', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: mockLoans
      }
    })

    const pendingCard = wrapper.findAll('.stat-card')[1]!
    expect(pendingCard.find('.stat-value').text()).toBe('2')
    expect(pendingCard.find('.stat-label').text()).toBe('Pending')
    expect(pendingCard.classes()).toContain('pending')
  })

  it('displays correct approved count', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: mockLoans
      }
    })

    const approvedCard = wrapper.findAll('.stat-card')[2]!
    expect(approvedCard.find('.stat-value').text()).toBe('2')
    expect(approvedCard.find('.stat-label').text()).toBe('Approved')
    expect(approvedCard.classes()).toContain('approved')
  })

  it('displays correct rejected count', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: mockLoans
      }
    })

    const rejectedCard = wrapper.findAll('.stat-card')[3]!
    expect(rejectedCard.find('.stat-value').text()).toBe('1')
    expect(rejectedCard.find('.stat-label').text()).toBe('Rejected')
    expect(rejectedCard.classes()).toContain('rejected')
  })

  it('calculates total approved amount correctly', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: mockLoans
      }
    })

    const amountCard = wrapper.findAll('.stat-card')[4]!
    // 75000 + 30000 = 105000
    expect(amountCard.find('.stat-value').text()).toBe('$105,000')
    expect(amountCard.find('.stat-label').text()).toBe('Total Approved')
    expect(amountCard.classes()).toContain('amount')
  })

  it('displays zero counts when no loans', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[0]?.find('.stat-value').text()).toBe('0')
    expect(statCards[1]?.find('.stat-value').text()).toBe('0')
    expect(statCards[2]?.find('.stat-value').text()).toBe('0')
    expect(statCards[3]?.find('.stat-value').text()).toBe('0')
    expect(statCards[4]?.find('.stat-value').text()).toBe('$0')
  })

  it('displays correct counts with only pending loans', () => {
    const pendingLoans: LoanApplication[] = [
      {
        id: '1',
        applicantName: 'User 1',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        applicantName: 'User 2',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
        status: 'pending',
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ]

    const wrapper = mount(LoanSummary, {
      props: {
        loans: pendingLoans
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[0]?.find('.stat-value').text()).toBe('2')
    expect(statCards[1]?.find('.stat-value').text()).toBe('2')
    expect(statCards[2]?.find('.stat-value').text()).toBe('0')
    expect(statCards[3]?.find('.stat-value').text()).toBe('0')
    expect(statCards[4]?.find('.stat-value').text()).toBe('$0')
  })

  it('displays correct counts with only approved loans', () => {
    const approvedLoans: LoanApplication[] = [
      {
        id: '1',
        applicantName: 'User 1',
        amount: 15000,
        termMonths: 12,
        interestRate: 0.05,
        status: 'approved',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        applicantName: 'User 2',
        amount: 35000,
        termMonths: 24,
        interestRate: 0.06,
        status: 'approved',
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ]

    const wrapper = mount(LoanSummary, {
      props: {
        loans: approvedLoans
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[0]?.find('.stat-value').text()).toBe('2')
    expect(statCards[1]?.find('.stat-value').text()).toBe('0')
    expect(statCards[2]?.find('.stat-value').text()).toBe('2')
    expect(statCards[3]?.find('.stat-value').text()).toBe('0')
    expect(statCards[4]?.find('.stat-value').text()).toBe('$50,000')
  })

  it('displays correct counts with only rejected loans', () => {
    const rejectedLoans: LoanApplication[] = [
      {
        id: '1',
        applicantName: 'User 1',
        amount: 200000,
        termMonths: 120,
        interestRate: 0.1,
        status: 'rejected',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]

    const wrapper = mount(LoanSummary, {
      props: {
        loans: rejectedLoans
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[0]?.find('.stat-value').text()).toBe('1')
    expect(statCards[1]?.find('.stat-value').text()).toBe('0')
    expect(statCards[2]?.find('.stat-value').text()).toBe('0')
    expect(statCards[3]?.find('.stat-value').text()).toBe('1')
    expect(statCards[4]?.find('.stat-value').text()).toBe('$0')
  })

  it('formats large amounts with thousands separator', () => {
    const largeLoans: LoanApplication[] = [
      {
        id: '1',
        applicantName: 'Big Spender',
        amount: 999999,
        termMonths: 60,
        interestRate: 0.08,
        status: 'approved',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]

    const wrapper = mount(LoanSummary, {
      props: {
        loans: largeLoans
      }
    })

    const amountCard = wrapper.findAll('.stat-card')[4]!
    expect(amountCard.find('.stat-value').text()).toBe('$999,999')
  })

  it('updates stats when loans prop changes', async () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    // Initially empty
    expect(wrapper.findAll('.stat-card')[0]?.find('.stat-value').text()).toBe('0')

    // Update with new loans
    await wrapper.setProps({ loans: mockLoans })

    expect(wrapper.findAll('.stat-card')[0]?.find('.stat-value').text()).toBe('5')
    expect(wrapper.findAll('.stat-card')[1]?.find('.stat-value').text()).toBe('2')
    expect(wrapper.findAll('.stat-card')[2]?.find('.stat-value').text()).toBe('2')
  })

  it('computes stats reactively', async () => {
    const initialLoans: LoanApplication[] = [
      {
        id: '1',
        applicantName: 'User 1',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]

    const wrapper = mount(LoanSummary, {
      props: {
        loans: initialLoans
      }
    })

    expect(wrapper.findAll('.stat-card')[1]?.find('.stat-value').text()).toBe('1')
    expect(wrapper.findAll('.stat-card')[2]?.find('.stat-value').text()).toBe('0')

    // Change loan status
    const updatedLoans: LoanApplication[] = [
      {
        ...initialLoans[0]!,
        status: 'approved'
      }
    ]

    await wrapper.setProps({ loans: updatedLoans })

    expect(wrapper.findAll('.stat-card')[1]?.find('.stat-value').text()).toBe('0')
    expect(wrapper.findAll('.stat-card')[2]?.find('.stat-value').text()).toBe('1')
  })
})
