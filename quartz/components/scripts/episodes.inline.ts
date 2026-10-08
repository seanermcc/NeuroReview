document.addEventListener("nav", () => {
  for (const browser of document.querySelectorAll<HTMLElement>(
    ".episode-browser[data-browser-key]",
  )) {
    const form = browser.querySelector<HTMLFormElement>("form")!
    const list = browser.querySelector<HTMLUListElement>(".episode-list")!
    const rows = [...list.querySelectorAll<HTMLElement>(".episode-row")]
    const count = browser.querySelector<HTMLElement>(".episode-count")!
    const empty = browser.querySelector<HTMLElement>(".episode-empty")!
    const pagination = browser.querySelector<HTMLElement>(".episode-pagination")!
    const previous = pagination.querySelector<HTMLButtonElement>('[data-page="previous"]')!
    const next = pagination.querySelector<HTMLButtonElement>('[data-page="next"]')!
    const pageNumber = pagination.querySelector<HTMLElement>(".episode-page-number")!
    const categories = new Map(
      rows.map((row) => [row, JSON.parse(row.dataset.categories!) as string[]]),
    )
    let page = 1
    const field = (name: string) =>
      form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement
    const render = () => {
      const query = field("query").value.trim().toLowerCase().split(/\s+/).filter(Boolean)
      const show = field("show").value
      const category = field("category").value
      const rating = field("rating").value
      const sort = field("sort").value
      const size = Number(field("size").value)
      const matches = rows.filter(
        (row) =>
          query.every((term) => row.dataset.search!.includes(term)) &&
          (!show || row.dataset.show === show) &&
          (!category || categories.get(row)!.includes(category)) &&
          (!rating || (rating === "rated" ? row.dataset.rating !== "" : row.dataset.rating === "")),
      )
      matches.sort((a, b) => {
        let result = 0
        if (sort.startsWith("rating")) {
          if (a.dataset.rating === "" && b.dataset.rating !== "") return 1
          if (b.dataset.rating === "" && a.dataset.rating !== "") return -1
          result =
            (Number(a.dataset.rating) - Number(b.dataset.rating)) * (sort === "rating-asc" ? 1 : -1)
        } else if (sort === "newest" || sort === "oldest") {
          const ad = Date.parse(a.dataset.date!),
            bd = Date.parse(b.dataset.date!)
          if (!Number.isFinite(ad) && Number.isFinite(bd)) return 1
          if (!Number.isFinite(bd) && Number.isFinite(ad)) return -1
          result = (ad - bd) * (sort === "oldest" ? 1 : -1)
        }
        return (
          result || a.dataset.title!.localeCompare(b.dataset.title!, undefined, { numeric: true })
        )
      })
      const pages = Math.max(1, Math.ceil(matches.length / size))
      page = Math.min(page, pages)
      rows.forEach((row) => {
        row.hidden = true
      })
      const start = (page - 1) * size
      for (const row of matches.slice(start, start + size)) {
        row.hidden = false
        list.append(row)
      }
      count.textContent = matches.length
        ? `${start + 1}-${Math.min(start + size, matches.length)} of ${matches.length} episodes`
        : "0 episodes"
      empty.hidden = matches.length !== 0
      pagination.hidden = matches.length <= size
      pageNumber.textContent = `Page ${page} of ${pages}`
      previous.disabled = page === 1
      next.disabled = page === pages
    }
    const update = () => {
      page = 1
      render()
    }
    const reset = (event: Event) => {
      event.preventDefault()
      for (const name of ["query", "show", "category", "rating"]) field(name).value = ""
      field("sort").value = "rating-desc"
      field("size").value = "25"
      update()
    }
    const submit = (event: Event) => event.preventDefault()
    const prevPage = () => {
      page--
      render()
      browser.scrollIntoView({ block: "start" })
    }
    const nextPage = () => {
      page++
      render()
      browser.scrollIntoView({ block: "start" })
    }
    form.hidden = false
    form.addEventListener("input", update)
    form.addEventListener("change", update)
    form.addEventListener("reset", reset)
    form.addEventListener("submit", submit)
    previous.addEventListener("click", prevPage)
    next.addEventListener("click", nextPage)
    render()
    window.addCleanup(() => {
      form.removeEventListener("input", update)
      form.removeEventListener("change", update)
      form.removeEventListener("reset", reset)
      form.removeEventListener("submit", submit)
      previous.removeEventListener("click", prevPage)
      next.removeEventListener("click", nextPage)
    })
  }
})
