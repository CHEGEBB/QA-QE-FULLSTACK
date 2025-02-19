

document.addEventListener('DOMContentLoaded', function () {
    const bookImage = document.querySelector('.book-image')
    const bookTitle = document.querySelector('.book-title')
    const bookAuthor = document.querySelector('.book-author')
    const bookPages = document.getElementById('pages')
    const bookYear = document.getElementById('year')
    const image = document.querySelector('.image')
    const bookDescription = document.querySelector('.book-description')
    const bookPublisher = document.querySelector('.book-publisher')
    // const card = document.getElementsByClassName('.book-card')
    // card.foreach((book)=>{
    //     bookImage = book.image;

    // })

    const data = []
    async function fetchData() {
        try {

            const response = await fetch(`http://localhost:3000/Books`);
            const dataJson = await response.json();
            data.push(dataJson)

        } catch (error) {
            console.log('There was an error', error)
            console.error(error.message)
        }
        return data;
    }
    fetchData().then(
        results => {
            results.map(result => {
                if (result.genre === 'Dystopian') {
                    // console.log("Caution: Dystopian Future: ", result)
                } else if (result.pages > 500) {
                    // console.log('Pages exceed 500: ', result)

                }


            })
            const books = results.map(result => {
                return `📖 ${result.year} by ${result.author} - ${result.genre} (${result.pages} pages)`;

            })
            console.log(books)
            const advancedSearch = results.filter((book) => {
                if (book.year < 1950) {
                    // console.log(book)
                }

            })

            const sortAlpabetical = results.sort((a, b) => a.title.localeCompare(b.title))
            // console.log("sorted by Alphabetical Order:============================================")
            // console.log(sortAlpabetical)

            const sortedBooks = results.sort((a, b) => a.year - b.year);
            // console.log("sorted by year:============================================")
            // console.log(sortedBooks);

            const sortedPages = results.sort((a, b) => a.pages - b.pages);
            // console.log("sorted by Pages:===========================================")
            // console.log(sortedPages);


            //     console.log(yearSort)
            //     const sortedBooks = []
            //     const sorted = results.map((book)=>{
            //         for(let i = 0; i<yearSort.length; i++){
            //             if(yearSort[i] === book.year  ){
            //                 sortedBooks.push(book)

            //             }
            //         }


            //     }


            // )
            // console.log(sorted)

            results.forEach((book) => {
                
                image.src = book[0].image
                bookTitle.textContent = book[0].title;
                bookAuthor.textContent = book[0].author
                bookYear.textContent =book[0].year;
                bookPages.textContent = book[0].pages;
                bookDescription.textContent =book[0].description
                bookPublisher.textContent = book[0].publisher


                console.log('this boook', book[0])
            })

        }



    )



})



