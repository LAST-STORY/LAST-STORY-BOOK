// DOM Elements
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const authorFilter = document.getElementById('authorFilter');
const bookGrid = document.getElementById('bookGrid');
const bookCount = document.getElementById('bookCount');
const noBooks = document.getElementById('noBooks');

// Global variables
let allBooks = [];
let filteredBooks = [];
let allAuthors = [];
let allGenres = [];

// Performance optimization - debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Convert bookData to flat array for easier processing
    convertBookDataToFlatArray();

    // Populate filters
    populateAuthorFilter();
    populateGenreFilter();

    // Display all books initially
    displayBooks(allBooks);

    // Add event listeners (debounced search for better performance)
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    genreFilter.addEventListener('change', applyFilters);
    authorFilter.addEventListener('change', applyFilters);

    // Keyboard navigation: blur search on Enter
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();
        }
    });
}

function convertBookDataToFlatArray() {
    allBooks = [];
    bookData.forEach(book => {
        allBooks.push({
            title: book.title,
            author: book.writer,
            genre: book.genre
        });
    });

    // Get unique authors and genres
    allAuthors = [...new Set(allBooks.map(book => book.author))];
    allGenres = [...new Set(allBooks.map(book => book.genre))];
}

function populateAuthorFilter() {
    authorFilter.innerHTML = '<option value="">সব লেখক</option>';
    allAuthors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorFilter.appendChild(option);
    });
}

function populateGenreFilter() {
    genreFilter.innerHTML = '<option value="">সব ধরন</option>';
    allGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

// Single unified filter + search function
function applyFilters() {
    const selectedGenre = genreFilter.value;
    const selectedAuthor = authorFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();

    filteredBooks = allBooks.filter(book => {
        const genreMatch = selectedGenre === '' || book.genre === selectedGenre;
        const authorMatch = selectedAuthor === '' || book.author === selectedAuthor;
        const searchMatch = searchTerm === '' ||
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm);

        return genreMatch && authorMatch && searchMatch;
    });

    displayBooks(filteredBooks);
}

function displayBooks(booksToDisplay) {
    if (booksToDisplay.length === 0) {
        bookGrid.style.display = 'none';
        noBooks.style.display = 'block';
        bookCount.textContent = '0';
    } else {
        bookGrid.style.display = 'grid';
        noBooks.style.display = 'none';
        bookCount.textContent = booksToDisplay.length;

        // Clear existing books
        bookGrid.innerHTML = '';

        // Create book cards
        booksToDisplay.forEach((book, index) => {
            const bookCard = createBookCard(book, index + 1);
            bookGrid.appendChild(bookCard);
        });
    }
}

function createBookCard(book, serialNumber) {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
        <div class="book-title-container">
            <span class="book-serial">${serialNumber}.</span>
            <h3 class="book-title">${book.title}</h3>
        </div>
        <p class="book-author">
            <i class="fas fa-user-edit"></i>
            ${book.author}
        </p>
        <span class="book-genre">${book.genre}</span>
    `;

    return card;
}
