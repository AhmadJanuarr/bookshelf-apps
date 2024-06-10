const addBtn = document.querySelector(".btn-add");

addBtn.addEventListener("click", () => {
  const modal = document.querySelector(".modal");
  const cancelBtn = document.querySelector(".btn-cancel");
  modal.style.display = "flex";
  modal.addEventListener("click", (e) => {
    if (e.target.className === "modal") {
      modal.style.display = "none";
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    console.log(books);
  });
});

//membuat id yang unik dengan +new Date()
function generateId() {
  return +new Date();
}

//membuat objek buku
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

const books = [];
const RENDER_EVENT = "render-book";
//membuat fungsi addTodo
function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const generateID = generateId();
  const bookObject = generateBookObject(generateID, title, author, year, false);

  if (title === "" || author === "" || year === "") {
    alert("Form tidak boleh ada yang kosong");
  } else {
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

document.addEventListener("RENDER_EVENT", function () {
  const unCompletedBooks = document.getElementById("uncompleted-books");
  unCompletedBooks.innerHTML = "";

  const completedBooks = document.getElementById("completed-books");
  completedBooks.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unCompletedBooks.append(bookElement);
    } else {
      completedBooks.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.classList.add("title");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.classList.add("author");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("p");
  textYear.classList.add("year");
  textYear.innerText = bookObject.year;

  const book = document.createElement("div");
  book.classList.add("book");
  book.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(book);
  container.setAttribute("id", `book-${bookObject.id}`);

  // if (bookObject.isCompleted) {
  //   const undoButton = document.createElement("button");
  //   undoButton.innerText = "Belum selesai di baca";

  //   undoButton.addEventListener("click", function () {
  //     undoButtonReadBooks(bookObject.id);
  //   });

  //   container.append(undoButton);
  // } else {
  //   const readButton = document.createElement("button");
  //   readButton.classList.add("btn btn-read");
  //   readButton.innerText = "selesai dibaca";

  //   buttonRead.addEventListener("click", function () {
  //     buttonReadBooks(bookObject.id);
  //   });

  //   const removeButton = document.createElement("button");
  //   removeButton.classList.add("btn btn-remove");
  //   removeButton.innerText = "hapus buku";

  //   removeButton.addEventListener("click", function () {
  //     removeButtonBooks(bookObject.id);
  //   });
  //   const action = document.createElement("div");
  //   action.classList.add("action");
  //   action.append(readButton, removeButton);

  //   container.append(action);
  // }

  return container;
}

function undoButtonReadBooks(booksID) {}
