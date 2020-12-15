import React from 'react'
import {screen, render, fireEvent, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Form from './form'

const server = setupServer(
  rest.post('/products', (req, res, ctx) => res(ctx.status(201))),
)

beforeAll(() => server.listen())

afterAll(() => server.close())

beforeEach(() => render(<Form />))
// when elements are first rendered
describe('when the form is mounted', () => {
  it('there must be a create product form page', () => {
    //render(<Form />)
    //     expect(screen.queryByText(/create product/i)).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {name: /create product/i}),
    ).toBeInTheDocument()
  })

  it('should exist the fields: name, size, type(electronic, furniture, clothing)', () => {
    //render(<Form />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()

    expect(screen.queryByText(/electronic/i)).toBeInTheDocument()
    expect(screen.queryByText(/furniture/i)).toBeInTheDocument()
    expect(screen.queryByText(/clothing/i)).toBeInTheDocument()
  })

  it('should exist the submit button', () => {
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument()
  })
})

// when user input is triggered
describe('when the user submits the form without values', () => {
  it('should display validation messages', async () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

    await waitFor(() =>
      expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled(),
    )
  })
})

// if the user blurs a field that is empty
describe('when the user blurs an empty field', () => {
  it('should display a validation error message for the input name', () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {name: 'name', value: ''},
    })

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
  })

  it('should display a validation error message for the input size', () => {
    render(<Form />)
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: {name: 'size', value: ''},
    })

    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
  })
})

describe('when the user submits the form', () => {
  it('the submit button should be disabled until the request is done', async () => {
    const submitBtn = screen.getByRole('button', {name: /submit/i})

    expect(submitBtn).not.toBeDisabled()

    fireEvent.click(submitBtn)

    expect(submitBtn).toBeDisabled()

    await waitFor(() => expect(submitBtn).not.toBeDisabled())
  })

  //   it('the form page must display the success message "product stored" and clean the field values', async () => {
  //     fireEvent.click(screen.getByRole('button', {name: /submit/i}))

  //     await waitFor(() =>
  //       expect(screen.getByText(/product stored/i)).toBeInTheDocument(),
  //     )
  //   })
})
