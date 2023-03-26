const protect = (async (req, res, next) => {
    const{user} = req.session;

    if(!user) {
        res.status(401);
        throw new Error('Not authorized, no user');
    }

    req.user = user;

    next();

});

module.exports = protect;