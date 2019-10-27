/*
*** @clearTag : trims a tag and 
*/

module.exports = (req, res, next) => {
    Object.keys(req.body).map(Element => {
        req.body[Element] = req.body[Element].toString()
        req.body[Element] = req.body[Element].trim().toLowerCase()
    })
    next()
}
