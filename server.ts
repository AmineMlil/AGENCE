import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import * as admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin (Optional: requires service account in env)
// If you don't have a service account, some admin features will be limited.
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized");
  } else {
    // Try to use default credentials if available
    admin.initializeApp();
    console.log("Firebase Admin initialized with default credentials");
  }
} catch (error) {
  console.warn("Firebase Admin could not be initialized. Manual user creation will be disabled.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Create User (Admin Only)
  app.post("/api/admin/create-user", async (req, res) => {
    const { email, password, role, requesterEmail } = req.body;

    // Security: Only allow specific admin email to create users for now
    const SUPER_ADMIN = "amine.mlil23@gmail.com";
    if (requesterEmail !== SUPER_ADMIN) {
      return res.status(403).json({ error: "Unauthorized. Seul l'administrateur peut créer des utilisateurs." });
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: role,
        emailVerified: true,
      });

      // Optionally set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: role === 'admin' });

      res.json({ success: true, uid: userRecord.uid });
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: error.message || "Erreur lors de la création de l'utilisateur." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
