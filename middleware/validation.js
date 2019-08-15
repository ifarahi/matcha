module.exports = {
    register: (req, res, next) => {
        const   { firstname, lastname, username, email, password } = req.body;
        if (firstname && lastname && username && email && password) {

        }
        else res.send(JSON.stringify({
            status: 400,
            message: "all informations is required"
        }));
    }
}