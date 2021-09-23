const got = require('got');

function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}

/* for (let i = 0; i < 10; i++) {
    let n = getRandomInt(99);
    const { body } = got.post(`https://ancient-river-13326.herokuapp.com/users/`, {
        json: {
            name: `user${n}`,
            email: `user${n}@example.com`
        },
        responseType: 'text'
    });
    console.log(body);
} */

for (let i = 1; i < 1000; i++) {
    const { body } = got.delete(`https://ancient-river-13326.herokuapp.com/users/${i}`, {
        json: {
        },
        responseType: 'text'
    });
    console.log(body);
}

