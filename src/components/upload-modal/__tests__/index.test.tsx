import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UploadModal from '..'
import { Button } from '../../ui/button'

describe('UploadModal', () => {
  it('should render correctly', () => {
    render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded={''} />)

    expect(screen.getByText('Upload')).toBeDefined()
  })

  it('should render custom button', () => {
    render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded={''} customButton={<Button>Custom Button</Button>} />)

    expect(screen.getByText('Custom Button')).toBeDefined()
  })

  it('should open modal when button is clicked', () => {
    render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded={''} />)

    fireEvent.click(screen.getByText('Upload'))

    expect(screen.getByText('Upload a file for the track')).toBeDefined()
  })

  it('should accept valid MP3 file', () => {
    render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded="" />)
    
    fireEvent.click(screen.getByText('Upload'))
    
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' })
    const input = screen.getByTestId('file-input')
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(screen.getByText('Selected: test.mp3')).toBeDefined()
  })

  it('should reject invalid file types', async () => {
    render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded="" />)

    fireEvent.click(screen.getByText('Upload'))

    const file = new File(['audio content'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByTestId('file-input')

    fireEvent.change(input, { target: { files: [file] } })
    fireEvent.click(screen.getByTestId('upload-button'))

    expect(screen.findByText('File must be a valid MP3 or WAV file')).resolves.toBeDefined()
  })

  it('should show delete button when file is uploaded', () => {
    render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded="test.mp3" />)

    fireEvent.click(screen.getByText('Upload'))

    expect(screen.getByText('Delete')).toBeDefined()
  })
})