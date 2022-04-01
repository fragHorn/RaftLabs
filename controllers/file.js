    const csv = require('csv-parser');
    const fs = require('fs');

    const books = [], authors = [], magazines = [];

    const call = (req, res) => {
        res.render('index', {
            books: books, 
            magazines: magazines,
            find: null,
            status: null
        });
    }

    const makeCSV = (data, type) => {
        const headers = ['title, isbn, authors,'];
        if(type === 'books')
            headers[0] += 'description';
        else
            headers[0] += 'publishedAt';
        const rows = data.map(d => `${d.title},${d.isbn},${d.authors},${d.description? d.description:d.publishedAt}`);
        return headers.concat(rows).join("\n");
    }

    const fn = async (req, res, callback) => {
        await new Promise((resolve, reject) => {
            fs.createReadStream('books.csv')
                .pipe(csv({separator: ';', headers: ['title', 'isbn', 'authors', 'description']}))
                .on('data', data => books.push(data))
                .on('end', () => {
                    books.splice(0, 1);
                    resolve(books);
                });
        });
        await new Promise((resolve, reject) => {
            fs.createReadStream('authors.csv')
                .pipe(csv({separator: ';', headers: ['email', 'firstName', 'lastName']}))
                .on('data', data => authors.push(data))
                .on('end', () => {
                    authors.splice(0, 1);
                    resolve(authors);
                });
        });
        await new Promise((resolve, reject) => {
            fs.createReadStream('magazine.csv')
                .pipe(csv({separator: ';', headers: ['title', 'isbn', 'authors', 'publishedAt']}))
                .on('data', data => magazines.push(data))
                .on('end', () => {
                    magazines.splice(0, 1);
                    resolve(magazines);
                });
        });
        callback(req, res);
    }

    exports.display = (req, res) => {
        if(books.length === 0)
            fn(req, res, call);
        else    
            call(req, res);
    }

    exports.find = (req, res) => {
        const isbn = req.body.find;
        let data = books.find(book => book.isbn === isbn);
        data = magazines.find(mag => mag.isbn === isbn);
        if(!data)
            data = 'not found';
        res.render('index', {
            books: books,
            magazines: magazines,
            find: data,
            status: null
        });
    }

    exports.findByEmail = (req, res) => {
        const email = req.body.email;
        const foundBooks = books.filter(book => book.authors.toLowerCase().includes(email.toLowerCase()))
        const foundMagazines = magazines.filter(mag => mag.authors.toLowerCase().includes(email.toLowerCase()))
        let status = true;
        if(foundBooks.length + foundMagazines.length === 0) 
            status = 'not found';
        res.render('index', {
            books: books,
            magazines: magazines,
            find: null,
            status: status,
            foundBooks: foundBooks,
            foundMagazines: foundMagazines 
        });
    }

    exports.sorted = (req, res) => {
        const sortedData = books.concat(magazines);
        sortedData.sort((a, b) => {
            if(a.title > b.title)
                return 1;
            else if(a.title < b.title)
                return -1;
            else
                return 0;
        });
        res.render('sorted', {
            data: sortedData
        });
    }

    exports.add = (req, res) => {
        const newData = {
            title: req.body.title,
            isbn: req.body.isbn,
            authors: req.body.email,
            description: req.body.desc
        };
        books.push(newData);
        fs.writeFile('newBooks.csv', makeCSV(books, 'books'), err => {
            if(!err)
                console.log('Added');
            else
                console.log(err);
        });
        res.redirect('/');
    }

    exports.addMag = (req, res) => {
        const newData = {
            title: req.body.title,
            isbn: req.body.isbn,
            authors: req.body.email,
            publishedAt: req.body.PublishAt
        };
        magazines.push(newData);
        fs.writeFile('newMagazines.csv', makeCSV(magazines, 'mag'), err => {
            if(!err)
                console.log('Added');
            else
                console.log(err);
        });
        res.redirect('/');
    }