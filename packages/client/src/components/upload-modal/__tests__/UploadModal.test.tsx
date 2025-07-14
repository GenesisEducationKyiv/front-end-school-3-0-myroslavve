import { fireEvent, render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import UploadModal from '@/components/upload-modal'
import { Button } from '@/components/ui/button'

it('should render correctly', () => {
  render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded={''} />)

  expect(screen.getByText('Upload')).toBeDefined()
})

it('should render custom button', () => {
  render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded={''} customButton={<Button>Custom Button</Button>} />)

  expect(screen.getByText('Custom Button')).toBeDefined()
})

it('should open modal when button is clicked', async () => {
  render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded={''} />)

  fireEvent.click(screen.getByText('Upload'))

  expect(await screen.findByText('Upload a file for the track')).toBeDefined()
})

it('should accept valid MP3 file', async () => {
  render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded="" />)
  
  fireEvent.click(screen.getByText('Upload'))
  
  const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' })
  const input = await screen.findByTestId('file-input')
  
  fireEvent.change(input, { target: { files: [file] } })
  
  expect(screen.getByText('Selected: test.mp3')).toBeDefined()
  expect(screen.queryByText('File must be a valid MP3 or WAV file')).toBeNull()
})

it('should reject invalid file types', async () => {
  render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded="" />)

  fireEvent.click(screen.getByText('Upload'))

  const file = new File(['audio content'], 'test.txt', { type: 'text/plain' })
  const input = await screen.findByTestId('file-input')

  fireEvent.change(input, { target: { files: [file] } })
  fireEvent.click(screen.getByTestId('upload-button'))

  await expect(screen.findByText('File must be a valid MP3 or WAV file')).resolves.toBeDefined()
})

it('should show delete button when file is uploaded', async () => {
  render(<UploadModal onUpload={() => {}} onDelete={() => {}} uploaded="test.mp3" />)

  fireEvent.click(screen.getByText('Upload'))

  expect(await screen.findByText('Delete')).toBeDefined()
})