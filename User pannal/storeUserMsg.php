<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userId = $_POST["userId"];
    $message = $_POST["message"];
    $sender = $_POST["sender"];

    if ($userId == "new") {
        $userId = saveNewUserAndGetId();
    }

    saveUserMessage($userId, $sender, $message);

    echo json_encode(["status" => "success", "message" => "User message sent successfully!"]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

function saveNewUserAndGetId()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "chatbot";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO chatbotnew (name, email, phone) VALUES ('New User', '', '')";
    $conn->query($sql);
    $newUserId = $conn->insert_id;

    $conn->close();

    return $newUserId;
}

function saveUserMessage($userId, $sender, $message)
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "chatbot";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO user_messages (user_id, admin_id, message) VALUES ('$userId', '101', '$message')";
    $conn->query($sql);

    $conn->close();
}
