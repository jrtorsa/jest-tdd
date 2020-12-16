export const saveProduct = ({name, size, type}) => {
  return fetch('/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name, size, type}),
  })
}

export default {
  saveProduct,
}
