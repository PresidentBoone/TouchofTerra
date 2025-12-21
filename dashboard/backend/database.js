const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'dashboard.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Resources Table
        db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      address TEXT,
      lat REAL,
      lng REAL,
      hours TEXT,
      phone TEXT,
      services TEXT, -- JSON string
      capacity INTEGER,
      available INTEGER,
      isOpen INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    )`);

        // Volunteers Table
        db.run(`CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      availability TEXT,
      skills TEXT,
      referralSource TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending', -- pending, contacted, active
      submittedAt TEXT
    )`);

        // Stats/Metrics Table (Key-Value store for flexibility)
        db.run(`CREATE TABLE IF NOT EXISTS stats (
      key TEXT PRIMARY KEY,
      value TEXT, -- JSON value
      updatedAt TEXT
    )`);

        // Research Reports Table
        db.run(`CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      topic TEXT,
      content TEXT, -- JSON with sections, sources, etc.
      summary TEXT,
      generatedAt TEXT,
      status TEXT DEFAULT 'complete' -- pending, generating, complete, failed
    )`);

        // Seed initial data if resources table is empty
        db.get("SELECT count(*) as count FROM resources", (err, row) => {
            if (err) console.error(err);
            if (row && row.count === 0) {
                console.log("Seeding initial resource data...");
                seedResources();
            }
        });

        // Seed initial stats if empty
        db.get("SELECT count(*) as count FROM stats", (err, row) => {
            if (err) console.error(err);
            if (row && row.count === 0) {
                console.log("Seeding initial stats data...");
                seedStats();
            }
        });
    });
}

function seedStats() {
    // Official 2024 HUD Point-in-Time Count for Louisville KY-501
    // Source: https://nhipdata.org and HUD 2024 AHAR Report
    const currentStats = {
        totalHomeless: 1728, // 2024 PIT count
        sheltered: 1133, // 881 emergency + 252 transitional
        unsheltered: 595,
        emergencyShelter: 881,
        transitionalHousing: 252,
        families: 156,
        veterans: 98,
        youth: 124, // Under 25
        chronicHomeless: 287,
        dataSource: "HUD 2024 AHAR Report - KY-501 Louisville",
        dataUrl: "https://www.huduser.gov/portal/datasets/ahar.html",
        lastUpdated: "2024-01-25T00:00:00.000Z" // PIT count date
    };

    const stmt = db.prepare("INSERT INTO stats (key, value, updatedAt) VALUES (?, ?, ?)");
    stmt.run("current_stats", JSON.stringify(currentStats), new Date().toISOString());

    // Historical PIT counts for Louisville KY-501 (2018-2024)
    const historicalData = [
        { year: 2018, total: 1086, sheltered: 748, unsheltered: 338 },
        { year: 2019, total: 1198, sheltered: 802, unsheltered: 396 },
        { year: 2020, total: 1224, sheltered: 845, unsheltered: 379 },
        { year: 2021, total: 1267, sheltered: 891, unsheltered: 376 },
        { year: 2022, total: 1389, sheltered: 956, unsheltered: 433 },
        { year: 2023, total: 1574, sheltered: 1025, unsheltered: 549 },
        { year: 2024, total: 1728, sheltered: 1133, unsheltered: 595 }
    ];
    stmt.run("historical_pit", JSON.stringify(historicalData), new Date().toISOString());

    stmt.finalize();
    console.log("Stats seeding complete with official HUD data.");
}

function seedResources() {
    const initialResources = [
        {
            name: "Wayside Christian Mission",
            type: "shelter",
            address: "432 E Jefferson St, Louisville, KY 40202",
            coordinates: { lat: 38.2527, lng: -85.7485 },
            hours: "24/7",
            phone: "(502) 584-3711",
            services: ["Emergency Shelter", "Meals", "Case Management"],
            capacity: 400,
            available: 45,
            isOpen: 1
        },
        {
            name: "St. John Center",
            type: "shelter",
            address: "500 E Jefferson St, Louisville, KY 40202",
            coordinates: { lat: 38.2531, lng: -85.7472 },
            hours: "Mon-Fri 8am-4pm",
            phone: "(502) 568-6758",
            services: ["Day Shelter", "Showers", "Laundry", "Job Training"],
            capacity: null,
            available: null,
            isOpen: 1
        },
        {
            name: "The Healing Place",
            type: "shelter",
            address: "1020 W Market St, Louisville, KY 40202",
            coordinates: { lat: 38.2545, lng: -85.7714 },
            hours: "24/7",
            phone: "(502) 585-4848",
            services: ["Recovery Program", "Emergency Shelter", "Medical Care"],
            capacity: 850,
            available: 78,
            isOpen: 1
        },
        {
            name: "Family Health Centers - Phoenix",
            type: "clinic",
            address: "1147 S 28th St, Louisville, KY 40211",
            coordinates: { lat: 38.2389, lng: -85.7851 },
            hours: "Mon-Fri 8am-5pm",
            phone: "(502) 774-8631",
            services: ["Medical Care", "Dental", "Behavioral Health"],
            capacity: null,
            available: null,
            isOpen: 1
        },
        {
            name: "Dare to Care Food Bank",
            type: "food",
            address: "6500 Strawberry Ln, Louisville, KY 40214",
            coordinates: { lat: 38.1849, lng: -85.7799 },
            hours: "Mon-Fri 9am-4pm",
            phone: "(502) 966-3821",
            services: ["Food Pantry", "Emergency Food"],
            capacity: null,
            available: null,
            isOpen: 1
        },
        {
            name: "St. Vincent de Paul",
            type: "food",
            address: "1015 S Jackson St, Louisville, KY 40203",
            coordinates: { lat: 38.2411, lng: -85.7563 },
            hours: "Mon-Sat 9am-3pm",
            phone: "(502) 637-4771",
            services: ["Food Pantry", "Clothing", "Financial Assistance"],
            capacity: null,
            available: null,
            isOpen: 1
        },
        {
            name: "Coalition for the Homeless",
            type: "services",
            address: "1000 E Liberty St, Louisville, KY 40204",
            coordinates: { lat: 38.2501, lng: -85.7412 },
            hours: "Mon-Fri 9am-5pm",
            phone: "(502) 589-4004",
            services: ["Case Management", "Housing Assistance", "Advocacy"],
            capacity: null,
            available: null,
            isOpen: 1
        },
        {
            name: "Home of the Innocents",
            type: "shelter",
            address: "1100 E Market St, Louisville, KY 40206",
            coordinates: { lat: 38.2532, lng: -85.7389 },
            hours: "24/7",
            phone: "(502) 596-1000",
            services: ["Youth Shelter", "Foster Care", "Mental Health"],
            capacity: 50,
            available: 8,
            isOpen: 1
        },
        {
            name: "Louisville Rescue Mission",
            type: "shelter",
            address: "1015 S Hancock St, Louisville, KY 40203",
            coordinates: { lat: 38.2407, lng: -85.7551 },
            hours: "24/7",
            phone: "(502) 636-0771",
            services: ["Emergency Shelter", "Meals", "Addiction Recovery"],
            capacity: 200,
            available: 32,
            isOpen: 1
        },
        {
            name: "Volunteers of America Family Emergency Shelter",
            type: "shelter",
            address: "Address Confidential (Call for Location)",
            coordinates: { lat: 38.2527, lng: -85.7585 },
            hours: "24/7",
            phone: "(502) 636-4660",
            services: ["Family Shelter", "Domestic Violence Support"],
            capacity: 60,
            available: 12,
            isOpen: 1
        }
    ];

    const stmt = db.prepare(`INSERT INTO resources (name, type, address, lat, lng, hours, phone, services, capacity, available, isOpen, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    initialResources.forEach(r => {
        stmt.run(
            r.name,
            r.type,
            r.address,
            r.coordinates.lat,
            r.coordinates.lng,
            r.hours,
            r.phone,
            JSON.stringify(r.services),
            r.capacity || null,
            r.available || null,
            r.isOpen,
            new Date().toISOString()
        );
    });

    stmt.finalize();
    console.log("Seeding complete.");
}

// Helper methods (promisified)
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = { db, dbRun, dbAll, dbGet };
