import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Inventory() {
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function load() {
    // TODO(2): Select all rows from "foods" ordered by created_at desc
    // const { data, error } = await supabase ... YOUR CODE HERE ...
    
    if (error) console.error(error)
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function reserveSelected() {
    setMessage('')
    if (!selectedId) return setMessage('Pick a row first')
    const item = items.find(i => i.id === selectedId)
    if (!item) return
    if (item.quantity <= 0) return setMessage('No quantity left')
    setLoading(true)

    // TODO(3): Decrement the quantity by 1 for the selected row.
    // Use supabase.from('foods').update({ quantity: item.quantity - 1 }).eq('id', selectedId)
    // const { error } = await supabase ... YOUR CODE HERE ...


    if (error) setMessage(error.message)
    else {
      setMessage('Reserved!')
      await load()
    }
    setLoading(false)
  }

  return (
    <main>
      <h2>Inventory</h2>
      <div className="card">
        <button onClick={load}>Refresh</button>
        <button onClick={reserveSelected} disabled={loading} style={{marginLeft: '0.5rem'}}>
          {loading ? 'Reserving…' : 'Reserve Selected'}
        </button>
        {message && <div><small>{message}</small></div>}
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Calories</th>
              <th>Quantity</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map(row => (
              <tr key={row.id} className={row.id === selectedId ? 'selected' : ''} onClick={() => setSelectedId(row.id)}>
                <td>{row.id === selectedId ? '✓' : ''}</td>
                <td>{row.name}</td>
                <td>{row.calories}</td>
                <td>{row.quantity}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
