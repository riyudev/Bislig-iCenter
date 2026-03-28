import HeroSlide from "../models/HeroSlide.js";

// Public: get all active slides ordered by `order`
export const getPublicSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    next(err);
  }
};

// Admin: get all slides (including inactive)
export const getAllSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    next(err);
  }
};

export const getSlideById = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json(slide);
  } catch (err) {
    next(err);
  }
};

export const createSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.create(req.body);
    res.status(201).json(slide);
  } catch (err) {
    next(err);
  }
};

export const updateSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json(slide);
  } catch (err) {
    next(err);
  }
};

export const deleteSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json({ message: "Slide deleted" });
  } catch (err) {
    next(err);
  }
};
