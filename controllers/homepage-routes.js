const router = require("express").Router();
const {
  User,
  Activity,
  Interest,
  UserDietaryPref,
  UserInterest,
} = require("../models");
const { withAuth } = require("../utils/auth");

//need routes to navigate throughout the app
//just get routes for events

router.get("/", (req, res) => {
  console.log(req.session);
  res.render("landing-page");
});

// [ ] TODO add routes to the users personal notifications

// GET /homepage
router.get(
  "/homepage",
  /* withAuth, */ (req, res) => {
    // [ ] TODO add homepage data
    res.render("homepage");
  }
);

// GET /login
router.get(
  "/login",
  /* withAuth, */ (req, res) => {
    res.render("login");
  }
);

// GET /signup
router.get(
  "/signup",
  /* withAuth, */ (req, res) => {
    res.render("signup");
  }
);

// GET /profile
// a logged-in user's profile
// FIXME nested route
router.get(
  "/profile/:id",
  /* withAuth, */
  (req, res) => {
    // FIXME unhandled Promise return
    User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "username", "email", "zip"],
      include: [
        {
          model: Interest,
          attributes: ["id", "name"],
          through: UserInterest,
          as: "interests",
        },
      ],
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with that ID." });
          return;
        }
        const user = dbUserData.get({ plain: true });
        res.render("userprofile", {
          user,
          // loggedIn: req.session.loggedIn,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
);
// FIXME unhandled Promise return
/* Interest.findAll({
  where: {
    id: req.params.id,
  },
  attributes: ["id", "name"],
  include: [{ model: Interest, attributes: ["id", "name"] }],
})
  .then((dbInterestData) => {
    if (!dbInterestData) {
      res.status(404).json({ message: "no user found with this interest" });
    }
    const interest = dbInterestData.get({ plain: true });
    // FIXME `posts` is not defined here
    res.render("userprofile", { interest, loggedIn: true });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
// FIXME unhandled Promise return
UserDietaryPref.findOne({
  where: {
    id: req.params.id,
  },
  attributes: ["id", "user_id", "dietary_pref_id"],
  include: [
    {
      model: UserDietaryPref,
      attributes: ["dietary_pref_id"],
    },
  ],
})
  .then((dbUserDietPrefData) => {
    if (!dbUserDietPrefData) {
      res
        .status(404)
        .json({ message: "no user found with this dietary preference" });
    }
    const userDietPref = dbUserDietPrefData.get({ plain: true });
    // FIXME `posts` is not defined here
    res.render("userprofile", { userDietPref, loggedIn: true });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  }); */

// FIXME router.get("/"...) already defined
// router
//   .get(
//     "/Activity/:id",
//     /* withAuth, */ (req, res) => {
//       // FIXME unhandled Promise return
//       Interest.findOne({
//         where: {
//           id: req.params.id,
//         },
//         attributes: ["id", "name", "description"],
//         include: [
//           {
//             model: Interest,
//             attributes: ["id", "name", "description"],
//           },
//         ],
//       }).then((dbInterestData) => {
//         const interest = dbInterestData.get({ plain: true });
//         activity.get({ plain: true });
//       });
//       // FIXME `posts` is not defined here
//       res.render("activity")({ activity, loggedIn: true });
//     }
//   )
//   .catch((err) => {
//     console.log(err);
//     res.status(500).json(err);
//   });

// FIXME router.get("/"...) already defined
router.get(
  "/Activity/:id",
  /* withAuth, */ (req, res) => {
    Activity.findAll({
      attribures: [
        "id",
        "title",
        "description",
        "location",
        "occurence",
        "organizer_id",
        "is_private",
        "seats",
        "rules",
        "price",
        "req_dietary_pref",
        "interest_id",
      ],
      include: [
        {
          model: "Activity",
          attributes: [
            "id",
            "title",
            "description",
            "location",
            "occurence",
            "organizer_id",
            "is_private",
            "seats",
            "rules",
            "price",
            "req_dietary_pref",
            "interest_id",
          ],
        },
      ],
    })
      .then((dbactivityData) => {
        const activity = dbactivityData.map((activity) =>
          activity.get({ plain: true })
        );
        // FIXME `posts` is not defined here
        res.render("activity")({ activity, loggedIn: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
);

module.exports = router;
