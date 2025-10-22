

# Project Guide — File-by-File (Next.js + Supabase Food Demo)

## Project structure

```
nextjs-supabase-food-demo/
├─ pages/
│  ├─ _app.js
│  ├─ index.js
│  ├─ add-food.js
│  └─ inventory.js
├─ lib/
│  └─ supabaseClient.js
├─ styles/
│  └─ globals.css
├─ components/          # (empty placeholder for teaching—safe to delete)
├─ .env.local.example
├─ next.config.js
├─ package.json
└─ README.md
```

## Top-level files

### `package.json`

* Declares the app name and dependencies:

  * `next`, `react`, `react-dom`
  * `@supabase/supabase-js` (Supabase client)
* Scripts:

  * `dev`: run the development server at `http://localhost:3000`
  * `build`: build for production
  * `start`: run the production build

### `.env.local`

* Template for environment variables:

  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* Copy this to `.env.local` and fill in your project’s values from the Supabase dashboard.
* **Tip:** Anything prefixed with `NEXT_PUBLIC_` is exposed to the browser (intended for public/anon keys).

### `next.config.js`

* Minimal Next.js config with `reactStrictMode: true`.
* Keeps the demo simple and easy to run anywhere.

### `README.md`

* Main walkthrough for the demo (SQL to create the table, setup, TODOs for students, and instructor answers).
* Includes an optional “atomic decrement” RPC suggestion for more robust production logic.

## Source folders

### `lib/supabaseClient.js`

* Centralizes the Supabase client initialization:

  ```js
  import { createClient } from '@supabase/supabase-js';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  export const supabase = createClient(supabaseUrl, supabaseKey);
  ```
* Imported anywhere you need to query Supabase from the frontend.

### `styles/globals.css`

* Light, global CSS for the whole demo:

  * Page padding, simple card layout, inputs, buttons, table styles.
* Keeps UI consistent and readable for classroom demos.

### `components/` (empty)

* Placeholder to show where you’d put reusable UI pieces (e.g., a reusable `Table`, `Form`, or `Navbar`).
* Safe to delete for this exercise.

## Pages (Next.js “pages” router)

### `pages/_app.js`

* Next.js custom App component that wraps every page.
* Adds a simple top nav for quick navigation between pages:

  ```jsx
  <nav>
    <Link href="/">Home</Link>
    <Link href="/add-food">Add Food</Link>
    <Link href="/inventory">Inventory</Link>
  </nav>
  ```
* Imports `styles/globals.css`.

### `pages/index.js` (Home)

* Landing page that explains the two parts of the demo:

  1. **Add Food** — insert `name`, `calories`, `quantity`.
  2. **Inventory** — list items and **reserve** (decrement quantity).
* No Supabase calls here; just orientation and links.

### `pages/add-food.js`

* **Goal:** Insert new rows into the `foods` table.
* Form fields:

  * `name` (string)
  * `calories` (number)
  * `quantity` (number)
* On submit, calls Supabase **insert**:

  ```js
  const { error } = await supabase
    .from('foods')
    .insert({ name, calories: cals, quantity: qty })
  ```
* Includes a **TODO(1)** comment so students can practice writing the insert call (answer is in the README).

**Data flow (Add Food):**

1. User enters values → clicks **Add**.
2. Frontend validates input (basic checks) and parses numbers.
3. `supabase.from('foods').insert({...})` runs.
4. On success, the form clears and shows “Added!”.

### `pages/inventory.js`

* **Goal:** Display the table and allow **Reserve Selected** to decrement quantity.
* On mount or refresh, calls Supabase **select**:

  ```js
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('created_at', { ascending: false })
  ```

  (This is **TODO(2)** for students.)
* Renders a table of foods. Clicking a row selects it (highlighted).
* **Reserve Selected** button:

  * Validates a row is selected and has `quantity > 0`.
  * Calls Supabase **update** to decrement by 1:

    ```js
    const { error } = await supabase
      .from('foods')
      .update({ quantity: item.quantity - 1 })
      .eq('id', selectedId)
    ```

    (This is **TODO(3)** for students.)
  * On success, reloads the table.

**Data flow (Inventory & Reserve):**

1. Component loads → fetches rows from `foods`.
2. User clicks a row → `selectedId` is set.
3. User clicks **Reserve Selected**:

   * If selected item has `quantity > 0`, send an update to decrement.
   * Refresh the list so the new quantity is visible.

## Database & RLS policies (from `README.md`)

The demo expects a `foods` table and permissive RLS policies (fine for class demos):

```sql
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  calories integer not null default 0,
  quantity integer not null default 0,
  created_at timestamptz default now()
);

alter table foods enable row level security;

-- Demo policies (OK for class; tighten later)
create policy "Allow anon select foods" on foods for select using (true);
create policy "Allow anon insert foods" on foods for insert with check (true);
create policy "Allow anon update foods" on foods for update using (true) with check (true);
```

> **Why allow `update`?** So the browser/demo can decrement quantity without a server.
> **Production note:** You’d typically restrict policies and/or move mutations behind a server (e.g., RPC or API route).

## Where the student TODOs are

* `pages/add-food.js` → **TODO(1)** *(insert new food row)*
* `pages/inventory.js` → **TODO(2)** *(load foods)*, **TODO(3)** *(decrement quantity)*
  Answers are provided at the bottom of the main `README.md`.

## How to extend (ideas for class)

* Add **Auth** (email magic links) and show user-specific rows.
* Add **edit/delete** for foods.
* Add an **atomic decrement** via a Postgres function (`rpc`) to avoid race conditions.
* Show **realtime** updates (Supabase channel subscriptions) so the table updates without manual refresh.

