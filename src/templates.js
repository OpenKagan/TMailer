const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const DATABASE_LOCATION = process.env.DATABASE_LOCATION || path.join(process.cwd(), 'databases');

if (!fs.existsSync(DATABASE_LOCATION)) {
    fs.mkdirSync(DATABASE_LOCATION);
}

// Get a list of databases
const getDatabases = () => {
    return new Promise((resolve, reject) => {
        const directoryPath = DATABASE_LOCATION;
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            const dbFiles = files.filter(file => path.extname(file) === '.db');
            resolve(dbFiles);
        });
    });
};

const createDatabase = (dbName) => {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(DATABASE_LOCATION, `${dbName}.db`);

        fs.access(dbPath, fs.constants.F_OK, (err) => {
            if (!err) {
                return reject(new Error('Database already exists'));
            }
            const newDb = new sqlite3.Database(dbPath);
            newDb.serialize(() => {
                newDb.run("CREATE TABLE IF NOT EXISTS templates (id INTEGER PRIMARY KEY, subject TEXT, body TEXT)");
            });
            resolve();
        });
    });
};

// Save template to database
const saveTemplate = (dbName, subject, body) => {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(DATABASE_LOCATION, `${dbName}.db`);
        fs.access(dbPath, fs.constants.F_OK, (err) => {
            if (err) {
            return reject(new Error('Database does not exist'));
            }
            const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return reject(err);
            }
            db.run("INSERT INTO templates (id, subject, body) VALUES (?, ?, ?)", [null, subject, body], function(err) {
                if (err) {
                return reject(err);
                }
                resolve();
            });
            });
        });
    });
};

// Get all templates from database
const getAllTemplates = () => {
    return new Promise((resolve, reject) => {
        getDatabases().then((dbFiles) => {
            const templates = {};
            let pending = dbFiles.length;

            if (pending === 0) {
                return resolve(templates);
            }

            const checkPending = () => {
                if (--pending === 0) {
                    resolve(templates);
                }
            };

            dbFiles.forEach((dbFile) => {
                const dbPath = path.join(DATABASE_LOCATION, dbFile);
                const db = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        checkPending();
                        return;
                    }

                    db.all("SELECT * FROM templates", (err, rows) => {
                        if (!err) {
                            templates[dbFile.replace('.db', '')] = rows;
                        }
                        checkPending();
                    });
                });
            });
        }).catch(reject);
    });
};

// Get template from database
const getTemplate = (dbName, id) => {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(DATABASE_LOCATION, `${dbName}.db`);
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return reject(err);
            }
            db.get("SELECT * FROM templates WHERE id = ?", [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    });
};

// Update template in database
const updateTemplate = (dbName, id, subject, body) => {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(DATABASE_LOCATION, `${dbName}.db`);
        fs.access(dbPath, fs.constants.F_OK, (err) => {
            if (err) {
            return reject(new Error('Database does not exist'));
            }
            const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return reject(err);
            }
            db.run("UPDATE templates SET subject = ?, body = ? WHERE id = ?", [subject, body, id], function(err) {
                if (err) {
                return reject(err);
                }
                resolve();
            });
            });
        });
    });
};

// Delete template from database
const deleteTemplate = (dbName, id) => {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(DATABASE_LOCATION, `${dbName}.db`);
        fs.access(dbPath, fs.constants.F_OK, (err) => {
            if (err) {
            return reject(new Error('Database does not exist'));
            }
            const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return reject(err);
            }
            db.run("DELETE FROM templates WHERE id = ?", [id], function(err) {
                if (err) {
                return reject(err);
                }
                resolve();
            });
            });
        });
    });
};

module.exports = {
    getDatabases,
    createDatabase,
    saveTemplate,
    getTemplate,
    updateTemplate,
    getAllTemplates,
    deleteTemplate
};