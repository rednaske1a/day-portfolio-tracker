
const bcrypt = require('bcrypt');

class User {
  // Get user by id
  static async findById(db, id) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows.length ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }
  
  // Get user by email
  static async findByEmail(db, email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows.length ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  // Get user by username
  static async findByUsername(db, username) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows.length ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }
  
  // Get user by handle
  static async findByHandle(db, handle) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE handle = ?', [handle]);
      return rows.length ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by handle:', error);
      throw error;
    }
  }
  
  // Save new user
  async save(db) {
    try {
      // Hash password if it's been modified
      if (this._password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this._password, salt);
        delete this._password;
      }
      
      const result = await db.query(
        `INSERT INTO users 
        (username, email, handle, password, verificationToken, avatar) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [this.username, this.email, this.handle, this.password, this.verificationToken, this.avatar]
      );
      
      this.id = result[0].insertId;
      return this;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }
  
  // Update user
  async update(db) {
    try {
      const fields = [];
      const values = [];
      
      // Only update fields that are set
      if (this._password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this._password, salt);
        delete this._password;
        fields.push('password = ?');
        values.push(this.password);
      }
      
      if (this.verified !== undefined) {
        fields.push('verified = ?');
        values.push(this.verified);
      }
      
      if (this.verificationToken === null) {
        fields.push('verificationToken = NULL');
      } else if (this.verificationToken) {
        fields.push('verificationToken = ?');
        values.push(this.verificationToken);
      }
      
      if (this.avatar) {
        fields.push('avatar = ?');
        values.push(this.avatar);
      }
      
      if (fields.length === 0) return this;
      
      // Add id as the last value
      values.push(this.id);
      
      await db.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  // Constructor - initialize from database row or new object
  constructor(data) {
    if (data) {
      this.id = data.id;
      this.username = data.username;
      this.email = data.email;
      this.handle = data.handle;
      this.password = data.password;
      this.verified = data.verified;
      this.verificationToken = data.verificationToken;
      this.avatar = data.avatar;
      this.createdAt = data.createdAt;
    }
  }
  
  // Set password (will be hashed on save)
  setPassword(password) {
    this._password = password;
    return this;
  }
  
  // Compare password
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  
  // Get public profile
  getPublicProfile() {
    return {
      id: this.id,
      name: this.username,
      email: this.email,
      handle: this.handle,
      avatar: this.avatar,
      verified: this.verified
    };
  }
}

module.exports = User;
