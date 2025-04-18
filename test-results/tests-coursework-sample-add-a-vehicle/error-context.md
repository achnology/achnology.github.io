# Test info

- Name: add a vehicle
- Location: /Users/user/Desktop/website-coursework/achnology.github.io/tests/coursework-sample.spec.js:135:1

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#personid')

    at /Users/user/Desktop/website-coursework/achnology.github.io/tests/coursework-sample.spec.js:145:36
```

# Page snapshot

```yaml
- banner:
  - navigation:
    - list:
      - listitem:
        - link "People search":
          - /url: people_search.html
      - listitem:
        - link "Vehicle search":
          - /url: vehicle_search.html
      - listitem:
        - link "Add a vehicle":
          - /url: add_vehicle.html
- complementary:
  - img "Sidebar Image"
- main:
  - heading "Add A Vehicle" [level=1]
  - text: "Registration Number:"
  - textbox "Registration Number:": LKJ23UO
  - text: "Vehicle Make:"
  - textbox "Vehicle Make:": Porsche
  - text: "Vehicle Model:"
  - textbox "Vehicle Model:": Taycan
  - text: "Vehicle Colour:"
  - textbox "Vehicle Colour:": white
  - text: "Owner Name:"
  - textbox "Owner Name:": Kai
  - button "Check owner"
  - button "Add vehicle"
  - paragraph
  - alert: "Error: Please select or add an owner first."
- contentinfo:
  - paragraph: © 2025 COMP1004 Coursework
```

# Test source

```ts
   45 | })
   46 |
   47 | // semantic structure elements
   48 | test('there is a <header> element', async ({ page }) => {
   49 |    const headerNum = await page.locator('header').count()
   50 |    expect(headerNum).toBeGreaterThan(0)
   51 | })
   52 |
   53 | test('there are three navigation links (<li>)', async ({ page }) => {
   54 |    const liNum = await page.locator('header').locator('ul').locator('li').count()
   55 |    // console.log(`liNum: ${liNum}`)
   56 |    expect(liNum).toBeGreaterThan(2)
   57 | })
   58 |
   59 | // there is an image or video in side bar
   60 | test('html - image or video', async ({ page }) => {
   61 |    const imageNum = await page.locator('aside').locator('img').count()
   62 |    const videoNum = await page.locator('aside').locator('video').count()
   63 |    expect(imageNum + videoNum).toBeGreaterThan(0)
   64 | })
   65 |
   66 | // # CSS tests
   67 |
   68 | // all pages use the same css
   69 |
   70 | test('same external css for all html pages', async ({ page }) => {
   71 |    
   72 |    const cssFile = await page.locator('link[rel="stylesheet"]').getAttribute('href')
   73 |
   74 |    await page.getByRole('link', { name: 'Vehicle search' }).click();
   75 |    await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', cssFile);
   76 |
   77 |
   78 |    await page.getByRole('link', { name: 'Add a vehicle' }).click();
   79 |    await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', cssFile);
   80 |
   81 | })
   82 |
   83 | // css flex for navigation links
   84 |
   85 | test('use css flex to place navigation links horizontally', async ({ page }) => {
   86 |
   87 |    await expect(page.locator('header').locator('ul')).toHaveCSS('display', 'flex')
   88 |
   89 |    await expect(page.getByRole('link', { name: 'Vehicle search' })).toHaveCSS('flex', '0 1 auto')
   90 |
   91 | })
   92 |
   93 | // border margin padding
   94 |
   95 | test('header should have padding 10px, margin 10px, and border 1px solid black', async ({ page }) => {
   96 |    
   97 |    const space = '10px'
   98 |    const border = '1px solid rgb(0, 0, 0)'
   99 |
  100 |    await expect(page.locator('header')).toHaveCSS('padding', space)
  101 |    await expect(page.locator('header')).toHaveCSS('margin', space)
  102 |    await expect(page.locator('header')).toHaveCSS('border', border)
  103 | })
  104 |
  105 | // CSS grid
  106 |
  107 | test ('CSS grid is used to layout the page components', async({page}) => {
  108 |    await expect(page.locator('#container')).toHaveCSS('display','grid')
  109 | })
  110 |
  111 | // # JavaScript Tests
  112 |
  113 | // people search
  114 | test ('search "rachel" should return two records', async ({page}) => {
  115 |    await page.locator('#name').fill('rachel')
  116 |    await page.getByRole('button', { name: 'Submit' }).click();
  117 |    await expect(page.locator('#results')).toContainText('SG345PQ')
  118 |    await expect(page.locator('#results')).toContainText('JK239GB')
  119 |    await expect(page.locator('#results').locator('div')).toHaveCount(2)
  120 |    await expect(page.locator('#message')).toContainText('Search successful')
  121 | })
  122 |
  123 | // vehicle search
  124 | test('search "KWK24JI" should return tesla but no owner', async ({page}) => {
  125 |    await page.getByRole('link', { name: 'Vehicle search' }).click();
  126 |    await page.locator('#rego').fill('KWK24JI')
  127 |    await page.getByRole('button', { name: 'Submit' }).click();
  128 |    await expect(page.locator('#results')).toContainText('Tesla')
  129 |    await expect(page.locator('#results').locator('div')).toHaveCount(1)
  130 |    await expect(page.locator('#message')).toContainText('Search successful')
  131 | })
  132 |
  133 |
  134 | // add a vehicle (missing owner)
  135 | test('add a vehicle', async ({page}) => {
  136 |    await page.getByRole('link', { name: 'Add a vehicle' }).click();
  137 |    await page.locator('#rego').fill('LKJ23UO')
  138 |    await page.locator('#make').fill('Porsche')
  139 |    await page.locator('#model').fill('Taycan')
  140 |    await page.locator('#colour').fill('white')
  141 |    await page.locator('#owner').fill('Kai')
  142 |    await page.getByRole('button', { name: 'Add vehicle' }).click();
  143 |
  144 |    // add a new person
> 145 |    await page.locator('#personid').fill('6')
      |                                    ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  146 |    await page.locator('#name').fill('Kai')
  147 |    await page.locator('#address').fill('Edinburgh')
  148 |    await page.locator('#dob').fill('1990-01-01')
  149 |    await page.locator('#license').fill('SD876ES')
  150 |    await page.locator('#expire').fill('2030-01-01')
  151 |    await page.getByRole('button', { name: 'Add owner' }).click();
  152 |
  153 |    await expect(page.locator('#message')).toContainText('Vehicle added successfully')
  154 |
  155 |    await page.getByRole('link', { name: 'People search' }).click();
  156 |    await page.locator('#name').fill('Kai')
  157 |    await page.getByRole('button', { name: 'Submit' }).click();
  158 |    await expect(page.locator('#results')).toContainText('SD876ES')
  159 |    await expect(page.locator('#results').locator('div')).toHaveCount(1)
  160 | })
```