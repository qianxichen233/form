const handler = (req, res) => {
    console.log(req.body);
	res.json({
		msg: 'Success'
	});
}

export default handler;