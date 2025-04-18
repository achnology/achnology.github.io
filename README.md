# COMP1004 Coursework Website – Pablo Gallegos Vargas
---

###  Live Link 
[https://achnology.github.io](https://achnology.github.io)
---
### Summary 📝
This coursework consists of a responsive web application with three main functional HTML pages using Supabase as the backend. The project is made for:

- Searching people by name or license number
- Searching vehicles by registration number
- Adding vehicles to the database with either existing or new owners

Accessibility, performance, and layout stability were addressed based on Lighthouse audits and Supabase testing.
---

### ✅ Completed Features (Sequentially)

- Set up Supabase project with `people` and `vehicles` tables.
- Configured foreign key relationship between vehicles and owners.
- Created and styled:
  - `people_search.html`
  - `vehicle_search.html`
  - `add_vehicle.html`
- Wrote full Supabase JavaScript logic in `scripts.js`:
  - Query people by name or license
  - Query vehicles and join owners
  - Add new vehicles and prevent duplicates
  - Select or create a new owner
- Implemented error messages and success feedback with accessibility in mind.
- Polished all forms with labels, aria attributes, and client-side validation.
- Resolved persistent CLS issues using CSS techniques (`aspect-ratio`, `min-height`, image placeholders).
- Achieved 100% Lighthouse scores for Accessibility, SEO, and Best Practices; 99–100% Performance.
- Added a custom `index.html` landing page with links to all tools.
- Created a shared `styles.css` using Grid and Flexbox layout.
- Performed multiple rounds of Lighthouse testing on all 3 HTML pages.
- Set up a cron job to prevent Supabase from sleeping.
- Used GitHub Pages to host the entire website.
- Prepared all submission screenshots and testing summaries.

## HTML & CSS 👾

### Pages and Features

| Page                | Key Features                                               |
|---------------------|------------------------------------------------------------|
| `index.html`        | Navigation homepage with links to all tools                |
| `people_search.html`| Form to search by name/license; handles no-match cases     |
| `vehicle_search.html`| Vehicle lookup with owner details                         |
| `add_vehicle.html`  | Add new vehicle and optionally new owner                   |

### CSS Features 👾

- Shared styling across all pages (`styles.css`)
- Flexbox navigation
- Grid layout via `#container`
- Responsive stacking under 500px
- Fully accessible buttons, labels, and input fields
- Sidebar image using transparent pixel and `aspect-ratio` for layout stability

**Accessibility Score:** 100/100  
**Responsive Design:** Yes – tested under 500px screen width  
**CSS File:** `styles.css`
---
##  JavaScript & Database 👾

- All JavaScript lives in `scripts.js`
- People and vehicle searches use `.ilike()` for case-insensitive partial matching
- Vehicle and person details fetched and displayed dynamically
- Duplicate owner check using full field match
- Dynamic feedback shown using ARIA-friendly roles

### Key DOM IDs (used in Playwright):

| Page             | Element IDs                                    |
|------------------|------------------------------------------------|
| All pages        | `message`, `results`                           |
| Add vehicle      | `owner`, `rego`, `make`, `model`, `colour`, `new-owner-form`, `add-owner`, `check-owner`, `add-vehicle` |
| People search    | `name`, `license`                              |

## Lighthouse Results 

✅ **Accessibility:** 100  
✅ **Best Practices:** 100  
✅ **SEO:** 100  
✅ **Performance:** 99–100 on all pages

### Screenshots

![People Search Lighthouse](screenshots/lighthouse-people-search.png)  
![Vehicle Search Lighthouse](screenshots/lighthouse-vehicle_search.png)  
![Add Vehicle Lighthouse](screenshots/lighthouse-add_vehicle.png)  
![Index Lighthouse](screenshots/lighthouse-index.png)
---
##  Supabase Cron Job 👾

To prevent my Supabase database from sleeping (as it auto-pauses after 7 days of inactivity), I set up a **cron job** using [cron-job.org](https://cron-job.org/).

- The cron job makes a GET request every day to one of my Supabase-powered pages (e.g. `people_search.html`)
- This keeps the Supabase project active and ensures the site is always ready for assessment
- The setup involved:
  - Creating a free account on cron-job.org
  - Scheduling the job to hit `https://achnology.github.io/people_search.html` every 24 hours
  - Confirming the job status in the cron-job dashboard

✅ This ensures consistent uptime and access for marking and testing purposes.
--- 
## 🧪 Known Playwright Test Issues

### ❌ Test 14: Add a Vehicle (`#personid`)

The Playwright test attempts to fill an input field with `id="personid"`, which does not exist in my implementation.

- My project does not require this field because Supabase auto-generates `PersonID` on insert.
- The coursework brief does not ask students to manually input `PersonID`.
- All other form fields and IDs are implemented as required, including:
  - `name`, `address`, `dob`, `license`, `expire`
- The Add Vehicle functionality works correctly and includes:
  - Full validation
  - Duplicate checking
  - Success/error messaging
  - Owner association

✅ All other Playwright tests passed successfully (13/14).
---
✅ This project meets all coursework requirements and has been fully tested and deployed.

