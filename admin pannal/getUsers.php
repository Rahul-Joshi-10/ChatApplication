<?php

$users = getUsersFromDatabase();

header('Content-Type: application/json');
echo json_encode($users);

function getUsersFromDatabase()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "chatbot";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT id, name FROM chatbotnew";
    $result = $conn->query($sql);

    $users = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = array(
                'id' => $row['id'],
                'name' => $row['name']
            );
        }
    }

    $conn->close();

    return $users;
}
