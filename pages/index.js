export default function Home() {
  return (
    <main>
      <h1>Supabase Food Demo (Next.js)</h1>
      <p>This mini app has two parts:</p>
      <ol>
        <li><strong>Add Food</strong> — insert items (name, calories, quantity) into Supabase.</li>
        <li><strong>Inventory</strong> — view items from Supabase and <em>reserve</em> one, which decrements quantity.</li>
      </ol>
      <p>Use the nav links above.</p>
    </main>
  )
}
