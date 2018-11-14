<?php
header("Content-type:application/vnd.ms-excel");
header("Content-Disposition:filename=country.xls");
$file = fopen($path, 'r');
	echo $file;
?>