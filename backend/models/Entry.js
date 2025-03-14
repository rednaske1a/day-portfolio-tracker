
class Entry {
  // Get all entries for a user
  static async findByUserId(db, userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM entries WHERE userId = ? ORDER BY date DESC', 
        [userId]
      );
      return rows.map(row => new Entry(row));
    } catch (error) {
      console.error('Error finding entries by userId:', error);
      throw error;
    }
  }
  
  // Get entry by id
  static async findById(db, id) {
    try {
      const [rows] = await db.query('SELECT * FROM entries WHERE id = ?', [id]);
      return rows.length ? new Entry(rows[0]) : null;
    } catch (error) {
      console.error('Error finding entry by id:', error);
      throw error;
    }
  }
  
  // Save new entry
  async save(db) {
    try {
      const result = await db.query(
        `INSERT INTO entries 
        (userId, date, score, category, description) 
        VALUES (?, ?, ?, ?, ?)`,
        [this.userId, this.date, this.score, this.category, this.description]
      );
      
      this.id = result[0].insertId;
      this.createdAt = new Date();
      return this;
    } catch (error) {
      console.error('Error saving entry:', error);
      throw error;
    }
  }
  
  // Update entry
  async update(db) {
    try {
      await db.query(
        `UPDATE entries SET 
        date = ?, score = ?, category = ?, description = ? 
        WHERE id = ?`,
        [this.date, this.score, this.category, this.description, this.id]
      );
      return this;
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  }
  
  // Delete entry
  static async deleteById(db, id) {
    try {
      await db.query('DELETE FROM entries WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }
  
  // Constructor - initialize from database row or new object
  constructor(data) {
    if (data) {
      this.id = data.id;
      this.userId = data.userId;
      this.date = data.date;
      this.score = data.score;
      this.category = data.category;
      this.description = data.description;
      this.createdAt = data.createdAt;
    }
  }
}

module.exports = Entry;
