<?php
$response = json_encode($_POST);
file_put_contents('../result/result.txt', $response);
