const AuditLog = require('../models/AuditLog');

/**
 * Log an action to the AuditLog collection
 * @param {string} user - The user email or identifier
 * @param {string} type - The type of action (login, create, update, delete)
 * @param {string} message - A descriptive message
 * @param {Object} req - The express request object (optional, for IP address)
 */
const logAction = async (user, type, message, req = null) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : 'unknown';
    
    await AuditLog.create({
      user: user || 'System',
      type,
      message,
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress
    });
  } catch (err) {
    console.error('Audit Logging Error:', err);
  }
};

module.exports = { logAction };
