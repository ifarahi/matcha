module.exports = (req, res, next) => {
    const filter = req.body.filter;
    const defaultFilter = {
        age: [18,27],
        tags: 1,
        distance: 10,
        rating: [0, 1]
    }
    if (filter !== undefined) {
        if (filter.age === undefined){
            filter.age = defaultFilter.age;
        }
        if (filter.tags === undefined){
            filter.tags = defaultFilter.tags;
        }
        if (filter.distance === undefined) {
            filter.distance = defaultFilter.distance;
        }
        if (filter.rating === undefined) {
            filter.rating = defaultFilter.rating;
        }
    } else {
        req.filter = defaultFilter;
    }
    next();
}