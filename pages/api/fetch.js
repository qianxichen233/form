const fs = require('fs');

const handler = (req, res) => {
    const data = fs.readFileSync('data/questions.json');
    res.status(200).send(data);
}

export default handler;