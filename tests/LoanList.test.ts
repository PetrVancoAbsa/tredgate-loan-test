import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanList from '../src/components/LoanList.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanList.vue', () => {
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
    }
  ]

  it('renders heading', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: []
      }
    })

    expect(wrapper.find('h2').text()).toBe('Loan Applications')
  })

  it('displays empty state when no loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: []
      }
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state p').text()).toContain('No loan applications yet')
  })

  it('does not display table when no loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: []
      }
    })

    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('displays table when loans exist', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: mockLoans
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })

  it('renders table headers correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: mockLoans
      }
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(8)
    expect(headers[0]?.text()).toBe('Applicant')
    expect(headers[1]?.text()).toBe('Amount')
    expect(headers[2]?.text()).toBe('Term')
    expect(headers[3]?.text()).toBe('Rate')
    expect(headers[4]?.text()).toBe('Monthly Payment')
    expect(headers[5]?.text()).toBe('Status')
    expect(headers[6]?.text()).toBe('Created')
    expect(headers[7]?.text()).toBe('Actions')
  })

  it('renders loan data in table rows', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: mockLoans
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)

    // Check first loan data
    const firstRowCells = rows[0]?.findAll('td')
    expect(firstRowCells?.[0]?.text()).toBe('John Doe')
    expect(firstRowCells?.[1]?.text()).toContain('$50,000')
    expect(firstRowCells?.[2]?.text()).toBe('24 mo')
    expect(firstRowCells?.[3]?.text()).toBe('8.0%')
  })

  it('formats currency correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const amountCell = wrapper.find('tbody tr td:nth-child(2)')
    expect(amountCell.text()).toBe('$50,000.00')
  })

  it('formats percentage correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const rateCell = wrapper.find('tbody tr td:nth-child(4)')
    expect(rateCell.text()).toBe('8.0%')
  })

  it('formats date correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const dateCell = wrapper.find('tbody tr td:nth-child(7)')
    // Date format varies by locale, just check it's not empty
    expect(dateCell.text()).toBeTruthy()
  })

  it('calculates and displays monthly payment', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const paymentCell = wrapper.find('tbody tr td:nth-child(5)')
    // 50000 * 1.08 / 24 = 2250
    expect(paymentCell.text()).toContain('$2,250')
  })

  it('displays status badge with correct class for pending', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const statusBadge = wrapper.find('.status-badge')
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.text()).toBe('pending')
    expect(statusBadge.classes()).toContain('status-pending')
  })

  it('displays status badge with correct class for approved', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[1]!]
      }
    })

    const statusBadge = wrapper.find('.status-badge')
    expect(statusBadge.classes()).toContain('status-approved')
    expect(statusBadge.text()).toBe('approved')
  })

  it('displays status badge with correct class for rejected', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[2]!]
      }
    })

    const statusBadge = wrapper.find('.status-badge')
    expect(statusBadge.classes()).toContain('status-rejected')
    expect(statusBadge.text()).toBe('rejected')
  })

  it('shows action buttons for pending loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const actionButtons = wrapper.findAll('.action-btn')
    expect(actionButtons).toHaveLength(3)
    expect(actionButtons[0]?.classes()).toContain('success') // Approve
    expect(actionButtons[1]?.classes()).toContain('danger') // Reject
    expect(actionButtons[2]?.classes()).toContain('secondary') // Auto-decide
  })

  it('does not show action buttons for approved loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[1]!]
      }
    })

    const actionButtons = wrapper.findAll('.action-btn')
    expect(actionButtons).toHaveLength(0)
    expect(wrapper.find('.no-actions').exists()).toBe(true)
  })

  it('does not show action buttons for rejected loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[2]!]
      }
    })

    const actionButtons = wrapper.findAll('.action-btn')
    expect(actionButtons).toHaveLength(0)
    expect(wrapper.find('.no-actions').exists()).toBe(true)
  })

  it('emits approve event when approve button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const approveButton = wrapper.findAll('.action-btn')[0]!
    await approveButton.trigger('click')

    expect(wrapper.emitted('approve')).toBeTruthy()
    expect(wrapper.emitted('approve')?.[0]).toEqual(['1'])
  })

  it('emits reject event when reject button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const rejectButton = wrapper.findAll('.action-btn')[1]!
    await rejectButton.trigger('click')

    expect(wrapper.emitted('reject')).toBeTruthy()
    expect(wrapper.emitted('reject')?.[0]).toEqual(['1'])
  })

  it('emits autoDecide event when auto-decide button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]!]
      }
    })

    const autoDecideButton = wrapper.findAll('.action-btn')[2]!
    await autoDecideButton.trigger('click')

    expect(wrapper.emitted('autoDecide')).toBeTruthy()
    expect(wrapper.emitted('autoDecide')?.[0]).toEqual(['1'])
  })

  it('renders multiple loans correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: mockLoans
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)

    // Verify each loan is rendered
    expect(rows[0]?.text()).toContain('John Doe')
    expect(rows[1]?.text()).toContain('Jane Smith')
    expect(rows[2]?.text()).toContain('Bob Johnson')
  })
})
