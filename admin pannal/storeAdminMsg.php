<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userId = $_POST["userId"];
    $message = $_POST["message"];

    // Save admin message to the database
    saveAdminMessage($userId, $message);

    echo "Admin message sent successfully!";
} else {
    http_response_code(400);
    echo "Invalid request method";
}

function saveAdminMessage($userId, $message)
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "chatbot";
    $adminId = "101"; // Assuming 101 is the admin's ID

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO admin_messages (admin_id, user_id, message) VALUES ('$adminId', '$userId', '$message')";
    $conn->query($sql);

    $conn->close();
}
