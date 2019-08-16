
/*
*** This module exports all middlewares responsable for validating forms ***
*** @register : This middleware is responsable for validate registration forms 
*/

module.exports = {
    register: (req, res, next) => {
        const   { firstname, lastname, username, email, password, gender } = req.body; // using objects destructuring to extract only needed informations from the request body

        function emailIsValid (email) { // using regex to check if its a valid email ex: emailname@domain.con
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        }

        function stongPassword(password) { // using regex to check if the password is strong enough : at least 8 characters one capital latter and one special character
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            return strongRegex.test(password);
        }

        const   errorObject = { // error object to store any the error message if its found
            status: 400,
            message: ""
        }
        if (firstname && lastname && username && gender && email && password) {

            if (gender.trim().length < 4)
                errorObject.message = "Invalid gender";
            if (firstname.trim().length < 6)
                errorObject.message = "Invalid firstname";
            if (lastname.trim().length < 6)
                errorObject.message = "Invalid lastname";
            if (username.trim().length < 6)
                errorObject.message = "Invalid username";
            if(!emailIsValid(email))
                errorObject.message = "Invalid email";
            if(!stongPassword(password))
                errorObject.message = "Please enter a strong password";
            
            if (!errorObject.message) // if error message is empty thats mean all test has been passed with no error so pass controll to the next middlware 
                next();
            else // end up the request and send back the error object
                res.send(JSON.stringify(errorObject));

        }
        else res.send(JSON.stringify({
            status: 400,
            message: "all informations is required"
        }));
    }
}