<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include required files
require_once 'config/database.php';
require_once 'config/config.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/MemberController.php';
require_once 'controllers/EventController.php';
require_once 'controllers/ContentController.php';
require_once 'middleware/AuthMiddleware.php';

// Simple router
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/dashboard/BUCuC-WEB-/backend';
$path = str_replace($base_path, '', $request_uri);
$path = strtok($path, '?'); // Remove query parameters
$method = $_SERVER['REQUEST_METHOD'];

// Route definitions
$routes = [
    // Authentication routes
    'POST /api/auth/login' => ['AuthController', 'login'],
    'POST /api/auth/logout' => ['AuthController', 'logout'],
    'GET /api/auth/verify' => ['AuthController', 'verify'],
    
    // Member routes
    'GET /api/members' => ['MemberController', 'getAll'],
    'GET /api/members/panel' => ['MemberController', 'getPanel'],
    'GET /api/members/sb' => ['MemberController', 'getSB'],
    'POST /api/members' => ['MemberController', 'create'],
    'PUT /api/members' => ['MemberController', 'update'],
    'DELETE /api/members' => ['MemberController', 'delete'],
    
    // Event routes
    'GET /api/events' => ['EventController', 'getAll'],
    'POST /api/events' => ['EventController', 'create'],
    'PUT /api/events' => ['EventController', 'update'],
    'DELETE /api/events' => ['EventController', 'delete'],
    'POST /api/events/register' => ['EventController', 'register'],
    
    // Content routes
    'GET /api/content' => ['ContentController', 'get'],
    'PUT /api/content' => ['ContentController', 'update'],
];

// Find matching route
$route_key = $method . ' ' . $path;
$found_route = false;

foreach ($routes as $route => $handler) {
    if ($route === $route_key) {
        $found_route = true;
        
        // Check if route requires authentication
        $protected_routes = [
            'POST /api/members',
            'PUT /api/members',
            'DELETE /api/members',
            'POST /api/events',
            'PUT /api/events',
            'DELETE /api/events',
            'PUT /api/content'
        ];
        
        if (in_array($route, $protected_routes)) {
            $auth_result = AuthMiddleware::verify();
            if (!$auth_result['success']) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                exit();
            }
        }
        
        // Execute controller method
        $controller = new $handler[0]();
        $method_name = $handler[1];
        $controller->$method_name();
        break;
    }
}

// Handle 404
if (!$found_route) {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>
