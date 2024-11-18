const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/***
 * GET /
 * HOME
 * * */
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs and MongoDB",
    };

    let POST_PER_PAGE = 4;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(POST_PER_PAGE * page - POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const prevPage = parseInt(page) - 1;
    const hasNextPage = nextPage <= Math.ceil(count / POST_PER_PAGE);
    const hasPrevPage = prevPage >= 1;

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      prevPage: hasPrevPage ? prevPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

/***
 * GET /
 * Post :id
 * * */
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs and MongoDB",
    };

    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

/***
 * POST /
 * Post - searchTerm
 * * */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs and MongoDB",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const data = await Post.find({
      $or: [
        {
          title: { $regex: new RegExp(searchNoSpecialChar, "i") },
          body: { $regex: new RegExp(searchNoSpecialChar, "i") },
        },
      ],
    });

    res.render("search", {
      data,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});
/***
 * GET /
 * ABOUT
 * */
router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;

// function insertPostData() {
//   Post.insertMany([
//     {
//       title: "The Benefits of Morning Exercise",
//       body: "Starting your day with exercise can boost your energy levels, improve your focus, and set a positive tone for the day.",
//     },
//     {
//       title: "10 Easy Recipes for Busy Weeknights",
//       body: "Discover simple and quick meals that are both delicious and perfect for those with a hectic schedule.",
//     },
//     {
//       title: "How to Declutter Your Workspace",
//       body: "A clean workspace can boost productivity and reduce stress. Follow these easy steps to create an organized environment.",
//     },
//     {
//       title: "Top 5 Travel Destinations for 2024",
//       body: "From tropical beaches to bustling cities, here are the must-visit destinations for the upcoming year.",
//     },
//     {
//       title: "The Importance of Mental Health Awareness",
//       body: "Understanding and prioritizing mental health is crucial for overall well-being. Learn how to support yourself and others.",
//     },
//     {
//       title: "Simple Gardening Tips for Beginners",
//       body: "Get started with gardening by following these beginner-friendly tips and enjoy the therapeutic benefits of nature.",
//     },
//     {
//       title: "How to Improve Your Sleep Quality",
//       body: "Good sleep is essential for health. Discover techniques to fall asleep faster and wake up feeling refreshed.",
//     },
//     {
//       title: "Why Reading is Good for Your Brain",
//       body: "Reading regularly can enhance cognitive function and reduce stress. Learn more about the benefits of getting lost in a book.",
//     },
//     {
//       title: "Best Practices for Remote Work",
//       body: "Maximize productivity and maintain a healthy work-life balance while working from home with these strategies.",
//     },
//     {
//       title: "The Art of Mindful Eating",
//       body: "Mindful eating can transform your relationship with food. Discover how to enjoy meals while staying present and healthy.",
//     },
//   ]);
// }
