

const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },

    getIndex: function (req, res) {
        

        res.render('main');
    }
}

module.exports = controller;