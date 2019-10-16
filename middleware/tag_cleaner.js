/*
*** @clearTag : trims a tag and 
*/

module.exports = (req, res, next) => {
    if ( req.method == "GET" ){
        req.params.tagName = req.params.tagName.toString()
        req.params.tagName = req.params.tagName.trim().toLowerCase()
    }
    else if ( req.method == "POST" )
    {
        req.body.tagname = req.body.tagname.toString()
        req.body.tagname = req.body.tagname.trim().toLowerCase()
    }
    next()
}