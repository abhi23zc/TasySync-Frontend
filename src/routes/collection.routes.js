import { Router } from "express";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Collection } from "../models/collection.model.js";
import { Task } from "../models/task.model.js";
import auth from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";
const router = Router();

// Give me all collection
router.get("/", auth, async (req, res) => {
  try {
    const userId = String(req.user._id);
    const collections = await Collection.find({ userId: userId });
    res.status(200).json(new ApiResponse(200, "Collections", collections));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error Occured", error));
  }
});

// Create new collection
router.post("/create", auth, async (req, res) => {
  try {
    const { name, category } = req.body;
    const collections = await Collection.find({
      userId: String(req.user._id),
    });

    for (const collection of collections) {
      if (collection.name === name) {
        return res
          .status(401)
          .json(
            new ApiError(400, "Error Occurred", "Collection Already Exists")
          );
      }
    }

    const newCollection = new Collection({
      name,
      category,
      userId: String(req.user._id),
    });

    await newCollection.save();

    return res
      .status(201)
      .json(new ApiResponse(201, "Collection Created", newCollection));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error Occurred", error.message));
  }
});

router.delete("/deleteCollection", auth, async (req, res) => {
  try {
    const { id } = req.query;

    const collection = await Collection.findByIdAndDelete(id);

    if (collection) {
      return res
        .status(200)
        .json(new ApiResponse(200, "Collection Deleted", collection));
    } else
      return res.status(404).json(new ApiError(404, "Collection Not Found"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, "Error Occured", error));
  }
});

router.put("/updateCollection", auth, async (req, res) => {
  try {
    const { id, name, category } = req.query;

    const collection = await Collection.findById(id);

    if (collection) {
      collection.name = name;
      collection.category = category;
      await collection.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "Collection Updated", collection));
    } else
      return res.status(404).json(new ApiError(404, "Collection Not Found"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, "Error Occured", error));
  }
});

router.get("/getTasks", auth, async (req, res) => {
  try {
    const { id } = req.query;
    const tasks = await Task.find({ collection: id }).sort({ date: -1 });
    if (tasks) {
      return res.status(200).json(new ApiResponse(200, "Tasks", tasks));
    }
  } catch (e) {
    return res.status(500).json(new ApiError(500, "Error Occured", error));
  }
});

// Create task for give collection
router.post("/createTask", auth, async (req, res) => {
  try {
    const { title, desc, collectionId } = req.body;
    const task = new Task({
      title,
      description: desc,
      collection: collectionId,
    });
    await task.save();
    if (task) {
      return res
        .status(200)
        .json(new ApiResponse(200, "Task Created Succesfully", task));
    }
  } catch (e) {
    return res.status(500).json(new ApiError(500, "Error Occured", error));
  }
});

router.put("/updateTask", auth, async (req, res) => {
  try {
    const { id, title, desc, status } = req.query;
    const task = await Task.findById(id);
    if (task) {
      task.title = title;
      task.status = status;
      task.description = desc;
      await task.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "Task Updated Succesfully", task));
    } else {
      return res.status(404).json(new ApiError(404, "Task Not Found"));
    }
  } catch (e) {
    return res.status(500).json(new ApiError(500, "Error Occured", error));
  }
});
router.delete("/deleteTask", auth, async (req, res) => {
  try {
    const { id } = req.query;
    const task = await Task.findByIdAndDelete(id);

    if (task) {
      return res
        .status(200)
        .json(new ApiResponse(200, "Task Deleted Succesfully", task));
    } else {
      return res.status(404).json(new ApiError(404, "Task Not Found"));
    }
  } catch (e) {
    return res.status(500).json(new ApiError(500, "Error Occured", error));
  }
});

router.get("/share", auth, async (req, res) => {
  try {
    const { email, collectionId } = req.query;
    const user = await User.findOne({ email: email });
    user.share = collectionId;
    await user.save();
    res.status(200).json(new ApiResponse(200, "success", user));
  } catch (e) {
    res.status(401).json(new ApiError(401, "Error while sharing", e));
  }
});

export const collectionRoute = router;
