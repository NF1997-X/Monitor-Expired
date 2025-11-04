import {
  db,
  foodItems
} from "./chunk-EC5OU23Z.js";

// server/storage.ts
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
var MemStorage = class {
  foodItems;
  constructor() {
    this.foodItems = /* @__PURE__ */ new Map();
  }
  async getFoodItems() {
    return Array.from(this.foodItems.values()).filter((item) => !item.isDeleted);
  }
  async getDeletedFoodItems() {
    return Array.from(this.foodItems.values()).filter((item) => item.isDeleted);
  }
  async getFoodItem(id) {
    return this.foodItems.get(id);
  }
  async createFoodItem(insertItem) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const item = {
      ...insertItem,
      id,
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      notes: insertItem.notes || null
    };
    this.foodItems.set(id, item);
    return item;
  }
  async updateFoodItem(id, updateItem) {
    const existingItem = this.foodItems.get(id);
    if (!existingItem) {
      return void 0;
    }
    const updatedItem = {
      ...existingItem,
      ...updateItem
    };
    this.foodItems.set(id, updatedItem);
    return updatedItem;
  }
  async deleteFoodItem(id) {
    const item = this.foodItems.get(id);
    if (!item) {
      return false;
    }
    const deletedItem = {
      ...item,
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    };
    this.foodItems.set(id, deletedItem);
    return true;
  }
  async restoreFoodItem(id) {
    const item = this.foodItems.get(id);
    if (!item || !item.isDeleted) {
      return false;
    }
    const restoredItem = {
      ...item,
      isDeleted: false,
      deletedAt: null
    };
    this.foodItems.set(id, restoredItem);
    return true;
  }
  async permanentDeleteFoodItem(id) {
    return this.foodItems.delete(id);
  }
  async clearTrash() {
    const deletedItems = Array.from(this.foodItems.values()).filter((item) => item.isDeleted);
    deletedItems.forEach((item) => {
      this.foodItems.delete(item.id);
    });
  }
};
var DatabaseStorage = class {
  async getFoodItems() {
    return await db.select().from(foodItems).where(eq(foodItems.isDeleted, false));
  }
  async getDeletedFoodItems() {
    return await db.select().from(foodItems).where(eq(foodItems.isDeleted, true));
  }
  async getFoodItem(id) {
    const [item] = await db.select().from(foodItems).where(eq(foodItems.id, id));
    return item || void 0;
  }
  async createFoodItem(insertItem) {
    const [item] = await db.insert(foodItems).values({
      ...insertItem,
      notes: insertItem.notes || null
    }).returning();
    return item;
  }
  async updateFoodItem(id, updateItem) {
    const [item] = await db.update(foodItems).set(updateItem).where(eq(foodItems.id, id)).returning();
    return item || void 0;
  }
  async deleteFoodItem(id) {
    const [item] = await db.update(foodItems).set({
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }).where(eq(foodItems.id, id)).returning();
    return !!item;
  }
  async restoreFoodItem(id) {
    const [item] = await db.update(foodItems).set({
      isDeleted: false,
      deletedAt: null
    }).where(eq(foodItems.id, id)).returning();
    return !!item;
  }
  async permanentDeleteFoodItem(id) {
    const result = await db.delete(foodItems).where(eq(foodItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async clearTrash() {
    await db.delete(foodItems).where(eq(foodItems.isDeleted, true));
  }
};
var storage = new DatabaseStorage();

export {
  MemStorage,
  DatabaseStorage,
  storage
};
