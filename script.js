const addBtn = document.querySelector(".btn-add");
const modal = document.querySelector(".modal");
const cancelBtn = document.querySelector(".btn-cancel");

addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

modal.addEventListener("click", (e) => {
  if (e.target.className === "modal") {
    modal.style.display = "none";
  }
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
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
const STORAGE_KEY = "BOOKS_APPS";
const SAVED_EVENT = "save-book";
//membuat fungsi addTodo
function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  let isCompleted = false;
  const doneRadio = document.getElementById("done");
  const notDoneRadio = document.getElementById("not-done");

  if (doneRadio.checked) {
    isCompleted = true;
  } else if (notDoneRadio.checked) {
    isCompleted = false;
  } else {
    alert("Form tidak boleh ada yang kosong");
    return;
  }
  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    year,
    isCompleted
  );
  if (title === "" || author === "" || year === "") {
    alert("Form tidak boleh ada yang kosong");
  } else {
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    modal.style.display = "none"; // Sesuaikan agar modal ditutup setelah buku ditambahkan
    saveData();
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
document.addEventListener(RENDER_EVENT, function () {
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

  //

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("btn-undo", "btn");
    undoButton.innerText = "Belum selesai di baca";

    undoButton.addEventListener("click", function () {
      undoButtonReadBooks(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("btn-remove", "btn");
    removeButton.innerText = "hapus buku";

    removeButton.addEventListener("click", function () {
      removeButtonBooks(bookObject.id);
    });
    const action = document.createElement("div");
    action.classList.add("action");
    action.append(undoButton, removeButton);

    container.append(action);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("btn-read", "btn");
    readButton.innerText = "selesai dibaca";

    readButton.addEventListener("click", function () {
      buttonReadBooks(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("btn-remove", "btn");
    removeButton.innerText = "hapus buku";

    removeButton.addEventListener("click", function () {
      removeButtonBooks(bookObject.id);
    });
    const action = document.createElement("div");
    action.classList.add("action");
    action.append(readButton, removeButton);

    container.append(action);
  }

  return container;
}
document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

function undoButtonReadBooks(booksID) {
  const bookTarget = searchBook(booksID);

  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function buttonReadBooks(booksID) {
  const bookTarget = searchBook(booksID);

  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeButtonBooks(booksID) {
  const bookTarget = searchBook(booksID);
  if (bookTarget == null) return;
  const index = books.indexOf(bookTarget);
  books.splice(index, 1);
  // Hapus data dari localStorage
  removeFromLocalStorage(bookTarget.id);
  alert(`buku ${bookTarget.title} terhapus`);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeFromLocalStorage(bookID) {
  if (isStorageExist()) {
    let data = [];
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData !== null) {
      data = JSON.parse(serializedData);
    }

    const newData = data.filter((book) => book.id !== bookID);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }
}

function searchBook(booksID) {
  for (const bookItem of books) {
    if (bookItem.id === booksID) {
      return bookItem;
    }
  }
}
