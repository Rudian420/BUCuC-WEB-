<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'bucuc_web');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');

// JWT Configuration
define('JWT_SECRET', 'your-secret-key-change-this-in-production');
define('JWT_EXPIRY', 3600 * 24); // 24 hours

// Application Configuration
define('APP_ENV', 'development');
define('APP_DEBUG', true);

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080'
]);

// File Upload Configuration
define('UPLOAD_DIR', '../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']);

// Email Configuration (for future use)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', '');
define('SMTP_PASSWORD', '');

// Security Configuration
define('PASSWORD_MIN_LENGTH', 8);
define('BCRYPT_COST', 12);

// Pagination Configuration
define('DEFAULT_PAGE_SIZE', 10);
define('MAX_PAGE_SIZE', 100);

// Timezone
date_default_timezone_set('America/Toronto');

// Error Reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
?>
