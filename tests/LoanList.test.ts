import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanList from '../src/components/LoanList.vue'
import ConfirmModal from '../src/components/ConfirmModal.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanList', () => {
  const mockLoans: LoanApplication[] = [
    {
      id: '1',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 36,
      interestRate: 0.05,
      status: 'pending',
      createdAt: '2025-12-01T00:00:00.000Z'
    }
  ]

  beforeEach(() => {
    // Reset any state if needed
  })

  describe('Delete Button', () => {
    it('should render delete button with Material Icon', () => {
      const wrapper = mount(LoanList, {
        props: {
          loans: mockLoans
        }
      })

      // Find the delete button
      const deleteButton = wrapper.find('button[title="Delete"]')
      expect(deleteButton.exists()).toBe(true)

      // Check that it contains a Material Icon span
      const icon = deleteButton.find('.material-icons')
      expect(icon.exists()).toBe(true)
      expect(icon.text()).toBe('delete')
    })

    it('should have correct CSS class for delete button', () => {
      const wrapper = mount(LoanList, {
        props: {
          loans: mockLoans
        }
      })

      const deleteButton = wrapper.find('button[title="Delete"]')
      expect(deleteButton.classes()).toContain('delete-btn')
    })

    it('should open modal when delete button is clicked', async () => {
      const wrapper = mount(LoanList, {
        props: {
          loans: mockLoans
        }
      })

      const deleteButton = wrapper.find('button[title="Delete"]')
      await deleteButton.trigger('click')

      // Check that modal is open
      const modal = wrapper.findComponent(ConfirmModal)
      expect(modal.exists()).toBe(true)
      expect(modal.props('isOpen')).toBe(true)
    })

    it('should pass correct props to modal', async () => {
      const wrapper = mount(LoanList, {
        props: {
          loans: mockLoans
        }
      })

      const deleteButton = wrapper.find('button[title="Delete"]')
      await deleteButton.trigger('click')

      const modal = wrapper.findComponent(ConfirmModal)
      expect(modal.props('title')).toBe('Delete Loan Application')
      expect(modal.props('message')).toContain('John Doe')
      expect(modal.props('message')).toContain('cannot be undone')
    })

    it('should emit delete event when modal confirms', async () => {
      const wrapper = mount(LoanList, {
        props: {
          loans: mockLoans
        }
      })

      // Click delete button to open modal
      const deleteButton = wrapper.find('button[title="Delete"]')
      await deleteButton.trigger('click')

      // Confirm deletion in modal
      const modal = wrapper.findComponent(ConfirmModal)
      await modal.vm.$emit('confirm')

      // Check that delete event was emitted with correct ID
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')?.[0]).toEqual(['1'])
    })

    it('should close modal when cancel is clicked', async () => {
      const wrapper = mount(LoanList, {
        props: {
          loans: mockLoans
        }
      })

      // Click delete button to open modal
      const deleteButton = wrapper.find('button[title="Delete"]')
      await deleteButton.trigger('click')

      // Cancel deletion in modal
      const modal = wrapper.findComponent(ConfirmModal)
      await modal.vm.$emit('cancel')

      // Wait for next tick
      await wrapper.vm.$nextTick()

      // Check that modal is closed
      expect(modal.props('isOpen')).toBe(false)
    })

    it('should not emit delete event when cancel is clicked', async () => {
      const wrapper = mount(LoanList, {
        props: {
          loans: mockLoans
        }
      })

      // Click delete button to open modal
      const deleteButton = wrapper.find('button[title="Delete"]')
      await deleteButton.trigger('click')

      // Cancel deletion in modal
      const modal = wrapper.findComponent(ConfirmModal)
      await modal.vm.$emit('cancel')

      // Check that delete event was not emitted
      expect(wrapper.emitted('delete')).toBeFalsy()
    })
  })

  describe('Multiple loans', () => {
    it('should render delete button for each loan', () => {
      const multipleLoans: LoanApplication[] = [
        { ...mockLoans[0], id: '1', applicantName: 'John Doe' },
        { ...mockLoans[0], id: '2', applicantName: 'Jane Smith' },
        { ...mockLoans[0], id: '3', applicantName: 'Bob Johnson' }
      ]

      const wrapper = mount(LoanList, {
        props: {
          loans: multipleLoans
        }
      })

      const deleteButtons = wrapper.findAll('button[title="Delete"]')
      expect(deleteButtons).toHaveLength(3)
    })
  })
})
