const fs = require('fs');

const handler = (req, res) => {
	fs.writeFileSync('data/answer.json', JSON.stringify(req.body));
	console.log(req.body);
	res.json({
		msg: 'Success'
	});
}

export default handler;