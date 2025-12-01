import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmModal from '../src/components/ConfirmModal.vue'

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?'
  }

  let teleportTarget: HTMLElement

  beforeEach(() => {
    // Create a teleport target in the document body
    teleportTarget = document.createElement('div')
    teleportTarget.id = 'teleport-target'
    document.body.appendChild(teleportTarget)
  })

  afterEach(() => {
    // Clean up
    document.body.removeChild(teleportTarget)
  })

  it('should render when isOpen is true', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    // Check in the document body where Teleport renders
    const overlay = document.querySelector('.modal-overlay')
    expect(overlay).toBeTruthy()
    
    const content = document.querySelector('.modal-content')
    expect(content).toBeTruthy()
    
    wrapper.unmount()
  })

  it('should not render when isOpen is false', () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        ...defaultProps,
        isOpen: false
      },
      attachTo: document.body
    })

    const overlay = document.querySelector('.modal-overlay')
    expect(overlay).toBeFalsy()
    
    wrapper.unmount()
  })

  it('should display correct title and message', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const title = document.querySelector('.modal-title')
    const message = document.querySelector('.modal-message')
    
    expect(title?.textContent).toBe('Confirm Action')
    expect(message?.textContent).toBe('Are you sure you want to proceed?')
    
    wrapper.unmount()
  })

  it('should have Cancel and Delete buttons', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const cancelButton = document.querySelector('.btn-ghost')
    const deleteButton = document.querySelector('.btn-delete')

    expect(cancelButton).toBeTruthy()
    expect(cancelButton?.textContent).toBe('Cancel')
    expect(deleteButton).toBeTruthy()
    expect(deleteButton?.textContent).toBe('Delete')
    
    wrapper.unmount()
  })

  it('should emit confirm event when Delete button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const deleteButton = document.querySelector('.btn-delete') as HTMLButtonElement
    deleteButton?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    
    wrapper.unmount()
  })

  it('should emit cancel event when Cancel button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const cancelButton = document.querySelector('.btn-ghost') as HTMLButtonElement
    cancelButton?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    
    wrapper.unmount()
  })

  it('should emit cancel event when overlay is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const overlay = document.querySelector('.modal-overlay') as HTMLElement
    overlay?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('cancel')).toBeTruthy()
    
    wrapper.unmount()
  })

  it('should not emit cancel when modal content is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const modalContent = document.querySelector('.modal-content') as HTMLElement
    modalContent?.click()
    await wrapper.vm.$nextTick()

    // Cancel should not be emitted when clicking inside modal
    expect(wrapper.emitted('cancel')).toBeFalsy()
    
    wrapper.unmount()
  })

  it('should render delete button with danger styling', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const deleteButton = document.querySelector('.btn-delete')
    expect(deleteButton?.classList.contains('btn-delete')).toBe(true)
    
    wrapper.unmount()
  })

  it('should render cancel button with ghost styling', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps,
      attachTo: document.body
    })

    const cancelButton = document.querySelector('.btn-ghost')
    expect(cancelButton?.classList.contains('btn-ghost')).toBe(true)
    
    wrapper.unmount()
  })
})
