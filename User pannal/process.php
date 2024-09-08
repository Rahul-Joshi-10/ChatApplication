<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $phone = $_POST["phone"];
    $email = $_POST["email"];

    // Save user information to the database and get the user ID
    $userId = saveUserInformation($name, $phone, $email);

    // Return the user ID as a JSON response
    header('Content-Type: application/json');
    echo json_encode(array('userId' => $userId));
} else {
    http_response_code(400);
    echo "Invalid request method";
}

function saveUserInformation($name, $phone, $email) {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "chatbot";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO chatbotnew (name, phone, email) VALUES ('$name', '$phone', '$email')";
    $conn->query($sql);

    // Get the user ID of the newly inserted user
    $userId = $conn->insert_id;

    $conn->close();

    return $userId;
}
?>
