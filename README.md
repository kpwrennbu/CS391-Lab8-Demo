# Next.js + Supabase Food Demo (Two-Page Classroom Exercise)

This demo lets students:
1) **Add Food** items (name, calories, quantity) into Supabase.
2) **View Inventory** and **Reserve** one item (decrements quantity in Supabase).

---

## 0) Create the table in Supabase (SQL)
Run this in the Supabase SQL editor:

```sql
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  calories integer not null default 0,
  quantity integer not null default 0,
  created_at timestamptz default now()
);

alter table foods enable row level security;

-- Simple demo policies (OK for class demos; tighten later)
create policy "Allow anon select foods" on foods for select using (true);
create policy "Allow anon insert foods" on foods for insert with check (true);
create policy "Allow anon update foods" on foods for update using (true) with check (true);
```

> ✅ We allow `update` so students can decrement quantity from the browser.

---

## 1) Local setup

```bash
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

npm i
npm run dev
# Visit http://localhost:3000
```

You’ll see nav links for **Add Food** and **Inventory**.

---

## 2) TODOs in the code (student exercise)

Open these files and search for `TODO(...)`.

### A) `pages/add-food.js`
- **TODO(1):** Insert a row into `foods` with `{ name, calories: cals, quantity: qty }`.
  **Hint:** `supabase.from('foods').insert({...})`

### B) `pages/inventory.js`
- **TODO(2):** Load all rows from `foods` ordered by `created_at desc`.
  **Hint:** `supabase.from('foods').select('*').order('created_at', { ascending: false })`

- **TODO(3):** Decrement the selected row’s `quantity` by 1.
  **Hint:** `supabase.from('foods').update({ quantity: current - 1 }).eq('id', rowId)`

---

## 3) Answers (for instructors)

> Keep hidden at first; reveal after students try.

**Answer for TODO(1) – add-food.js**
```js
const { error } = await supabase
  .from('foods')
  .insert({ name, calories: cals, quantity: qty })
```

**Answer for TODO(2) – inventory.js**
```js
const { data, error } = await supabase
  .from('foods')
  .select('*')
  .order('created_at', { ascending: false })
```

**Answer for TODO(3) – inventory.js**
```js
const { error } = await supabase
  .from('foods')
  .update({ quantity: item.quantity - 1 })
  .eq('id', selectedId)
```

---

## 4) Optional: Safer decrement (race-condition note)

For a production app, consider a Postgres function to decrement atomically:
```sql
create or replace function reserve_food(food_id uuid)
returns void
language sql as $$
  update foods set quantity = greatest(quantity - 1, 0)
  where id = food_id and quantity > 0;
$$;
```

Then call with the Supabase client:
```js
await supabase.rpc('reserve_food', { food_id: selectedId })
```

Remember to add an RLS policy to allow calling the function if needed.

---

## 5) What students should observe
- Adding rows from the **Add Food** page immediately appears on **Inventory** after refresh.
- Clicking a row then **Reserve Selected** decrements its quantity in Supabase and updates the table.
