"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoWeAreRouter = void 0;
const express_1 = require("express");
const whoWeAreController_1 = require("./whoWeAreController");
const router = (0, express_1.Router)();
router.get("/", whoWeAreController_1.getWhoWeAre); // public
// admin routes. Mount behind your admin auth middleware, like the How We Work routes.
router.patch("/", whoWeAreController_1.updateSection);
router.post("/items", whoWeAreController_1.createItem);
router.patch("/items/:itemId", whoWeAreController_1.updateItem);
router.delete("/items/:itemId", whoWeAreController_1.deleteItem);
exports.whoWeAreRouter = router;
