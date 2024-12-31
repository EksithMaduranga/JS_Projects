let currentPage = 0;
let searchQuery = '';
let isLoading = false;

const searchInput = document.getElementById("searchInput");
const bookList = document.getElementById("bookList");
const endMessage = document.getElementById("endMessage");
const loadingSpinner = document.getElementById("loadingSpinner");

searchInput.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    if (searchQuery.length > 2) {
        currentPage = 0; // reset pagination on new query
        bookList.innerHTML = ''; // clear previous results
        endMessage.style.display = 'none';
        fetchBooks(searchQuery);
    } else {
        bookList.innerHTML = ''; // clear results if the input is empty
    }
});

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50 && !isLoading) {
        fetchBooks(searchQuery);
    }
});

function fetchBooks(query) {
    if (!query) return;

    isLoading = true;
    loadingSpinner.style.display = 'inline-block';

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${currentPage * 10}&maxResults=10`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingSpinner.style.display = 'none';
            if (data.items && data.items.length > 0) {
                currentPage++;
                displayBooks(data.items);
            } else {
                if (currentPage === 0) {
                    endMessage.style.display = 'block'; // Show no results message
                }
            }
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            loadingSpinner.style.display = 'none';
            isLoading = false;
            alert("Something went wrong. Please try again.");
        });
}

function displayBooks(books) {
    books.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-item");

        const bookImage = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/200x300';
        const bookTitle = book.volumeInfo.title || "No Title Available";
        const bookAuthor = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author";
        const bookDescription = book.volumeInfo.description || "No description available.";

        bookItem.innerHTML = `
            <img src="${bookImage}" alt="${bookTitle}">
            <h3>${bookTitle}</h3>
            <p><strong>Author:</strong> ${bookAuthor}</p>
            <p>${bookDescription}</p>
        `;

        bookList.appendChild(bookItem);
    });

    // If no more books available, display the end message
    if (books.length < 10) {
        endMessage.style.display = 'block';
    }
}
