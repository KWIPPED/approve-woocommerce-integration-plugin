<?
require 'plugin-update-checker-4.9/plugin-update-checker.php';
$myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
	'https://github.com/user-name/KWIPPED/',
	__FILE__,
	'woocommerce-approve-plugin'
);
?>