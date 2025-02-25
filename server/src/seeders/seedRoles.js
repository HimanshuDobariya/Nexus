import mongoose from "mongoose";
import connectDatabase from "../config/db.config.js";
import Role from "../models/roles-permission.model.js";
import { RolePermissions } from "../utils/role-permission.js";

const seedRoles = async () => {
  console.log("Seeding roles started...");

  try {
    // Ensure database connection
    await connectDatabase();
    console.log("Database connected.");

    // Clear existing roles
    console.log("Clearing existing roles...");
    await Role.deleteMany({});

    const rolePromises = Object.entries(RolePermissions).map(
      async ([roleName, permissions]) => {
        const existingRole = await Role.findOne({ name: roleName });

        if (!existingRole) {
          await Role.create({ name: roleName, permissions });
          console.log(`Role '${roleName}' added with permissions.`);
        } else {
          console.log(`ℹ️ Role '${roleName}' already exists.`);
        }
      }
    );

    // Wait for all role operations to complete
    await Promise.all(rolePromises);

    console.log("Role seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during role seeding:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("Database disconnected.");
    }
  }
};

seedRoles().catch((error) =>
  console.error("Error running seed script:", error)
);
