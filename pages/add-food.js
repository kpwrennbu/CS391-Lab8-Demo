import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AddFood() {
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function addFood(e) {
    e.preventDefault()
    setMessage('')
    if (!name.trim()) return setMessage('Name is required')
    const cals = parseInt(calories || '0', 10)
    const qty = parseInt(quantity || '0', 10)
    setLoading(true)

    // TODO(1): Insert a new row into the "foods" table with
    // fields { name, calories: cals, quantity: qty } using supabase.from().insert()
    // const { error } = await supabase ... YOUR CODE HERE ...

    const { error } = await supabase.from('foods').insert({ name, calories: cals, quantity: qty }) // ANSWER
    if (error) setMessage(error.message)
    else {
      setMessage('Added!')
      setName(''); setCalories(''); setQuantity('')
    }
    setLoading(false)
  }

  return (
    <main>
      <h2>Add Food</h2>
      <div className="card">
        <form onSubmit={addFood}>
          <div className="row">
            <input placeholder="Food name" value={name} onChange={e=>setName(e.target.value)} />
            <input placeholder="Calories" type="number" value={calories} onChange={e=>setCalories(e.target.value)} />
            <input placeholder="Quantity" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} />
            <button disabled={loading}>{loading ? 'Saving…' : 'Add'}</button>
          </div>
          {message && <small>{message}</small>}
        </form>
      </div>
    </main>
  )
}
