const db = require("../config/database");

class BaseRepository {
    static get db() {
        return db;
    }
}

module.exports = BaseRepository;
