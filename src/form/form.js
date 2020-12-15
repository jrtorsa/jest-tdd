import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import {saveProduct} from '../services/productServices'

const Form = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  })

  const validateField = ({name, value}) => {
    setFormErrors(prevState => ({
      ...prevState,
      [name]: value.length ? '' : `The ${name} is required`,
    }))
  }

  const validateForm = ({name, size, type}) => {
    validateField({name: 'name', value: name})
    validateField({name: 'size', value: size})
    validateField({name: 'type', value: type})
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSaving(true)
    const {name, size, type} = e.target.elements

    validateForm({name: name.value, size: size.value, type: type.value})

    const response = await saveProduct()
    console.log(response)

    setIsSaving(false)
  }

  const handleBlur = e => {
    const {name, value} = e.target

    validateField({name, value})
  }

  return (
    <>
      <h1>Create Product</h1>
      {isSuccess && <p>Product Stored</p>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="name"
          name="name"
          id="name"
          helperText={formErrors.name}
          onBlur={handleBlur}
        />
        <TextField
          label="size"
          name="size"
          id="size"
          helperText={formErrors.size}
          onBlur={handleBlur}
        />
        <InputLabel htmlFor="type">Type</InputLabel>
        <Select native value="" inputProps={{name: 'type', id: 'type'}}>
          <option aria-label="None" value="" />
          <option value="electronic">Electronic</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
        </Select>
        {formErrors.type.length && <p>{formErrors.type}</p>}
        <Button disabled={isSaving} type="submit">
          Submit
        </Button>
      </form>
    </>
  )
}

export default Form
