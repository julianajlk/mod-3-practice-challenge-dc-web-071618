document.addEventListener("DOMContentLoaded", function() {
  fetchBooks()
});

// Get a list of books & render them
function fetchBooks() {
  fetch(`http://localhost:3000/books`)
  .then(response => response.json())
  .then(jsonData => {
    jsonData.forEach(book => {renderBooks(book)})
  })
}

function renderBooks(book){
  let listUl = document.querySelector('#list')
  let liElement = document.createElement('li')
  listUl.appendChild(liElement)
  liElement.innerText = book.title
  liElement.id = `li-${book.id}`
  liElement.addEventListener('click', function() {
    fetchOneBook(book)
  })
}

function fetchOneBook(book) {
  // let bookId = event.target.id.split('-')[1]
  fetch(`http://localhost:3000/books/${book.id}`)
  .then(response => response.json())
  .then(bookData => {
    renderOneBook(bookData)
  })
  document.getElementById('show-panel').innerHTML = ''
}

function renderOneBook(bookData){
  let bookContainer = document.querySelector('#show-panel')
  let title = document.createElement('h3')
  title.innerText = bookData.title
  let img = document.createElement('img')
  img.src = bookData.img_url
  let description = document.createElement('p')
  description.innerText = bookData.description
  let readButton = document.createElement('button')
  readButton.innerText = 'Like Book'
  readButton.id = `like-button-${bookData.id}`
  readButton.addEventListener('click', function() {
    editPatchFetch(bookData)
  })

  bookContainer.appendChild(title)
  bookContainer.appendChild(img)
  bookContainer.appendChild(description)

  bookData.users.forEach(user => {
     let usersName = document.createElement('h5')
     usersName.innerText = user.username
     bookContainer.appendChild(usersName)
   }
  )

  bookContainer.appendChild(readButton)
}


//You can like a book by clicking on a button. You are user 1 {"id":1, "username":"pouros"}, so to like a book send a PATCH request to http://localhost:3000/books/:id with an array of users who like the book. This array should be equal to the existing array of users that like the book, plus your user.
function editPatchFetch(bookData) {
  bookData.users.push({id:1, username: "pouros"})
  likedUsers = bookData.users
  let data = {users: likedUsers}
  fetch(`http://localhost:3000/books/${bookData.id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(response => response.json())
  .then(likeData => {
    document.querySelector('#show-panel').innerHTML = ''
    renderOneBook(likeData)
  })
}
