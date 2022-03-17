const router = require("express").Router();
const requireLogIn = require("../middleware/isLoggedIn")

router.use(requireLogIn);

const renderProfilePage = (req, res) => {
    res.render("profile", { user: req.session.currentUser });
  };
  router.get("/profile", renderProfilePage);


module.exports = router;