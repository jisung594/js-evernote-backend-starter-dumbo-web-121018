document.addEventListener('DOMContentLoaded', () => {
  // console.log('ADD UR CODE HERE!')

  const mainPage = document.querySelector(".main")
  const createNoteBtn = document.querySelector("#create")
  const sidebar = document.querySelector('.sidebar')

  getNotesOnSidebar();

  function getNotesOnSidebar() {
    fetch("http://localhost:3000/api/v1/notes")
      .then(res => res.json())
      .then(notes => {
        notes.forEach(note => {
          const li = document.createElement("li")
          li.setAttribute('data-id', note.id)
          li.className = 'note'
          li.innerText = `Title: ${note.title}`
          const ul = document.querySelector(".notes")
          ul.append(li)
        })
      })
  }


  delegateClick();

  function delegateClick(e) {
    sidebar.addEventListener('click', e => {
      if (e.target.className === "note") {
        const clickedNoteId = e.target.dataset.id

        fetch(`http://localhost:3000/api/v1/notes/${clickedNoteId}`)
        .then(res => res.json())
        .then(note => {
          mainPage.innerHTML = `<h3>Title: ${note.title}</h3>
          <p>${note.body}</p>`
        })
      }
    })
  }

  function putNewNoteFormOnDom() {
    const note = {}
    note.id = sidebar.dataset.id
    note.title = document.querySelector("#note-title").innerText
    note.body = document.querySelector("#note-body").innerText
    mainPage.innerHTML = renderNewNoteForm(note)
  }

  createNoteBtn.addEventListener("click", renderNewNoteForm)

  function renderNewNoteForm(note) {
    mainPage.innerHTML =
       `<h3>Create a Note</h3>
       <form class=“new-note-form” data-note-id = ${note.id}>
         <ul>
          <li>
            <label for="note-title">Title</label>
            <input type=“text” name=“note-title” placeholder=“Title” id="note-title" value=${note.title}><br>
          </li>
          <li>
            <label for="note-body">Body</label>
            <input type=“text” name=“note-body” placeholder=“Body” id="note-body" value=${note.body}>

        </ul>
        <input type="submit" />
     </form>`
  }

  // const form = document.querySelector(".new-note-form")
  mainPage.addEventListener("submit", createNote)

  function createNote(event) {
    event.preventDefault();
    let titleField = event.target[0].value
    let bodyField = event.target[1].value

    fetch("http://localhost:3000/api/v1/notes", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title: titleField,
        body: bodyField
      })
    })
      .then(res => res.json())
      .then(newNote => getNotesOnSidebar(newNote))
  }


})
