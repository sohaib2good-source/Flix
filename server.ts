import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3006", 10);

  app.use(express.json());

  // Backend Persistent JSON Storage Configuration
  const dataDir = path.join(process.cwd(), "data");
  const registrationsFilePath = path.join(dataDir, "registrations.json");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(registrationsFilePath)) {
    fs.writeFileSync(registrationsFilePath, JSON.stringify([], null, 2), "utf-8");
  }

  // POST /api/registrations - Saves complete registration JSON structure in the background
  app.post("/api/registrations", (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ success: false, error: "Invalid registration payload" });
      }

      let registrations: any[] = [];
      try {
        const raw = fs.readFileSync(registrationsFilePath, "utf-8");
        registrations = JSON.parse(raw || "[]");
      } catch {
        registrations = [];
      }

      const now = new Date();
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const applicationId = `PL-${year}${month}${day}-${randomSuffix}`;
      const recordId = payload.id || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Complete Normalized JSON Structure
      const completeRecord = {
        id: recordId,
        applicationId,
        createdAt: payload.createdAt || now.toISOString(),
        entity: {
          type: payload.entity?.type || "private",
          companyName: payload.entity?.companyName || "",
          primaryOwner: {
            details: {
              firstName: payload.entity?.primaryOwner?.details?.firstName || "",
              lastName: payload.entity?.primaryOwner?.details?.lastName || "",
              companyName: payload.entity?.primaryOwner?.details?.companyName || "",
              email: payload.entity?.primaryOwner?.details?.email || "",
              phone: payload.entity?.primaryOwner?.details?.phone || "",
              mobile: payload.entity?.primaryOwner?.details?.mobile || "",
              nationality: payload.entity?.primaryOwner?.details?.nationality || "",
              address: payload.entity?.primaryOwner?.details?.address || "",
              postCode: payload.entity?.primaryOwner?.details?.postCode || "",
              town: payload.entity?.primaryOwner?.details?.town || "",
              country: payload.entity?.primaryOwner?.details?.country || "",
              birth: {
                day: payload.entity?.primaryOwner?.details?.birth?.day || "",
                month: payload.entity?.primaryOwner?.details?.birth?.month || "",
                year: payload.entity?.primaryOwner?.details?.birth?.year || "",
                place: payload.entity?.primaryOwner?.details?.birth?.place || "",
              },
              identity: {
                nationality: payload.entity?.primaryOwner?.details?.identity?.nationality || "",
                passportNumber: payload.entity?.primaryOwner?.details?.identity?.passportNumber || "",
                issuingCountry: payload.entity?.primaryOwner?.details?.identity?.issuingCountry || "",
              },
              differentDelivery: payload.entity?.primaryOwner?.details?.differentDelivery || "no",
              deliveryAddress: payload.entity?.primaryOwner?.details?.deliveryAddress || "",
              deliveryPostCode: payload.entity?.primaryOwner?.details?.deliveryPostCode || "",
              deliveryTown: payload.entity?.primaryOwner?.details?.deliveryTown || "",
              deliveryCountry: payload.entity?.primaryOwner?.details?.deliveryCountry || "",
            },
          },
          secondaryOwner: {
            enabled: !!payload.entity?.secondaryOwner?.enabled,
            details: payload.entity?.secondaryOwner?.enabled
              ? {
                  firstName: payload.entity?.secondaryOwner?.details?.firstName || "",
                  lastName: payload.entity?.secondaryOwner?.details?.lastName || "",
                  address: payload.entity?.secondaryOwner?.details?.address || "",
                  postCode: payload.entity?.secondaryOwner?.details?.postCode || "",
                  town: payload.entity?.secondaryOwner?.details?.town || "",
                  country: payload.entity?.secondaryOwner?.details?.country || "",
                  email: payload.entity?.secondaryOwner?.details?.email || "",
                  phone: payload.entity?.secondaryOwner?.details?.phone || "",
                  mobile: payload.entity?.secondaryOwner?.details?.mobile || "",
                  birth: {
                    day: payload.entity?.secondaryOwner?.details?.birth?.day || "",
                    month: payload.entity?.secondaryOwner?.details?.birth?.month || "",
                    year: payload.entity?.secondaryOwner?.details?.birth?.year || "",
                    place: payload.entity?.secondaryOwner?.details?.birth?.place || "",
                  },
                  identity: {
                    passportNumber: payload.entity?.secondaryOwner?.details?.identity?.passportNumber || "",
                  },
                }
              : null,
          },
          operator: {
            firstName: payload.entity?.operator?.firstName || "",
            lastName: payload.entity?.operator?.lastName || "",
          },
        },
        registration: {
          serviceId: payload.registration?.serviceId || "polish_flag_registry",
          vessel: {
            name: payload.registration?.vessel?.name || "",
            length: payload.registration?.vessel?.length || "",
            maxPassengers: payload.registration?.vessel?.maxPassengers || "",
            portOfChoice: payload.registration?.vessel?.portOfChoice || "GDANSK",
            category: payload.registration?.vessel?.category || "none",
            comments: payload.registration?.vessel?.comments || "",
          },
          engines: payload.registration?.engines || [],
        },
        package: {
          vesselClass: payload.package?.vesselClass || "0_to_7",
          serviceType: payload.package?.serviceType || "new_flag",
          usageIntent: payload.package?.usageIntent || "private",
          mmsiConfig: payload.package?.mmsiConfig || "none",
          speed: payload.package?.speed || "standard",
          shippingMethod: payload.package?.shippingMethod || "standard",
          totalPrice: Number(payload.package?.totalPrice) || 350,
        },
        financial: {
          total: (Number(payload.financial?.total || payload.package?.totalPrice) || 350).toFixed(2),
          currency: payload.financial?.currency || "EUR",
          status: payload.financial?.status || "pending",
        },
        system: {
          status: payload.system?.status || "DOCUMENTATION_SUBMITTED",
          paymentStatus: payload.system?.paymentStatus || "WAITING_PAYMENT_LINK",
          serverTimestamp: now.toISOString(),
          adminComments: payload.system?.adminComments || "",
          source: "web_application",
          userAgent: req.headers["user-agent"] || "",
        },
        history: [
          {
            timestamp: now.toISOString(),
            changes: "Digital documentation submitted online with background JSON structure.",
          },
        ],
      };

      registrations.unshift(completeRecord);
      fs.writeFileSync(registrationsFilePath, JSON.stringify(registrations, null, 2), "utf-8");

      return res.status(201).json({
        success: true,
        id: recordId,
        applicationId,
        message: "Registration created successfully with background JSON structure",
        data: completeRecord,
      });
    } catch (error: any) {
      console.error("Error saving registration JSON:", error);
      return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
    }
  });

  // GET /api/registrations - Retrieve background JSON registrations
  app.get("/api/registrations", (_req, res) => {
    try {
      if (!fs.existsSync(registrationsFilePath)) {
        return res.json({ success: true, count: 0, registrations: [] });
      }
      const raw = fs.readFileSync(registrationsFilePath, "utf-8");
      const registrations = JSON.parse(raw || "[]");
      return res.json({ success: true, count: registrations.length, registrations });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error?.message });
    }
  });

  // GET /api/registrations/:id - Retrieve specific background JSON record
  app.get("/api/registrations/:id", (req, res) => {
    try {
      if (!fs.existsSync(registrationsFilePath)) {
        return res.status(404).json({ success: false, error: "Not found" });
      }
      const raw = fs.readFileSync(registrationsFilePath, "utf-8");
      const registrations = JSON.parse(raw || "[]");
      const found = registrations.find(
        (r: any) => r.id === req.params.id || r.applicationId === req.params.id
      );
      if (!found) {
        return res.status(404).json({ success: false, error: "Registration not found" });
      }
      return res.json({ success: true, registration: found });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error?.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
