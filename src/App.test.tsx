import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the starter page links and copy', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /get started/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/save to test/i)).toHaveTextContent(
      'Edit src/App.tsx and save to test HMR',
    )
    expect(screen.getByRole('link', { name: /explore vite/i })).toHaveAttribute(
      'href',
      'https://vite.dev/',
    )
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute(
      'href',
      'https://react.dev/',
    )
  })

  it('increments the counter when clicked', async () => {
    const user = userEvent.setup()

    render(<App />)

    const counter = screen.getByRole('button', { name: /count is 0/i })
    await user.click(counter)

    expect(counter).toHaveTextContent('Count is 1')
  })
})
