const API_URL = process.env.MUBISYS_API_URL
const API_KEY = process.env.MUBISYS_API_KEY
const API_TOKEN = process.env.MUBISYS_API_TOKEN
const endPoint = `${API_URL}/${API_KEY}`
export async function getProductList() {
  try {
    const res = await fetch(`${endPoint}/produto`, {
      headers: {
        'Access-Token': API_TOKEN,
      },
    })
    if (!res.ok) throw new Error('something was wrong')
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function getMaterialsList() {
  try {
    const res = await fetch(`${endPoint}/materia-prima`, {
      headers: {
        'Access-Token': API_TOKEN,
      },
    })
    if (!res.ok) throw new Error('something was wrong')
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}
