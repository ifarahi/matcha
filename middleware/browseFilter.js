module.exports = (req, res, next) => {
    const filter = req.body.filter;
    const defaultFilter = {
        age: [18,37],
        commonTags: 0,
        tags: [],
        distance: 370,
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
        if (filter.commonTags === undefined) {
            filter.commonTags = defaultFilter.commonTags;
        }
    } else {
        req.body.filter = defaultFilter;
    }
    next();
}