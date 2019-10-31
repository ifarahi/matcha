/*
*** @clearTag : trims a tag and 
*/

module.exports = (req, res, next) => {
    Object.keys(req.body).map(Element => {
        if ( req.body[Element] === null )
            res.json({
                status: false,
                message: 'invalid request'
            })
        else {
            try{
                req.body[Element] = req.body[Element].toString()
                req.body[Element] = req.body[Element].trim().toLowerCase()
            } catch ( err ) {
                res.json({
                    status: false,
                    message: 'invalid request'
                })
            }
        }
    })
    next()
}
