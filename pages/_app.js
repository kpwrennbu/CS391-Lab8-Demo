import '../styles/globals.css'
import Link from 'next/link'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/add-food">Add Food</Link>
        <Link href="/inventory">Inventory</Link>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}
