<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["userId"])) {
    $userId = $_GET["userId"];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "chatbot";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $sql = "SELECT 'admin' as sender, message, timestamp FROM admin_messages WHERE user_id = '$userId'
            UNION
            SELECT 'user' as sender, message, timestamp FROM user_messages WHERE user_id = '$userId'
            ORDER BY timestamp";

    $result = $conn->query($sql);

    $messages = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $messages[] = array(
                'sender' => $row['sender'],
                'message' => $row['message']
            );
        }
    }

    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($messages);
} else {
    http_response_code(400);
    echo "Invalid request method or missing userId parameter.";
}
