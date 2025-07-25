let popupoverlay = document.querySelector(".popup-overlay");
let popupbox = document.querySelector(".popup-box");
let addpopupbutton = document.getElementById("add-btn-popup");
let addcontentbutton = document.getElementById("add-content-btn");
let cancelcontentbutton = document.getElementById("cancel-content-btn");
let bookContainer = document.getElementById("notes-container");
let bookName = document.getElementById("book-name");
let authorName = document.getElementById("author-name");
let description = document.getElementById("description");

addpopupbutton.addEventListener("click", function(){
    popupoverlay.style.display = "flex";
    popupbox.style.display = "flex";
    bookName.focus();
});

cancelcontentbutton.addEventListener("click", function(e){
    e.preventDefault();
    popupoverlay.style.display = "none";
    popupbox.style.display = "none";
    
    document.querySelector(".popup-container").reset();
});

// addcontentbutton.addEventListener("click", function(e){
//     e.preventDefault();
//     let div = document.createElement("div");
//     div.setAttribute("class", "book-container");
//     div.innerHTML = (`
//         <h2>${bookName.value}</h2>
//         <h5>${authorName.value}</h5>
//         <p>${description.value}</p>
//         <button class="btn">delete</button>
//     `);
//     bookContainer.appendChild(div);
//     popupoverlay.style.display = "none";
//     popupbox.style.display = "none";

//     div.querySelector(".btn").addEventListener("click", function(){
//         div.remove();
//     });

//     bookName.value = "";
//     authorName.value = "";
//     description.value = "";
// });

// Fetch and display notes on page load
function loadNotes() {
    fetch("/api/notes")
        .then(res => res.json())
        .then(notes => {
            bookContainer.innerHTML = "";
            notes.forEach(note => {
                let div = document.createElement("div");
                div.setAttribute("class", "book-container");
                div.setAttribute("data-id", note.id);
                div.innerHTML = `
                    <h2>${note.bookName}</h2>
                    <h5>${note.authorName}</h5>
                    <p>${note.description}</p>
                    <button class="btn delete-btn" data-id="${note.id}">Delete</button>
                `;
                div.querySelector(".delete-btn").addEventListener("click", async function () {
                    const id = this.getAttribute("data-id");
                    await fetch(`/api/notes/${id}`, {
                        method: "DELETE",
                    });
                    loadNotes(); // Refresh notes after deletion
                });
                bookContainer.appendChild(div);
            });
        });
}
loadNotes();

// When adding a note
addcontentbutton.addEventListener("click", function(e){
    e.preventDefault();
    const note = {

        bookName: bookName.value,
        authorName: authorName.value,
        description: description.value
    };
    fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    }).then(() => {
        popupoverlay.style.display = "none";
        popupbox.style.display = "none";
        bookName.value = "";
        authorName.value = "";
        description.value = "";
        loadNotes();
    });
});

function displayNotes(notes) {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  notes.forEach((note) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.innerHTML = `
      <p>${note.content}</p>
      <button class="delete-btn" data-id="${note.id}">Delete</button>
    `;
    container.appendChild(noteDiv);
  });

  // Attach delete event to buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      loadNotes();
    });
  });
}
